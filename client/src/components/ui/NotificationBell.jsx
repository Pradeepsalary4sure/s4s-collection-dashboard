import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function NotificationBell({ count = 0, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
          isDark
            ? "border-white/10 bg-white/5 hover:bg-white/10"
            : "border-gray-200 bg-white hover:bg-gray-100 shadow-sm"
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-gray-500" />

        <AnimatePresence>
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full text-[10px] font-bold text-white shadow-md shadow-emerald-500/30"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full right-0 mt-2 w-72 p-4 rounded-2xl shadow-2xl z-50 ${
              isDark
                ? "bg-gray-900/95 border border-white/10"
                : "bg-white border border-gray-200"
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Notifications
            </p>
            <div className="text-center py-6">
              <Bell className={`w-8 h-8 mx-auto mb-2 ${
                isDark ? "text-gray-600" : "text-gray-300"
              }`} />
              <p className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>No new notifications</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

