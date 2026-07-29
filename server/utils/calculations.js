// const PREFERRED_BANKS = [
//   "HDFC",
//   "ICICI",
//   "BOB",
//   "YES BANK",
//   "IDFC",
//   "IDFC NEW",
//   "Cashfree",
// ];

// const NAMAN_BANKS = new Set(["HDFC", "ICICI", "BOB"]);
// const BANK_ALIASES = {
//   HDFC: "HDFC",
//   "HDFC BANK": "HDFC",
//   ICICI: "ICICI",
//   "ICICI BANK": "ICICI",
//   BOB: "BOB",
//   "BANK OF BARODA": "BOB",
//   "YES BANK": "YES BANK",
//   "IDFC PAWANSUT": "IDFC",
//   "IDFC PAWAN SUT": "IDFC",
//   "IDFC NEW": "IDFC NEW",
//   CASHFREE: "Cashfree",
// };

// function toDateKey(value) {
//   const date = value instanceof Date ? value : new Date(value);
//   if (Number.isNaN(date.getTime())) return null;

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

// function sampleDate(dayOffset) {
//   const date = new Date();
//   date.setHours(12, 0, 0, 0);
//   date.setDate(date.getDate() + dayOffset);
//   return toDateKey(date);
// }

// function getSampleRows() {
//   return [
//     { Date: sampleDate(0), "Bank Name": "Cashfree", S4S: "963190", "S4S Aman": "0", "Rupee 1": "0" },
//     { Date: sampleDate(-8), "Bank Name": "Cashfree", S4S: "5004919.89", "S4S Aman": "0", "Rupee 1": "0" },
//     { Date: sampleDate(-6), "Bank Name": "BOB", S4S: "7000", "S4S Aman": "0", "Rupee 1": "0" },
//     { Date: sampleDate(-4), "Bank Name": "IDFC (Pawansut)", S4S: "393191", "S4S Aman": "0", "Rupee 1": "0" },
//     { Date: sampleDate(-2), "Bank Name": "IDFC NEW", S4S: "7000", "S4S Aman": "0", "Rupee 1": "0" },
//   ];
// }

// function fieldKey(value) {
//   return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
// }

// function getField(row, aliases) {
//   const normalized = Object.entries(row).reduce((result, [key, value]) => {
//     result[fieldKey(key)] = value;
//     return result;
//   }, {});

//   for (const alias of aliases) {
//     const value = normalized[fieldKey(alias)];
//     if (value !== undefined && value !== null && String(value).trim() !== "") return value;
//   }
//   return "";
// }

// function isUsableCollectionSheet(rows) {
//   if (!Array.isArray(rows) || rows.length === 0) return false;

//   const headers = new Set(
//     Object.keys(rows[0]).map((header) => fieldKey(header)),
//   );
//   const hasOneOf = (aliases) => aliases.some((alias) => headers.has(fieldKey(alias)));

//   return hasOneOf(["Date", "Collection Date", "Transaction Date", "Created At", "Date of Received", "Date of Update"])
//     && hasOneOf(["Bank Name", "Bank", "Bankname"])
//     && hasOneOf(["S4S", "S4S Aman", "Rupee 1", "Total", "Amount", "Collection", "Amt Received"]);
// }

// function parseAmount(value) {
//   if (typeof value === "number") return Number.isFinite(value) ? value : 0;
//   const normalized = String(value || "").replace(/,/g, "").replace(/[^0-9.-]/g, "");
//   const amount = Number.parseFloat(normalized);
//   return Number.isFinite(amount) ? amount : 0;
// }

// function parseSheetDate(value) {
//   if (!value) return null;
//   const text = String(value).trim();

//   // DD/MM/YYYY or DD-MM-YYYY (numeric months)
//   const indianDate = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
//   if (indianDate) {
//     const [, day, month, inputYear] = indianDate;
//     const year = inputYear.length === 2 ? `20${inputYear}` : inputYear;
//     return toDateKey(new Date(Number(year), Number(month) - 1, Number(day), 12));
//   }

