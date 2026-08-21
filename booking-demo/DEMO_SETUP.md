# GBTech — Advanced Stack Demo

This folder is the **public booking site** deployed to `https://gbtech.co.nz/demo/`.
The staff CRM source lives in [`../staff-demo-app/`](../staff-demo-app/) and deploys to `/staff-demo/`.

Full technical reference: [`../demoplan/booking-platform-replication-guide.md`](../demoplan/booking-platform-replication-guide.md).

## Showcase framing

Public pages use fictional **Harbour Hall Demo** branding (sample rooms and address) so the demo is clearly not a live client venue.
The book page includes a walkthrough, a working sample availability calendar, and a booking wizard that stores pending bookings in browser `localStorage` for the staff demo.

## 0. Showcase mode (default public deploy)

GitHub Pages builds both apps with `VITE_SHOWCASE_MODE=true`. No Google or Firebase secrets are required.

**Visitor flow:**

1. Open [`/demo/rentals/book`](https://gbtech.co.nz/demo/rentals/book) and complete a simulated booking.
2. Open [`/staff-demo/`](https://gbtech.co.nz/staff-demo/) and click **Enter staff demo**.
3. Go to **Import Bookings** — your booking appears in the queue (via shared browser `localStorage`).

Local development:

```bash
cd booking-demo
cp .env.example .env.local   # VITE_SHOWCASE_MODE=true
npm install && npm run dev

cd ../staff-demo-app
cp .env.example .env.local   # VITE_SHOWCASE_MODE=true
npm install && npm run dev
```

## 1. Live backend (Phase A) — optional for client replication

1. Create a Google Sheet (Bookings log) with columns A–Q per the replication guide.
2. Create a Google Calendar for facility hire; set **See all event details** for embed.
3. Copy [`google-apps-script/Code.gs`](google-apps-script/Code.gs) into Apps Script bound to the sheet.
4. Set script property `TRAINER_IMPORT_KEY` (`openssl rand -hex 32`).
5. Deploy → Web app → Execute as **Me** → Anyone → copy the `/exec` URL.
6. **Redeploy** after every `Code.gs` change.

Set `VITE_SHOWCASE_MODE=false` and configure `.env.local` with live endpoints.

## 2. Demo Firebase project (Phase E) — live mode only

1. Create a Firebase project (e.g. `marshall-demo-staff`).
2. Enable Email/Password auth and Realtime Database.
3. Update [`../staff-demo-app/.firebaserc`](../staff-demo-app/.firebaserc) with the project id.
4. Deploy rules: `cd staff-demo-app && npx firebase deploy --only database`.
5. Create a demo staff user; add tenant bootstrap per `staff-demo-app/scripts/tenant-bootstrap.example.json`.

## 3. GitHub Actions secrets (live mode only)

| Secret | Used by | Maps to |
|--------|---------|---------|
| `DEMO_VITE_FORM_ENDPOINT` | booking-demo | Apps Script `/exec` URL |
| `DEMO_VITE_CALENDAR_ID` | booking-demo | Calendar ID |
| `DEMO_VITE_SITE_URL` | booking-demo | `https://gbtech.co.nz/demo` |
| `DEMO_VITE_BOOKING_API_URL` | staff-demo-app | Same `/exec` URL |
| `DEMO_VITE_BOOKING_IMPORT_KEY` | staff-demo-app | `TRAINER_IMPORT_KEY` |
| `DEMO_VITE_FIREBASE_*` | staff-demo-app | Firebase web config |

Showcase CI builds do **not** require these secrets.

## 4. Smoke test

```bash
cd booking-demo && npm run test:booking && VITE_SHOWCASE_MODE=true npm run build:static
cd ../staff-demo-app && npm run test:booking && VITE_SHOWCASE_MODE=true npm run build
```

Then open `/demo/rentals/book`, complete a test booking, and import it in the staff demo.
