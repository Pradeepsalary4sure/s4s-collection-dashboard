# S4S Collection API

The Express API reads a Google Sheet published as CSV, normalises bank collection rows, and returns server-calculated reporting data. If `CSV_URL` is not configured, it returns a realistic local dataset so the dashboard remains immediately usable in development.

## Run locally

1. Copy the environment values into `.env`.
2. Run `npm install` in this directory.
3. Run `npm start`.

```env
PORT=5000
CSV_URL=https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=0
CLIENT_ORIGIN=http://localhost:5173
REQUIRE_GOOGLE_SHEET=false
```

The sheet needs columns equivalent to `Date`, `Bank Name`, `S4S`, `S4S Aman`, and `Rupee 1`. Common date, bank, and total aliases are also supported.

When `REQUIRE_GOOGLE_SHEET` is `false` (the default), a temporary Sheet access or schema issue displays preview data rather than failing the dashboard. Set it to `true` in production when live Sheet data must be mandatory.

## API

- `GET /health`
- `GET /api/dashboard?date=YYYY-MM-DD&month=YYYY-MM`
- `GET /api/summary?date=YYYY-MM-DD&month=YYYY-MM`
- `GET /api/banks?date=YYYY-MM-DD&month=YYYY-MM`
- `GET /api/chart?date=YYYY-MM-DD&month=YYYY-MM`
- `GET /api/report?date=YYYY-MM-DD&month=YYYY-MM`
- `GET /api/export?format=csv|excel|pdf&date=YYYY-MM-DD&month=YYYY-MM`