//   // D-Mon-YYYY or D/Mon/YYYY (e.g. "1-Apr-2026", "22-Jul-2026")
//   const MONTH_NAMES = {
//     jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
//     jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
//   };
//   const namedMonth = text.match(/^(\d{1,2})[/-]([A-Za-z]{3,})[/-](\d{2,4})$/);
//   if (namedMonth) {
//     const [, dayStr, monStr, yearStr] = namedMonth;
//     const monthIndex = MONTH_NAMES[monStr.slice(0, 3).toLowerCase()];
//     if (monthIndex !== undefined) {
//       const year = yearStr.length === 2 ? `20${yearStr}` : yearStr;
//       return toDateKey(new Date(Number(year), monthIndex, Number(dayStr), 12));
//     }
//   }

//   return toDateKey(text);
// }

// function canonicalBankName(value) {
//   const name = String(value || "").trim();
//   if (!name) return "Unassigned";
//   const aliasKey = name
//     .toUpperCase()
//     .replace(/[()]/g, "")
//     .replace(/[^A-Z0-9]+/g, " ")
//     .trim();
//   return BANK_ALIASES[aliasKey] || name;
// }

// function normalizeRows(rows) {
//   return rows.map((row) => {
//     const s4s = parseAmount(getField(row, ["S4S", "S4S Collection"]));
//     const s4sAman = parseAmount(getField(row, ["S4S Aman", "S4S_Aman", "Aman", "S4S Aman Collection"]));
//     const rupeeOne = parseAmount(getField(row, ["Rupee 1", "Rupee1", "Rupee One", "Rupee 1 Collection"]));
//     const statedTotal = parseAmount(getField(row, ["Total", "Amount", "Collection", "Amt Received"]));
//     const calculatedTotal = s4s + s4sAman + rupeeOne;
//     return {
//       date: parseSheetDate(getField(row, ["Date", "Collection Date", "Transaction Date", "Created At", "Date of Received", "Date of Update"])),
//       bank: canonicalBankName(getField(row, ["Bank Name", "Bank", "Bankname"])),
//       s4s: calculatedTotal === 0 && statedTotal !== 0 ? statedTotal : s4s,
//       s4sAman,
//       rupeeOne,
//     };
//   });
// }

// function normalizeDateFilter(value) {
//   if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "") || toDateKey(value) !== value) {
//     const error = new Error("date must use the YYYY-MM-DD format.");
//     error.statusCode = 400;
//     throw error;
//   }
//   return value;
// }

// function normalizeMonthFilter(value, fallbackDate) {
//   if (!value) return fallbackDate.slice(0, 7);
//   if (!/^\d{4}-\d{2}$/.test(value) || Number(value.slice(5)) < 1 || Number(value.slice(5)) > 12) {
//     const error = new Error("month must use the YYYY-MM format.");
//     error.statusCode = 400;
//     throw error;
//   }
//   return value;
// }

// function emptyTotals() {
//   return { s4s: 0, s4sAman: 0, rupeeOne: 0, total: 0, totalMtd: 0 };
// }

// function addTotals(target, source) {
//   target.s4s += source.s4s;
//   target.s4sAman += source.s4sAman;
//   target.rupeeOne += source.rupeeOne;
//   target.total += source.s4s + source.s4sAman + source.rupeeOne;
//   return target;
// }

// function roundCurrency(value) {
//   return Math.round((value + Number.EPSILON) * 100) / 100;
// }

// function serialiseTotals(totals) {
//   return {
//     ...totals,
//     s4s: roundCurrency(totals.s4s),
//     s4sAman: roundCurrency(totals.s4sAman),
//     rupeeOne: roundCurrency(totals.rupeeOne),
//     total: roundCurrency(totals.total),
//     totalMtd: roundCurrency(totals.totalMtd),
//   };
// }

// function sumRows(rows) {
//   return rows.reduce(
//     (totals, row) => ({
//       s4s: totals.s4s + row.s4s,
//       s4sAman: totals.s4sAman + row.s4sAman,
//       rupeeOne: totals.rupeeOne + row.rupeeOne,
//       total: totals.total + row.total,
//       totalMtd: totals.totalMtd + row.totalMtd,
//     }),
//     emptyTotals(),
//   );
// }

