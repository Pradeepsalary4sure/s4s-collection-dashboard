const dashboardService = require("../services/dashboardService");

function reportFilters(req) {
  return { date: req.query.date, month: req.query.month };
}

function buildCsv(report) {
  const headers = ["Bank Name", "S4S", "S4S Aman", "Rupee 1", "Total", "Total MTD"];
  const rows = report.table.map((row) => [row.bank, row.s4s, row.s4sAman, row.rupeeOne, row.total, row.totalMtd]);
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}

function xmlEscape(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildExcel(report) {
  const cells = (values) => values
    .map((value) => `<Cell><Data ss:Type="${typeof value === "number" ? "Number" : "String"}">${xmlEscape(value)}</Data></Cell>`)
    .join("");
  const rows = report.table
    .map((row) => `<Row>${cells([row.bank, row.s4s, row.s4sAman, row.rupeeOne, row.total, row.totalMtd])}</Row>`)
    .join("");
  return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Collection Report"><Table><Row>${cells(["Bank Name", "S4S", "S4S Aman", "Rupee 1", "Total", "Total MTD"])}</Row>${rows}</Table></Worksheet></Workbook>`;
}

function pdfText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/[()]/g, "\\$&");
}

function buildPdf(report) {
  const rows = report.table.map((row) => {
    const fixed = (value, length) => String(value).slice(0, length).padEnd(length, " ");
    return `${fixed(row.bank, 20)} ${fixed(row.s4s.toFixed(2), 12)} ${fixed(row.s4sAman.toFixed(2), 12)} ${fixed(row.rupeeOne.toFixed(2), 12)} ${fixed(row.total.toFixed(2), 12)} ${row.totalMtd.toFixed(2)}`;
  });
  const lines = [
    "S4S COLLECTION REPORT",
    `Report date: ${report.filters.date} | Month: ${report.filters.month}`,
    "",
    "Bank                 S4S          S4S Aman      Rupee 1       Total         Total MTD",
    ...rows,
  ];
  const content = lines
    .map((line, index) => `BT /F1 ${index === 0 ? 16 : 9} Tf 42 ${760 - index * 22} Td (${pdfText(line)}) Tj ET`)
    .join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

async function getReport(req) {
  return dashboardService.getDashboardData(reportFilters(req));
}

async function sendDashboard(req, res, next, selector) {
  try {
    const report = await getReport(req);
    res.json({ success: true, data: selector(report) });
  } catch (error) {
    next(error);
  }
}

exports.dashboard = (req, res, next) => sendDashboard(req, res, next, (report) => report);
exports.summary = (req, res, next) => sendDashboard(req, res, next, (report) => report.summary);
exports.banks = (req, res, next) => sendDashboard(req, res, next, (report) => report.table);
exports.chart = (req, res, next) => sendDashboard(req, res, next, (report) => report.charts);
exports.report = (req, res, next) => sendDashboard(req, res, next, (report) => report);

exports.exportReport = async (req, res, next) => {
  try {
    const format = String(req.query.format || "csv").toLowerCase();
    const report = await getReport(req);
    const baseName = `s4s-collection-${report.filters.date}`;

    if (format === "csv") {
      res.type("text/csv").attachment(`${baseName}.csv`).send(buildCsv(report));
      return;
    }
    if (format === "excel" || format === "xls") {
      res.type("application/vnd.ms-excel").attachment(`${baseName}.xls`).send(buildExcel(report));
      return;
    }
    if (format === "pdf") {
      res.type("application/pdf").attachment(`${baseName}.pdf`).send(buildPdf(report));
      return;
    }

    const error = new Error("format must be csv, excel, or pdf.");
    error.statusCode = 400;
    throw error;
  } catch (error) {
    next(error);
  }
};
