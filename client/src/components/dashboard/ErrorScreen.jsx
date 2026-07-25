import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import GlassButton from "../ui/GlassButton";

export default function ErrorScreen({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center min-h-[55vh] gap-5 px-6 text-center"
      role="alert"
    >
      <motion.span
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/10 border border-rose-500/20 shadow-lg shadow-rose-500/10"
      >
        <AlertTriangle className="w-6 h-6 text-rose-400" />
      </motion.span>

      <div>
        <h2 className="text-lg font-bold text-white mb-2">Report Unavailable</h2>
        <p className="text-sm text-gray-400 max-w-md">{message}</p>
      </div>

      <GlassButton onClick={onRetry} icon={RefreshCw} variant="danger">
        Try Again
      </GlassButton>
    </motion.div>
  );
}