// function buildMtdBreakup(bankRows) {
//   const primaryBanks = ["Cashfree", "IDFC", "BOB", "IDFC NEW"];
//   const selected = primaryBanks.map((bank) => {
//     const row = bankRows.find((item) => item.bank === bank);
//     return { name: bank, value: row ? row.totalMtd : 0 };
//   });
//   const selectedTotal = selected.reduce((total, item) => total + item.value, 0);
//   const allTotal = bankRows.reduce((total, item) => total + item.totalMtd, 0);
//   return [...selected, { name: "Others", value: roundCurrency(allTotal - selectedTotal) }];
// }

// function getDashboardModel(sourceRows, filters = {}) {
//   const selectedDate = normalizeDateFilter(filters.date || toDateKey(new Date()));
//   const selectedMonth = normalizeMonthFilter(filters.month, selectedDate);
//   const normalizedRows = normalizeRows(sourceRows);
//   const sourceBankNames = normalizedRows.map((row) => row.bank).filter((bank) => bank !== "Unassigned");
//   const bankNames = [...PREFERRED_BANKS, ...sourceBankNames.filter((bank) => !PREFERRED_BANKS.includes(bank))]
//     .filter((bank, index, all) => all.indexOf(bank) === index);

//   const tableRows = bankNames.map((bank) => {
//     const row = { bank, kind: "bank", ...emptyTotals() };
//     normalizedRows.forEach((record) => {
//       if (record.bank !== bank) return;
//       if (record.date === selectedDate) addTotals(row, record);
//       if (record.date && record.date.startsWith(selectedMonth)) {
//         row.totalMtd += record.s4s + record.s4sAman + record.rupeeOne;
//       }
//     });
//     return serialiseTotals(row);
//   });

//   const namedSubtotal = { bank: "Total (Naman)", kind: "subtotal", ...serialiseTotals(sumRows(tableRows.filter((row) => NAMAN_BANKS.has(row.bank)))) };
//   const grandTotalRow = { bank: "Grand Total", kind: "grand-total", ...serialiseTotals(sumRows(tableRows)) };
//   const displayRows = [...tableRows];
//   const lastNamanIndex = tableRows.findLastIndex((row) => NAMAN_BANKS.has(row.bank));
//   if (lastNamanIndex >= 0) displayRows.splice(lastNamanIndex + 1, 0, namedSubtotal);
//   displayRows.push(grandTotalRow);

//   const cashfree = tableRows.find((row) => row.bank === "Cashfree");
//   return {
//     filters: { date: selectedDate, month: selectedMonth },
//     summary: {
//       todayCollection: grandTotalRow.total,
//       mtdCollection: grandTotalRow.totalMtd,
//       cashfreeCollection: cashfree ? cashfree.total : 0,
//       totalBanks: bankNames.length,
//       namanCollection: namedSubtotal.total,
//     },
//     table: displayRows,
//     charts: {
//       bankWiseToday: tableRows.map((row) => ({ name: row.bank, value: row.total })),
//       mtdBreakup: buildMtdBreakup(tableRows),
//     },
//     updatedAt: new Date().toISOString(),
//   };
// }

// module.exports = { getDashboardModel, getSampleRows, isUsableCollectionSheet };







const PREFERRED_BANKS = [
  "HDFC",
  "ICICI",
  "BOB",
  "YES BANK",
  "IDFC",
  "IDFC NEW",
  "Cashfree",
];

const NAMAN_BANKS = new Set(["HDFC", "ICICI", "BOB"]);
const BANK_ALIASES = {
  HDFC: "HDFC",
  "HDFC BANK": "HDFC",
  ICICI: "ICICI",
  "ICICI BANK": "ICICI",
  BOB: "BOB",
  "BANK OF BARODA": "BOB",
  "YES BANK": "YES BANK",
  "IDFC PAWANSUT": "IDFC",
  // "IDFC PAWAN SUT": "IDFC",
  "IDFC NEW": "IDFC NEW",
  CASHFREE: "Cashfree",
};

function toDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sampleDate(dayOffset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  return toDateKey(date);
}

