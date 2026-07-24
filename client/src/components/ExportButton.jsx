import { useState } from "react";
import { FiChevronDown, FiDownload, FiFileText, FiGrid } from "react-icons/fi";
import { downloadReport } from "../services/api";

const exportOptions = [
  { format: "excel", label: "Excel", icon: FiGrid },
  { format: "csv", label: "CSV", icon: FiFileText },
  { format: "pdf", label: "PDF", icon: FiFileText },
];

export default function ExportButton({ filters }) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  async function exportFile(format, event) {
    setIsExporting(true);
    setError("");
    try {
      await downloadReport(format, filters);
      event.currentTarget.closest("details")?.removeAttribute("open");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Export could not be created.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <details className="export-menu">
      <summary className="export-trigger"><FiDownload />{isExporting ? "Preparing..." : "Export report"}<FiChevronDown /></summary>
      <div className="export-options">
        <p>Download as</p>
        {exportOptions.map(({ format, label, icon: Icon }) => (
          <button key={format} type="button" onClick={(event) => exportFile(format, event)} disabled={isExporting}><Icon />{label}</button>
        ))}
        {error ? <span className="export-error">{error}</span> : null}
      </div>
    </details>
  );
}
