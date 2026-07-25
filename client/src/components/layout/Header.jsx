import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { useLiveDateTime } from "../../hooks/useLiveDateTime";
import ThemeToggle from "../ui/ThemeToggle";
import NotificationBell from "../ui/NotificationBell";
import DateFilter from "../DateFilter";
import MonthFilter from "../MonthFilter";
import ExportButton from "../ExportButton";
import { formatReportDate } from "../../utils/formatters";

export default function Header({ filters, onDateChange, onMonthChange, onMenuClick }) {
  const { time, date } = useLiveDateTime();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-gray-900/60 backdrop-blur-2xl"
    >
      {/* Mobile menu */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-gray-400"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="w-4.5 h-4.5" />
      </motion.button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-lg md:text-xl font-bold text-white tracking-tight truncate"
        >
          Collection Report
        </motion.h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {formatReportDate(filters.date)}
        </p>
      </div>

      {/* Search (desktop) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 min-w-[200px]">
        <Search className="w-3.5 h-3.5" />
        <input
          type="text"
          placeholder="Search reports..."
          className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 font-medium"
        />
        <kbd className="hidden lg:inline-flex text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded font-mono border border-white/5">
          ⌘K
        </kbd>
      </div>

      {/* Date & Month filters */}
      <DateFilter value={filters.date} onChange={onDateChange} />
      <MonthFilter value={filters.month} onChange={onMonthChange} />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ExportButton filters={filters} />
        <NotificationBell count={0} />
        <ThemeToggle />

        {/* Live clock */}
        <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-xs font-semibold text-white tabular-nums">{time}</span>
          <span className="text-[9px] text-gray-500 font-medium">{date}</span>
        </div>

        {/* Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <span className="text-xs font-bold text-white">AD</span>
        </motion.div>
      </div>
    </motion.header>
  );
}

