/**
 * Hub Facility Hire — form + booking handler
 *
 * Setup:
 * 1. Spreadsheet: "Hub Bookings", tab "Submissions" (headers A–Q)
 * 2. Calendar: "Hub Facility Hire" → set CALENDAR_ID below
 * 3. Extensions → Apps Script → paste this file → Save
 * 4. Script properties → TRAINER_IMPORT_KEY (staff app secret)
 * 5. Deploy → New deployment → Web app (Execute as: Me, Anyone)
 * 6. Copy /exec URL into public site VITE_FORM_ENDPOINT
 *
 * Script version: 2026-06-20-hub-v1
 */

const NOTIFY_EMAIL = "staff@example.com";
const CALENDAR_ID = "YOUR_CALENDAR_ID@group.calendar.google.com";
const SHEET_NAME = "Submissions";
const TIMEZONE = "Pacific/Auckland";
const SITE_ADDRESS = "24 Waitapu Road, Tākaka 7110";

/** Keep in sync with shared/bookingServiceTypes.ts */
const BOOKING_TYPES = {
  makerspace_hourly: { label: "Makerspace — hourly", sessionMinutes: 60, calendarBlockMinutes: 60, priceLabel: "$10", facilityPrefix: "MAKERSPACE" },
  makerspace_half_day: { label: "Makerspace — half day (4 hours)", sessionMinutes: 240, calendarBlockMinutes: 240, priceLabel: "$35", facilityPrefix: "MAKERSPACE" },
  makerspace_full_day: { label: "Makerspace — full day", sessionMinutes: 480, calendarBlockMinutes: 480, priceLabel: "$55", facilityPrefix: "MAKERSPACE" },
  kitchen_hourly: { label: "Kitchen — hourly", sessionMinutes: 60, calendarBlockMinutes: 60, priceLabel: "$12", facilityPrefix: "KITCHEN" },
  kitchen_half_day: { label: "Kitchen — half day (4 hours)", sessionMinutes: 240, calendarBlockMinutes: 240, priceLabel: "$40", facilityPrefix: "KITCHEN" },
  kitchen_full_day: { label: "Kitchen — full day", sessionMinutes: 480, calendarBlockMinutes: 480, priceLabel: "$70", facilityPrefix: "KITCHEN" },
  earth_building_hourly: { label: "Earth Building — hourly", sessionMinutes: 60, calendarBlockMinutes: 60, priceLabel: "TBD", facilityPrefix: "EARTH BUILDING" },
  earth_building_half_day: { label: "Earth Building — half day (4 hours)", sessionMinutes: 240, calendarBlockMinutes: 240, priceLabel: "TBD", facilityPrefix: "EARTH BUILDING" },
  earth_building_full_day: { label: "Earth Building — full day", sessionMinutes: 480, calendarBlockMinutes: 480, priceLabel: "TBD", facilityPrefix: "EARTH BUILDING" },
  equipment_hourly: { label: "Equipment — hourly", sessionMinutes: 60, calendarBlockMinutes: 60, priceLabel: "$20 + $50 deposit", facilityPrefix: "EQUIPMENT" }
};

const SLOT_INTERVAL_MINUTES = 60;
const BUFFER_MINUTES = 0;
const MIN_NOTICE_HOURS = 16;
const MAX_DAYS_AHEAD = 60;
const BOOKING_DAYS = [0, 1, 2, 3, 4, 5, 6];

/** Keep in sync with shared/bookingCategories.ts */
const CATEGORIES = {
  facility: { label: "Facility hire" },
  equipment: { label: "Equipment hire" }
};

/** Keep in sync with src/data/bookingFacilities.ts */
const LOCATIONS = {
  "The Makerspace": { lat: -40.856, lng: 172.805, category: "facility", facilityPrefix: "MAKERSPACE" },
  "The Kitchen": { lat: -40.856, lng: 172.805, category: "facility", facilityPrefix: "KITCHEN" },
  "Earth Building": { lat: -40.856, lng: 172.805, category: "facility", facilityPrefix: "EARTH BUILDING" },
  "Fruit processing equipment": { lat: -40.856, lng: 172.805, category: "equipment", facilityPrefix: "EQUIPMENT" }
};

