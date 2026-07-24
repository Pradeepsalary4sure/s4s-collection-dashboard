# S4S Collection Dashboard

React and Vite frontend for the Salary 4 Sure collection report. It displays server-calculated data from the Express API, supports date/month filtering, and downloads Excel, CSV, or PDF reports.

## Run locally

1. Start the API from `../server` on port 5000.
2. Run `npm install` in this directory.
3. Run `npm run dev`.

The Vite development server proxies `/api` to `http://localhost:5000`. For a deployed API, set `VITE_API_BASE_URL` to its API base path or URL. Set `VITE_API_PROXY_TARGET` only when the local API uses a different port.

## Quality checks

- `npm run build`
- `npm run lint`
