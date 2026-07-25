import { motion } from "framer-motion";

export default function GlassButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold border border-white/10 backdrop-blur-xl transition-all select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500/90 to-emerald-400/80 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-300",
    secondary:
      "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20",
    danger:
      "bg-gradient-to-r from-rose-500/90 to-red-500/80 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40",
    ghost:
      "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border-transparent",
    gold:
      "bg-gradient-to-r from-amber-500/90 to-yellow-400/80 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-yellow-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      {...props}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
        <span className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300" />
      </span>

      {/* Glow on hover */}
      <span className="absolute -inset-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />

      {Icon && (
        <span className="relative z-10">
          <Icon className="w-4 h-4" />
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