const STAFF_PROCESSED_COL = 15;
const EXTENDED_DATA_COL = 16;
const EXTENDED_JSON_MAX = 4000;
const CATEGORY_COL = 17;

const BOOKING_POLICY_NOTE =
  "Payment is due as arranged with Hub staff. This booking does not process payment online.";

function getBookingWindowForDate(date) {
  return { startHour: 8, lastStartHour: 18, season: "standard" };
}

function getTrainerImportKey() {
  return PropertiesService.getScriptProperties().getProperty("TRAINER_IMPORT_KEY") || "";
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const honeypot = String(data.website || "").trim();
    if (honeypot) {
      return jsonResponse({ success: true });
    }

    const action = String(data.action || "enquiry").trim().toLowerCase();
    if (action === "availability") return handleAvailability(data);
    if (action === "book") return handleBooking(data);
    if (action === "list_bookings") return handleListBookings(data);
    if (action === "mark_imported") return handleMarkImported(data);
    if (action === "mark_dismissed") return handleMarkDismissed(data);
    return handleEnquiry(data);
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || "Server error." });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    message: "Hub facility hire form endpoint. Use POST."
  });
}

function handleEnquiry(data) {
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const email = String(data.email || "").trim();
  const organisation = String(data.organisation || "").trim();
  const message = String(data.message || "").trim();
  const topic = String(data.topic || "").trim();
  const category = String(data.category || "allotment-enquiry").trim();

  if (!name || !phone || !email || !message) {
    return jsonResponse({ success: false, message: "Missing required fields." });
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, message: "Invalid email address." });
  }

  appendSubmissionRow([
    new Date(), "Enquiry", name, phone, email, organisation, topic, "", message,
    "", "", "", "Received", "", "", "", category
  ]);

  sendNotificationEmail({
    subject: "New Hub enquiry" + (topic ? " — " + topic : ""),
    replyTo: email,
    body:
      "Type: Enquiry\nCategory: " + category + "\n" +
      "Name: " + name + "\nPhone: " + phone + "\nEmail: " + email + "\n" +
      "Organisation: " + (organisation || "(not provided)") + "\n" +
      (topic ? "Topic: " + topic + "\n" : "") + "\n" + message
  });

  return jsonResponse({ success: true });
}

