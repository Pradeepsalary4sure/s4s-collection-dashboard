import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { useLiveDateTime } from "../../hooks/useLiveDateTime";
import ThemeToggle from "../ui/ThemeToggle";
import NotificationBell from "../ui/NotificationBell";
import DateFilter from "../ui/DateFilter";
import MonthFilter from "../ui/MonthFilter";
import ExportButton from "../ui/GlassExportButton";
import { formatReportDate } from "../../utils/formatters";

export default function Header({ filters, onDateChange, onMonthChange, onMenuClick }) {
  const { time, date } = useLiveDateTime();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="dashboard-header sticky top-0 z-30 flex items-center gap-3 md:gap-5 px-4 md:px-7 py-4 md:py-[22px] border-b border-[#e5e9ed] bg-white/90 backdrop-blur-xl"
    >
      {/* Mobile menu */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="menu-button lg:hidden w-[38px] h-[38px] flex items-center justify-center rounded-lg hover:bg-[#eff4f1] transition-colors text-[#172033]"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="w-[23px] h-[23px]" />
      </motion.button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[clamp(19px,2vw,28px)] font-black text-[#07142b] tracking-tight leading-none truncate uppercase"
        >
          Collection Report
        </motion.h1>
        <p className="text-xs font-bold text-[#172033] mt-1">
          {formatReportDate(filters.date)}
        </p>
      </div>

      {/* Search (desktop) */}
      <div className="header-search hidden md:flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-[#e2e8ed] text-gray-500 min-w-[180px] shadow-sm">
        <Search className="w-3.5 h-3.5" />
        <input
          type="text"
          placeholder="Search reports..."
          className="flex-1 bg-transparent border-none outline-none text-xs text-[#172033] placeholder-gray-400 font-bold"
        />
        <kbd className="hidden lg:inline-flex text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Date & Month filters */}
      <DateFilter value={filters.date} onChange={onDateChange} />
      <MonthFilter value={filters.month} onChange={onMonthChange} />

      {/* Actions */}
      <div className="flex items-center gap-3.5">
        <ExportButton filters={filters} />
        <NotificationBell count={0} />
        <ThemeToggle />

        {/* Live clock */}
        <div className="header-clock hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
          <span className="text-xs font-bold text-[#10182d] tabular-nums">{time}</span>
          <span className="text-[9px] font-semibold text-gray-500">{date}</span>
        </div>

        {/* Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-[38px] h-[38px] rounded-lg bg-gradient-to-br from-[#13a44f] to-[#07883b] flex items-center justify-center shadow-md shadow-[#13a44f]/30 cursor-pointer"
        >
          <span className="text-xs font-black text-white">AD</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
