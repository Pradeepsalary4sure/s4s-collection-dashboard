import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 20000,
});

function queryParams(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => Boolean(value)));
}

export async function getDashboard(filters, signal) {
  const response = await api.get("/dashboard", { params: queryParams(filters), signal });
  return response.data.data;
}

export async function downloadReport(format, filters) {
  const response = await api.get("/export", {
    params: { ...queryParams(filters), format },
    responseType: "blob",
  });
  const header = response.headers["content-disposition"] || "";
  const match = header.match(/filename="?([^";]+)"?/i);
  const filename = match ? match[1] : `s4s-collection-report.${format === "excel" ? "xls" : format}`;
  const link = document.createElement("a");
  const url = URL.createObjectURL(response.data);

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