function handleAvailability(data) {
  const dateStr = String(data.date || "").trim();
  const category = String(data.category || "").trim();
  const locationName = String(data.location || "").trim();
  const bookingType = resolveBookingType(data);

  if (!category || !CATEGORIES[category]) {
    return jsonResponse({ success: false, message: "Invalid or missing category." });
  }
  if (!locationName || !isValidLocationForCategory(locationName, category)) {
    return jsonResponse({ success: false, message: "Invalid facility for this category." });
  }
  if (!BOOKING_TYPES[bookingType]) {
    return jsonResponse({ success: false, message: "Invalid booking type." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return jsonResponse({ success: false, message: "Invalid date. Use YYYY-MM-DD." });
  }

  const date = parseLocalDate(dateStr);
  if (!date) {
    return jsonResponse({ success: false, message: "Invalid date." });
  }
  if (!isDateBookable(date)) {
    return jsonResponse({ success: true, category: category, slots: [] });
  }

  const bookingWindow = getBookingWindowForDate(date);
  const durations = getBookingDurations(bookingType);
  const rawSlots = getAvailableSlots(date, locationName, bookingType);

  const slots = rawSlots.map(function (slot) {
    const sessionEnd = new Date(slot.start.getTime() + durations.sessionMinutes * 60 * 1000);
    return {
      start: formatLocalIso(slot.start),
      end: formatLocalIso(sessionEnd),
      label: formatSlotLabel(slot.start)
    };
  });

  return jsonResponse({
    success: true,
    category: category,
    slots: slots,
    booking_window: {
      start_label: formatHourLabel(bookingWindow.startHour),
      last_start_label: formatHourLabel(bookingWindow.lastStartHour),
      season: bookingWindow.season
    }
  });
}

function handleBooking(data) {
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const email = String(data.email || "").trim();
  const organisation = String(data.organisation || "").trim();
  const message = String(data.message || "").trim();
  const slotStartStr = String(data.slot_start || "").trim();
  const location = String(data.location || "").trim();
  const category = String(data.category || "").trim();
  const extendedJsonRaw = normalizeExtendedJson(data.extended_json);
  const bookingType = resolveBookingType(data);
  const durations = getBookingDurations(bookingType);
  const typeConfig = BOOKING_TYPES[bookingType];

  if (!phone || !slotStartStr || !location || !category) {
    return jsonResponse({ success: false, message: "Missing required fields." });
  }
  if (!name && !organisation) {
    return jsonResponse({ success: false, message: "Please provide your name or organisation." });
  }
  if (!BOOKING_TYPES[bookingType]) {
    return jsonResponse({ success: false, message: "Invalid booking type." });
  }
  if (!CATEGORIES[category]) {
    return jsonResponse({ success: false, message: "Invalid category." });
  }
  if (!isValidLocationForCategory(location, category)) {
    return jsonResponse({ success: false, message: "Invalid facility for this category." });
  }
  if (email && !isValidEmail(email)) {
    return jsonResponse({ success: false, message: "Invalid email address." });
  }

  const slotStart = parseLocalDateTime(slotStartStr);
  if (!slotStart) {
    return jsonResponse({ success: false, message: "Invalid appointment time." });
  }

  const sessionEnd = new Date(slotStart.getTime() + durations.sessionMinutes * 60 * 1000);
  const calendarEnd = new Date(slotStart.getTime() + durations.calendarBlockMinutes * 60 * 1000);
  const addonsText = buildAddonsSummary(extendedJsonRaw);

  const lock = LockService.getScriptLock();
  var lockHeld = false;

  try {
    lock.waitLock(15000);
    lockHeld = true;

    if (!isSlotBookable(slotStart, calendarEnd, location, bookingType)) {
      return jsonResponse({
        success: false,
        message: "That time is no longer available. Please choose another slot."
      });
    }

    const calendar = getBookingCalendar();
    const title = buildEventTitle(name, organisation, location, typeConfig.facilityPrefix);
    const description = buildEventDescription({
      name: name, phone: phone, email: email, organisation: organisation,
      message: message, location: location, category: category, bookingType: bookingType,
      slotStart: slotStart, sessionEnd: sessionEnd, calendarEnd: calendarEnd,
      extendedJson: extendedJsonRaw, addonsText: addonsText
    });

    const event = calendar.createEvent(title, slotStart, calendarEnd, {
      description: description,
      location: SITE_ADDRESS
    });

    if (email) {
      event.addGuest(email);
      sendClientConfirmationEmail({
        to: email,
        name: name || organisation,
        submissionSummary: buildBookingSubmissionSummary({
          bookingType: bookingType, category: category, slotStart: slotStart,
          sessionEnd: sessionEnd, location: location, name: name, phone: phone,
          email: email, organisation: organisation, message: message,
          extendedJson: extendedJsonRaw
        })
      });
    }

    appendSubmissionRow([
      new Date(), "Booking", name, phone, email, organisation,
      typeConfig.label, addonsText, message,
      slotStart, calendarEnd, event.getId(), "Confirmed", location, "",
      extendedJsonRaw, category
    ]);

    sendNotificationEmail({
      subject: "New Hub booking — " + location,
      replyTo: email || NOTIFY_EMAIL,
      body: "Type: Booking\n\n" + buildBookingSubmissionSummary({
        bookingType: bookingType, category: category, slotStart: slotStart,
        sessionEnd: sessionEnd, location: location, name: name, phone: phone,
        email: email, organisation: organisation, message: message,
        extendedJson: extendedJsonRaw
      }) + "\n\n" + BOOKING_POLICY_NOTE
    });

    return jsonResponse({
      success: true,
      message: "Booking confirmed.",
      calendar_event_id: event.getId(),
      slot: {
        start: formatLocalIso(slotStart),
        end: formatLocalIso(sessionEnd),
        label: formatSlotLabel(slotStart)
      }
    });
  } finally {
    if (lockHeld) lock.releaseLock();
  }
}

function resolveBookingType(data) {
  return String((data && data.booking_type) || "").trim();
}

function getBookingDurations(bookingType) {
  const config = BOOKING_TYPES[bookingType] || BOOKING_TYPES.makerspace_hourly;
  return {
    sessionMinutes: config.sessionMinutes,
    calendarBlockMinutes: config.calendarBlockMinutes,
    label: config.label,
    priceLabel: config.priceLabel
  };
}

function isValidLocationForCategory(locationName, category) {
  const location = LOCATIONS[locationName];
  return Boolean(location && location.category === category);
}

function getSubmissionsSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet tab "' + SHEET_NAME + '" was not found.');
  return sheet;
}

function appendSubmissionRow(values) {
  getSubmissionsSheet().appendRow(values);
}

function assertTrainerImportKey(data) {
  const expected = getTrainerImportKey();
  if (!expected) throw new Error("TRAINER_IMPORT_KEY script property is not configured.");
  const key = String(data.trainer_key || "").trim();
  if (key !== expected) throw new Error("Unauthorized staff import request.");
}

function serializeSheetDate(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return formatLocalIso(value);
  }
  return String(value);
}

