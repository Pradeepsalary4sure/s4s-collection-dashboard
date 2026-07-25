import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Repeat,
  TrendingUp,
  Download,
  Settings,
  X,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { formatMonth } from "../../utils/formatters";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Collection Report", icon: FileText },
  { label: "Bank Summary", icon: BarChart3 },
  { label: "Transactions", icon: Repeat },
  { label: "Reports", icon: FileText },
  { label: "Charts", icon: TrendingUp },
  { label: "Export Data", icon: Download },
  { label: "Settings", icon: Settings },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] } }),
};

export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const period = formatMonth(new Date().toISOString().slice(0, 7));

  function selectItem(label) {
    setActiveItem(label);
    onClose();
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-[280px] h-screen flex flex-col
          bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95
          backdrop-blur-2xl
          border-r border-white/5
          shadow-2xl shadow-black/30
          overflow-hidden
        `}
      >
        {/* Decorative gradient */}
        <span className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <span className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center justify-between px-6 py-7 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <Building2 className="w-5 h-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-white tracking-tight leading-none">
                SALARY <span className="text-emerald-400">4</span> SURE
              </p>
              <p className="text-[9px] font-semibold text-gray-500 tracking-wider uppercase mt-1">
                Smart Collection. Secure Future.
              </p>
            </div>
          </motion.div>

          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {navigation.map(({ label, icon: Icon }, i) => {
            const isActive = activeItem === label;
            return (
              <motion.button
                key={label}
                custom={i}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectItem(label)}
                className={`
                  relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${isActive
                    ? "text-white bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-400/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-emerald-400" : ""}`} />
                  <span>{label}</span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Report Period */}
        <div className="relative z-10 px-4 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 backdrop-blur-xl"
          >
            <span className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/10">
                <FileText className="w-4 h-4 text-emerald-400" />
              </span>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Report Period</p>
                <p className="text-sm font-bold text-white mt-1">{period}</p>
                <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider mt-0.5">MTD</p>
              </div>
            </div>

            {/* Decorative icon */}
            <div className="absolute right-3 bottom-3 text-2xl font-black text-emerald-500/10 select-none">₹</div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}

