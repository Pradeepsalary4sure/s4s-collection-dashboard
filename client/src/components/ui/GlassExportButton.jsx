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
        className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500/90 to-emerald-400/80 border border-emerald-400/20 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-300 transition-all"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? "Preparing..." : "Export"}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-2 w-44 p-2 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/30 z-50"
          >
            <p className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Download as
            </p>
            {exportOptions.map(({ format, label, icon: Icon }) => (
              <button
                key={format}
                onClick={() => exportFile(format)}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {label}
              </button>
            ))}
            {error && (
              <p className="px-3 py-1.5 text-[10px] text-rose-400 font-medium">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