function handleListBookings(data) {
  assertTrainerImportKey(data);
  const sheet = getSubmissionsSheet();
  const rows = sheet.getDataRange().getValues();
  const bookings = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (String(row[1]) !== "Booking") continue;
    if (String(row[12]) !== "Confirmed") continue;
    if (row[STAFF_PROCESSED_COL - 1]) continue;

    bookings.push({
      rowIndex: i + 1,
      timestamp: serializeSheetDate(row[0]),
      name: String(row[2] || ""),
      phone: String(row[3] || ""),
      email: String(row[4] || ""),
      organisation: String(row[5] || ""),
      facilityType: String(row[6] || ""),
      addons: String(row[7] || ""),
      message: String(row[8] || ""),
      appointmentStart: serializeSheetDate(row[9]),
      appointmentEnd: serializeSheetDate(row[10]),
      calendarEventId: String(row[11] || ""),
      location: String(row[13] || ""),
      category: String(row[CATEGORY_COL - 1] || ""),
      extendedJson: String(row[EXTENDED_DATA_COL - 1] || "")
    });
  }

  bookings.reverse();
  return jsonResponse({ success: true, bookings: bookings.slice(0, 50) });
}

function handleMarkImported(data) {
  assertTrainerImportKey(data);
  var rowIndex = Number(data.row_index);
  if (!rowIndex || rowIndex < 2) throw new Error("Invalid row index.");
  getSubmissionsSheet().getRange(rowIndex, STAFF_PROCESSED_COL).setValue(new Date().toISOString());
  return jsonResponse({ success: true });
}

function handleMarkDismissed(data) {
  assertTrainerImportKey(data);
  var rowIndex = Number(data.row_index);
  if (!rowIndex || rowIndex < 2) throw new Error("Invalid row index.");
  getSubmissionsSheet().getRange(rowIndex, STAFF_PROCESSED_COL).setValue("dismissed:" + new Date().toISOString());
  return jsonResponse({ success: true });
}

function getBookingCalendar() {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) throw new Error('Calendar "' + CALENDAR_ID + '" was not found.');
  return calendar;
}

function getAvailableSlots(date, locationName, bookingType) {
  const durations = getBookingDurations(bookingType);
  const window = getBookingWindowForDate(date);
  const events = getBusyEventsForDate(date);
  const bufferMs = BUFFER_MINUTES * 60 * 1000;
  const calendarMs = durations.calendarBlockMinutes * 60 * 1000;
  const intervalMs = SLOT_INTERVAL_MINUTES * 60 * 1000;
  const earliest = getEarliestBookableTime();
  const slots = [];
  const lastStartHour = getLastStartHourForBookingType(window, bookingType);

  const windowStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), window.startHour, 0, 0);
  const lastStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), lastStartHour, 0, 0);
  let cursor = new Date(windowStart.getTime());

  while (cursor.getTime() <= lastStart.getTime()) {
    const slotStart = new Date(cursor.getTime());
    const calendarEnd = new Date(slotStart.getTime() + calendarMs);

    if (
      slotStart.getTime() >= earliest.getTime() &&
      slotFitsCalendarBlockEnd(slotStart, calendarEnd, window) &&
      !overlapsBusy(slotStart, calendarEnd, events, bufferMs) &&
      !slotOverlapsConfirmedBooking(slotStart, calendarEnd)
    ) {
      slots.push({ start: slotStart, end: calendarEnd });
    }
    cursor = new Date(cursor.getTime() + intervalMs);
  }

  return slots;
}

