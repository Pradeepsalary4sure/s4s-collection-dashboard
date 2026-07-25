import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell({ count = 0, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-gray-400" />

        <AnimatePresence>
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full text-[10px] font-bold text-white shadow-lg shadow-emerald-500/30"
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
            className="absolute top-full right-0 mt-2 w-72 p-4 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/30 z-50"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Notifications</p>
            <div className="text-center py-6">
              <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