function getSampleRows() {
  return [
    { Date: sampleDate(0), "Bank Name": "Cashfree", S4S: "963190", "S4S Aman": "0", "Rupee 1": "0" },
    { Date: sampleDate(-8), "Bank Name": "Cashfree", S4S: "5004919.89", "S4S Aman": "0", "Rupee 1": "0" },
    { Date: sampleDate(-6), "Bank Name": "BOB", S4S: "7000", "S4S Aman": "0", "Rupee 1": "0" },
    { Date: sampleDate(-4), "Bank Name": "IDFC (Pawansut)", S4S: "393191", "S4S Aman": "0", "Rupee 1": "0" },
    { Date: sampleDate(-2), "Bank Name": "IDFC NEW", S4S: "7000", "S4S Aman": "0", "Rupee 1": "0" },
  ];
}

function fieldKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getField(row, aliases) {
  const normalized = Object.entries(row).reduce((result, [key, value]) => {
    result[fieldKey(key)] = value;
    return result;
  }, {});

  for (const alias of aliases) {
    const value = normalized[fieldKey(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}

function isUsableCollectionSheet(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return false;

  const headers = new Set(
    Object.keys(rows[0]).map((header) => fieldKey(header)),
  );
  const hasOneOf = (aliases) => aliases.some((alias) => headers.has(fieldKey(alias)));

  return hasOneOf(["Date", "Collection Date", "Transaction Date", "Created At", "Date of Received", "Date of Update"])
    && hasOneOf(["Bank Name", "Bank", "Bankname"])
    && hasOneOf(["S4S", "S4S Aman", "Rupee 1", "Total", "Amount", "Collection", "Amt Received"]);
}

function parseAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value || "").replace(/,/g, "").replace(/[^0-9.-]/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function parseSheetDate(value) {
  if (!value) return null;
  const text = String(value).trim();

  // DD/MM/YYYY or DD-MM-YYYY (numeric months)
  const indianDate = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (indianDate) {
    const [, day, month, inputYear] = indianDate;
    const year = inputYear.length === 2 ? `20${inputYear}` : inputYear;
    return toDateKey(new Date(Number(year), Number(month) - 1, Number(day), 12));
  }

  // D-Mon-YYYY or D/Mon/YYYY (e.g. "1-Apr-2026", "22-Jul-2026")
  const MONTH_NAMES = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const namedMonth = text.match(/^(\d{1,2})[/-]([A-Za-z]{3,})[/-](\d{2,4})$/);
  if (namedMonth) {
    const [, dayStr, monStr, yearStr] = namedMonth;
    const monthIndex = MONTH_NAMES[monStr.slice(0, 3).toLowerCase()];
    if (monthIndex !== undefined) {
      const year = yearStr.length === 2 ? `20${yearStr}` : yearStr;
      return toDateKey(new Date(Number(year), monthIndex, Number(dayStr), 12));
    }
  }

  return toDateKey(text);
}

function canonicalBankName(value) {
  const name = String(value || "").trim();
  if (!name) return "Unassigned";
  const aliasKey = name
    .toUpperCase()
    .replace(/[()]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
  return BANK_ALIASES[aliasKey] || name;
}

function normalizeRows(rows) {
  return rows.map((row) => {
    const s4s = parseAmount(getField(row, ["S4S", "S4S Collection"]));
    const s4sAman = parseAmount(getField(row, ["S4S Aman", "S4S_Aman", "Aman", "S4S Aman Collection"]));
    const rupeeOne = parseAmount(getField(row, ["Rupee 1", "Rupee1", "Rupee One", "Rupee 1 Collection"]));
    const statedTotal = parseAmount(getField(row, ["Total", "Amount", "Collection", "Amt Received"]));
    const calculatedTotal = s4s + s4sAman + rupeeOne;
    return {
      date: parseSheetDate(getField(row, ["Date", "Collection Date", "Transaction Date", "Created At", "Date of Received", "Date of Update"])),
      bank: canonicalBankName(getField(row, ["Bank Name", "Bank", "Bankname"])),
      s4s: calculatedTotal === 0 && statedTotal !== 0 ? statedTotal : s4s,
      s4sAman,
      rupeeOne,
    };
  });
}

function normalizeDateFilter(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "") || toDateKey(value) !== value) {
    const error = new Error("date must use the YYYY-MM-DD format.");
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeMonthFilter(value, fallbackDate) {
  if (!value) return fallbackDate.slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(value) || Number(value.slice(5)) < 1 || Number(value.slice(5)) > 12) {
    const error = new Error("month must use the YYYY-MM format.");
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function emptyTotals() {
  return { s4s: 0, s4sAman: 0, rupeeOne: 0, total: 0, totalMtd: 0 };
}

function addTotals(target, source) {
  target.s4s += source.s4s;
  target.s4sAman += source.s4sAman;
  target.rupeeOne += source.rupeeOne;
  target.total += source.s4s + source.s4sAman + source.rupeeOne;
  return target;
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function serialiseTotals(totals) {
  return {
    ...totals,
    s4s: roundCurrency(totals.s4s),
    s4sAman: roundCurrency(totals.s4sAman),
    rupeeOne: roundCurrency(totals.rupeeOne),
    total: roundCurrency(totals.total),
    totalMtd: roundCurrency(totals.totalMtd),
  };
}

function sumRows(rows) {
  return rows.reduce(
    (totals, row) => ({
      s4s: totals.s4s + row.s4s,
      s4sAman: totals.s4sAman + row.s4sAman,
      rupeeOne: totals.rupeeOne + row.rupeeOne,
      total: totals.total + row.total,
      totalMtd: totals.totalMtd + row.totalMtd,
    }),
    emptyTotals(),
  );
}

function buildMtdBreakup(bankRows) {
  const primaryBanks = ["Cashfree", "IDFC", "BOB", "IDFC NEW"];
  const selected = primaryBanks.map((bank) => {
    const row = bankRows.find((item) => item.bank === bank);
    return { name: bank, value: row ? row.totalMtd : 0 };
  });
  const selectedTotal = selected.reduce((total, item) => total + item.value, 0);
  const allTotal = bankRows.reduce((total, item) => total + item.totalMtd, 0);
  return [...selected, { name: "Others", value: roundCurrency(allTotal - selectedTotal) }];
}

function getDashboardModel(sourceRows, filters = {}) {
  const selectedDate = normalizeDateFilter(filters.date || toDateKey(new Date()));
  const selectedMonth = normalizeMonthFilter(filters.month, selectedDate);
  const normalizedRows = normalizeRows(sourceRows);
  const sourceBankNames = normalizedRows.map((row) => row.bank).filter((bank) => bank !== "Unassigned");
  const bankNames = [...PREFERRED_BANKS, ...sourceBankNames.filter((bank) => !PREFERRED_BANKS.includes(bank))]
    .filter((bank, index, all) => all.indexOf(bank) === index);

  const tableRows = bankNames.map((bank) => {
    const row = { bank, kind: "bank", ...emptyTotals() };
    normalizedRows.forEach((record) => {
      if (record.bank !== bank) return;
      if (record.date === selectedDate) addTotals(row, record);
      // MTD: count only records up to and including the selected date
      if (record.date && record.date.startsWith(selectedMonth) && record.date <= selectedDate) {
        row.totalMtd += record.s4s + record.s4sAman + record.rupeeOne;
      }
    });
    return serialiseTotals(row);
  });

  const namedSubtotal = { bank: "Total (Naman)", kind: "subtotal", ...serialiseTotals(sumRows(tableRows.filter((row) => NAMAN_BANKS.has(row.bank)))) };
  const grandTotalRow = { bank: "Grand Total", kind: "grand-total", ...serialiseTotals(sumRows(tableRows)) };
  const displayRows = [...tableRows];
  const lastNamanIndex = tableRows.findLastIndex((row) => NAMAN_BANKS.has(row.bank));
  if (lastNamanIndex >= 0) displayRows.splice(lastNamanIndex + 1, 0, namedSubtotal);
  displayRows.push(grandTotalRow);

  const cashfree = tableRows.find((row) => row.bank === "Cashfree");
  return {
    filters: { date: selectedDate, month: selectedMonth },
    summary: {
      todayCollection: grandTotalRow.total,
      mtdCollection: grandTotalRow.totalMtd,
      cashfreeCollection: cashfree ? cashfree.total : 0,
      totalBanks: bankNames.length,
      namanCollection: namedSubtotal.total,
    },
    table: displayRows,
    charts: {
      bankWiseToday: tableRows.map((row) => ({ name: row.bank, value: row.total })),
      mtdBreakup: buildMtdBreakup(tableRows),
    },
    updatedAt: new Date().toISOString(),
  };
}

module.exports = { getDashboardModel, getSampleRows, isUsableCollectionSheet };
