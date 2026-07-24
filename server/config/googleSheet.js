const axios = require("axios");
const Papa = require("papaparse");

async function fetchGoogleSheet() {
  const csvUrl = process.env.CSV_URL;

  if (!csvUrl) {
    console.error("❌ CSV_URL is not defined in .env");
    return null;
  }

  console.log("📄 Fetching CSV from:", csvUrl);

  let response;

  try {
    response = await axios.get(csvUrl, {
      responseType: "text",
      timeout: 15000,
      headers: {
        Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
      },
    });

    console.log("✅ Google Sheet fetched successfully.");
  } catch (error) {
    console.error("========== GOOGLE SHEET ERROR ==========");
    console.error("Message:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }

    console.error(error);
    throw error;
  }

  // First pass: parse without headers so we can locate the real header row.
  // The Google Sheet often has summary / blank rows before the actual columns.
  const raw = Papa.parse(String(response.data), {
    header: false,
    skipEmptyLines: true,
  });

  if (raw.errors.length > 0) {
    console.error("CSV Parse Errors:", raw.errors);

    const parseError = new Error(
      "The configured Google Sheet CSV could not be parsed."
    );
    parseError.statusCode = 422;
    throw parseError;
  }

  // Known column names that identify the real header row (case-insensitive).
  const HEADER_MARKERS = [
    "bank name", "bank", "date", "date of received", "date of update",
    "amt received", "amount", "s4s", "payment reference", "month",
  ];

  const looksLikeHeader = (row) => {
    const cells = row.map((cell) => String(cell || "").trim().toLowerCase());
    // At least 2 known markers must be present to count as the header row.
    return HEADER_MARKERS.filter((marker) => cells.includes(marker)).length >= 2;
  };

  let headerIndex = raw.data.findIndex(looksLikeHeader);
  if (headerIndex === -1) {
    // Fall-back: treat row 0 as headers (original behaviour).
    headerIndex = 0;
  }

  const headers = raw.data[headerIndex].map((h) => String(h || "").trim());
  const dataRows = raw.data.slice(headerIndex + 1);

  console.log("Detected header row at index:", headerIndex, "→", headers.join(", "));

  // Build array-of-objects using the detected headers.
  const rows = dataRows
    .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
    .map((row) => {
      const obj = {};
      headers.forEach((key, i) => {
        if (key) obj[key] = row[i] !== undefined ? row[i] : "";
      });
      return obj;
    });

  return rows;
}

module.exports = fetchGoogleSheet;