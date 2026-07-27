import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";
     

console.log("API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

function queryParams(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export async function getDashboard(filters, signal) {
  const response = await api.get("/dashboard", {
    params: queryParams(filters),
    signal,
  });

  return response.data.data;
}

export async function downloadReport(format, filters) {
  const response = await api.get("/export", {
    params: {
      ...queryParams(filters),
      format,
    },
    responseType: "blob",
  });

  const header = response.headers["content-disposition"] || "";
  const match = header.match(/filename="?([^"]+)"?/);

  const filename =
    match?.[1] ||
    `s4s-collection-report.${format === "excel" ? "xlsx" : format}`;

  const url = window.URL.createObjectURL(response.data);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
} 