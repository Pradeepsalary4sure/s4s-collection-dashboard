import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  glowColor = "emerald",
  hover = true,
  padding = true,
  delay = 0,
}) {
  const glowClasses = {
    emerald: "hover:shadow-emerald-500/10",
    blue: "hover:shadow-blue-500/10",
    purple: "hover:shadow-purple-500/10",
    amber: "hover:shadow-amber-500/10",
    rose: "hover:shadow-rose-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        hover
          ? { y: -2, transition: { duration: 0.2 } }
          : undefined
      }
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-xl shadow-black/5
        ${hover ? `hover:shadow-2xl hover:border-white/20 ${glowClasses[glowColor]} transition-all duration-300` : ""}
        ${padding ? "p-6" : ""}
        rounded-2xl
        ${className}
      `}
    >
      {/* Glass highlight */}
      <span className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent pointer-events-none" />

      {/* Animated border glow */}
      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <span className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${glowColor}-400/10 to-transparent blur-xl`} />
      </span>

      {children}
    </motion.div>
  );
}