function isSlotBookable(slotStart, calendarEnd, locationName, bookingType) {
  if (!isDateBookable(slotStart)) return false;
  if (slotStart.getTime() < getEarliestBookableTime().getTime()) return false;

  const window = getBookingWindowForDate(slotStart);
  if (!slotFitsBookingWindow(slotStart, bookingType, window)) return false;
  if (!slotFitsCalendarBlockEnd(slotStart, calendarEnd, window)) return false;

  const events = getBusyEventsForDate(slotStart);
  const bufferMs = BUFFER_MINUTES * 60 * 1000;
  if (overlapsBusy(slotStart, calendarEnd, events, bufferMs)) return false;
  if (slotOverlapsConfirmedBooking(slotStart, calendarEnd)) return false;
  return true;
}

function getLastStartHourForBookingType(window, bookingType) {
  const durations = getBookingDurations(bookingType);
  if (durations.calendarBlockMinutes >= 480) return window.startHour;
  if (durations.calendarBlockMinutes >= 240) return Math.max(window.startHour, window.lastStartHour - 4);
  return Math.max(window.startHour, window.lastStartHour - 1);
}

function slotFitsCalendarBlockEnd(slotStart, calendarEnd, window) {
  const dayEnd = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate(), window.lastStartHour + 1, 0, 0);
  return calendarEnd.getTime() <= dayEnd.getTime();
}

function slotFitsBookingWindow(slotStart, bookingType, window) {
  const lastStartHour = getLastStartHourForBookingType(window, bookingType);
  const windowStart = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate(), window.startHour, 0, 0);
  const lastStart = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate(), lastStartHour, 0, 0);
  return slotStart.getTime() >= windowStart.getTime() && slotStart.getTime() <= lastStart.getTime();
}

function slotOverlapsConfirmedBooking(slotStart, slotEnd) {
  const rows = getSubmissionsSheet().getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] !== "Booking" || rows[i][12] !== "Confirmed") continue;
    const bookedStart = rows[i][9];
    const bookedEnd = rows[i][10];
    if (!(bookedStart instanceof Date) || !(bookedEnd instanceof Date)) continue;
    if (slotStart.getTime() < bookedEnd.getTime() && slotEnd.getTime() > bookedStart.getTime()) return true;
  }
  return false;
}

function getBusyEventsForDate(date) {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
  const calendar = getBookingCalendar();
  return calendar.getEvents(dayStart, dayEnd);
}

function overlapsBusy(slotStart, slotEnd, events, bufferMs) {
  for (var i = 0; i < events.length; i++) {
    const busyStart = new Date(events[i].getStartTime().getTime() - bufferMs);
    const busyEnd = new Date(events[i].getEndTime().getTime() + bufferMs);
    if (slotStart.getTime() < busyEnd.getTime() && slotEnd.getTime() > busyStart.getTime()) return true;
  }
  return false;
}

function isDateBookable(date) {
  if (BOOKING_DAYS.indexOf(date.getDay()) === -1) return false;
  const today = stripToDate(new Date());
  const target = stripToDate(date);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MAX_DAYS_AHEAD);
  return target.getTime() >= today.getTime() && target.getTime() <= maxDate.getTime();
}

