# Hub Apps Script backend setup

1. Create Google Sheet **Hub Bookings** with tab `Submissions` and headers A–Q (see `booking-platform-replication-guide.md` §15).
2. Create calendar **Hub Facility Hire** and copy the Calendar ID.
3. Open the sheet → Extensions → Apps Script → paste `Code.gs`.
4. Set `CALENDAR_ID` in `Code.gs` (line ~16).
5. Project Settings → Script properties → add `TRAINER_IMPORT_KEY` (32+ char secret).
6. Deploy → New deployment → Web app:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the `/exec` URL into:
   - Public site: `.env.local` → `VITE_FORM_ENDPOINT`
   - Staff app: `VITE_BOOKING_API_URL`

**Important:** After every `Code.gs` change, use Deploy → **New deployment** (Save alone does not update the live URL).

## Smoke test

```bash
curl "https://script.google.com/macros/s/YOUR_ID/exec"
```

Expected: `{"success":true,"message":"Hub facility hire form endpoint. Use POST."}`
