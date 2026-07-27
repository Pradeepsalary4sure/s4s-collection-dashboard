import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5">
      {/* Animated logo */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#13a44f] to-[#07883b] shadow-2xl shadow-[#13a44f]/30"
      >
        <span className="text-lg font-black text-white">S4S</span>
        <span className="absolute inset-0 rounded-2xl animate-pulse bg-emerald-400/20" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm font-bold text-gray-500"
      >
        Loading collection report
      </motion.p>

      {/* Animated progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#13a44f] via-[#34d399] to-[#13a44f]"
        />
      </div>
    </div>
  );
}

