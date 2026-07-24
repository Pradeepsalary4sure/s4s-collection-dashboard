const fetchGoogleSheet = require("../config/googleSheet");
const {
  getDashboardModel,
  getSampleRows,
  isUsableCollectionSheet,
} = require("../utils/calculations");

function sampleReport(filters, notice) {
  return {
    ...getDashboardModel(getSampleRows(), filters),
    source: "sample",
    notice,
  };
}

async function getDashboardData(filters) {
  try {
    console.log("===== DASHBOARD SERVICE =====");

    const sheetRows = await fetchGoogleSheet();

    console.log("Rows:", Array.isArray(sheetRows) ? sheetRows.length : "Not Array");

    if (!sheetRows || sheetRows.length === 0) {
      console.log("Using sample data");
      return sampleReport(filters, "No Google Sheet data found.");
    }

    if (!isUsableCollectionSheet(sheetRows)) {
      console.log("Invalid headers:", Object.keys(sheetRows[0] || {}));

      return sampleReport(
        filters,
        "Google Sheet headers are invalid."
      );
    }

    console.log("Google Sheet Loaded Successfully");

    return {
      ...getDashboardModel(sheetRows, filters),
      source: "google-sheet",
      notice: "",
    };
  } catch (error) {
    console.error("===== DASHBOARD ERROR =====");
    console.error(error);

    return sampleReport(
      filters,
      "Google Sheet Error. Showing sample data."
    );
  }
}

module.exports = { getDashboardData };