function getEarliestBookableTime() {
  return new Date(Date.now() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
}

function stripToDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeExtendedJson(raw) {
  var str = String(raw || "").trim();
  if (!str || str.length > EXTENDED_JSON_MAX) return "";
  try {
    var obj = JSON.parse(str);
    if (!obj || Number(obj.v) !== 1) return "";
    return JSON.stringify(obj);
  } catch (e) {
    return "";
  }
}

function buildAddonsSummary(extendedJsonRaw) {
  if (!extendedJsonRaw) return "";
  try {
    var obj = JSON.parse(extendedJsonRaw);
    var parts = [];
    if (obj.firewood) parts.push("Firewood");
    if (obj.cleaningFeeAck) parts.push("Cleaning fee ack");
    if (obj.depositAck) parts.push("Deposit ack");
    return parts.join(", ");
  } catch (e) {
    return "";
  }
}

function buildEventTitle(name, organisation, location, facilityPrefix) {
  const prefix = facilityPrefix || (LOCATIONS[location] && LOCATIONS[location].facilityPrefix) || "Hub";
  const contact = name && organisation ? name + " (" + organisation + ")" : (name || organisation || "Booking");
  return prefix + " — " + contact;
}

function buildEventDescription(opts) {
  return (
    "Booking via Hub rentals site\n\n" +
    buildBookingSubmissionSummary(opts) +
    "\n\nAddress: " + SITE_ADDRESS +
    "\n\n" + BOOKING_POLICY_NOTE
  );
}

function buildBookingSubmissionSummary(opts) {
  const durations = getBookingDurations(opts.bookingType);
  const categoryLabel = CATEGORIES[opts.category] ? CATEGORIES[opts.category].label : opts.category;
  const when = formatSlotLabel(opts.slotStart) + " – " + formatSlotLabel(opts.sessionEnd) + " (NZ time)";

  var lines = [
    "Facility: " + opts.location,
    "Package: " + durations.label + (durations.priceLabel ? " (" + durations.priceLabel + ")" : ""),
    "Category: " + categoryLabel,
    "When: " + when,
    "Address: " + SITE_ADDRESS
  ];
  if (opts.name) lines.push("Name: " + opts.name);
  if (opts.phone) lines.push("Phone: " + opts.phone);
  if (opts.email) lines.push("Email: " + opts.email);
  if (opts.organisation) lines.push("Organisation: " + opts.organisation);

  if (opts.extendedJson) {
    try {
      var ext = JSON.parse(opts.extendedJson);
      if (ext.firewood) lines.push("Firewood requested: yes");
      if (ext.cleaningFeeAck) lines.push("Cleaning fee acknowledged: yes");
      if (ext.equipmentDeposit || ext.depositAck) lines.push("Equipment deposit acknowledged: yes");
      if (ext.addonNotes) lines.push("Add-on notes: " + ext.addonNotes);
    } catch (e) {}
  }
  if (opts.message) lines.push("Notes: " + opts.message);
  return lines.join("\n");
}

function buildClientConfirmationEmailBody(name, submissionSummary) {
  return (
    "Hi " + name + ",\n\n" +
    "Your Hub facility hire is confirmed.\n\n" +
    "WHAT YOU SUBMITTED\n" + submissionSummary + "\n\n" +
    "If you provided an email, a calendar invite has been attached — please add it to your calendar.\n\n" +
    BOOKING_POLICY_NOTE + "\n\n" +
    "Questions? " + NOTIFY_EMAIL + "\n\n" +
    "Ngā mihi,\nMohua Facility Hub"
  );
}

function sendClientConfirmationEmail(options) {
  MailApp.sendEmail({
    to: options.to,
    subject: "Booking confirmed — Hub facility hire",
    replyTo: NOTIFY_EMAIL,
    body: buildClientConfirmationEmailBody(options.name, options.submissionSummary)
  });
}

function sendNotificationEmail(options) {
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: options.subject,
    replyTo: options.replyTo || NOTIFY_EMAIL,
    body: options.body
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseLocalDate(dateStr) {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

function parseLocalDateTime(dateTimeStr) {
  const match = dateTimeStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const date = new Date(year, month, day, hour, minute, Number(match[6] || 0));
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day ||
      date.getHours() !== hour || date.getMinutes() !== minute) return null;
  return date;
}

function formatLocalIso(date) {
  const pad = function (v) { return String(v).padStart(2, "0"); };
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" +
    pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
}

function formatSlotLabel(date) {
  return Utilities.formatDate(date, TIMEZONE, "EEE d MMM yyyy, h:mm a");
}

function formatHourLabel(hour) {
  return Utilities.formatDate(new Date(2000, 0, 1, hour, 0, 0), TIMEZONE, "h:mm a");
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
