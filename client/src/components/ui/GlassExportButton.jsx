import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { downloadReport } from "../../services/api";

const exportOptions = [
  { format: "excel", label: "Excel", icon: FileSpreadsheet },
  { format: "csv", label: "CSV", icon: FileText },
  { format: "pdf", label: "PDF", icon: FileText },
];

export default function ExportButton({ filters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  async function exportFile(format) {
    setIsExporting(true);
    setError("");
    try {
      await downloadReport(format, filters);
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Export could not be created.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black text-white rounded-lg bg-gradient-to-r from-[#07963f] to-[#63c817] border-0 shadow-[0_8px_16px_rgba(25,150,59,0.24)] hover:shadow-[0_10px_20px_rgba(25,150,59,0.35)] transition-all min-w-[145px] justify-center"
      >
        <Download className="w-[17px] h-[17px]" />
        <span>{isExporting ? "Preparing..." : "Export report"}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-2 w-44 p-2 bg-white border border-[#e2e8ed] rounded-[10px] shadow-[0_12px_28px_rgba(15,32,53,0.15)] z-50"
          >
            <p className="px-3 py-1.5 text-[10px] font-black text-[#667085] uppercase tracking-widest">
              Download as
            </p>
            {exportOptions.map(({ format, label, icon: Icon }) => (
              <button
                key={format}
                onClick={() => exportFile(format)}
                disabled={isExporting}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-bold text-[#162134] hover:text-[#07883b] hover:bg-[#eefaf1] transition-colors disabled:opacity-50"
              >
                <Icon className="w-4 h-4 text-[#13a44f]" />
                {label}
              </button>
            ))}
            {error && (
              <p className="px-3 py-1.5 text-[10px] text-[#b42318] font-medium">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

