import { motion } from "framer-motion";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";
import { TrendingUp, BarChart3, CreditCard, Building2 } from "lucide-react";

const cardConfigs = {
  todayCollection: {
    title: "Today's Collection",
    description: "Total collected today",
    icon: TrendingUp,
    accent: "#10a84c",
    accentBar: "linear-gradient(90deg, #10a84c, #80df94)",
    iconBg: "#d9f5db",
    iconColor: "#139a48",
    glowColor: "rgba(16, 168, 76, 0.15)",
    borderGlow: "rgba(16, 168, 76, 0.3)",
    gradientOverlay: "from-emerald-500/5 to-transparent",
    hoverGlow: "shadow-emerald-500/20",
  },
  mtdCollection: {
    title: "Total MTD Collection",
    description: "Total till selected month",
    icon: BarChart3,
    accent: "#0f6df3",
    accentBar: "linear-gradient(90deg, #0f6df3, #89b6ff)",
    iconBg: "#1169e8",
    iconColor: "#ffffff",
    glowColor: "rgba(15, 109, 243, 0.15)",
    borderGlow: "rgba(15, 109, 243, 0.3)",
    gradientOverlay: "from-blue-500/5 to-transparent",
    hoverGlow: "shadow-blue-500/20",
  },
  cashfreeCollection: {
    title: "Cashfree Collection",
    description: "Collected via Cashfree",
    icon: CreditCard,
    accent: "#9e3bea",
    accentBar: "linear-gradient(90deg, #9e3bea, #e5b8ff)",
    iconBg: "#a34ce5",
    iconColor: "#ffffff",
    glowColor: "rgba(158, 59, 234, 0.15)",
    borderGlow: "rgba(158, 59, 234, 0.3)",
    gradientOverlay: "from-purple-500/5 to-transparent",
    hoverGlow: "shadow-purple-500/20",
  },
  totalBanks: {
    title: "Total Banks",
    description: "Banks in this report",
    icon: Building2,
    accent: "#f46b1c",
    accentBar: "linear-gradient(90deg, #f46b1c, #ffc386)",
    iconBg: "#ff9a59",
    iconColor: "#ffffff",
    glowColor: "rgba(244, 107, 28, 0.15)",
    borderGlow: "rgba(244, 107, 28, 0.3)",
    gradientOverlay: "from-amber-500/5 to-transparent",
    hoverGlow: "shadow-amber-500/20",
  },
};

export default function KpiCard({ dataKey, value, isCurrency = true, delay = 0 }) {
  const config = cardConfigs[dataKey];
  if (!config) return null;

  const { title, description, icon: Icon, accent, accentBar, iconBg, iconColor, glowColor, borderGlow, gradientOverlay, hoverGlow } = config;

  const numericValue = Number(value) || 0;
  const animatedValue = useAnimatedCounter(numericValue, 1500, true);

  const displayValue = isCurrency
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(animatedValue)
    : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(animatedValue);

  const finalValue = isCurrency
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(numericValue)
    : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(numericValue);

  const valueColor = dataKey === "todayCollection" ? "#109344" : accent;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="kpi-card relative overflow-hidden p-5 md:p-[21px] rounded-[10px] bg-white border border-[#e9edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)] hover:shadow-[0_15px_35px_rgba(19,35,58,0.15)] transition-all duration-300 group"
    >
      {/* Gradient overlay on hover */}
      <motion.span
        className={`absolute inset-0 bg-gradient-to-br ${gradientOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Glow effect on hover */}
      <motion.span
        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        style={{ background: glowColor }}
      />

      {/* Accent bar with animation */}
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "31px" }}
        transition={{ duration: 0.6, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="block h-1 rounded-full mb-4"
        style={{ background: accentBar }}
      />

      <div className="relative z-10">
        <p className="text-[10px] font-black text-[#1b2639] uppercase tracking-wider mb-1">
          {title}
        </p>

        <div className="flex items-center justify-between gap-3 mt-5">
          <div className="flex-1 min-w-0">
            <motion.p
              key={finalValue}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(20px,2.1vw,29px)] font-black tracking-tight truncate leading-none"
              style={{ color: valueColor }}
            >
              {displayValue}
            </motion.p>
          </div>

          <motion.span
            whileHover={{ scale: 1.1, rotate: 8 }}
            className="flex-shrink-0 w-[57px] h-[57px] flex items-center justify-center rounded-full shadow-sm"
            style={{ background: iconBg }}
          >
            <motion.div
              animate={{ rotate: [0, 0, 0] }}
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-7 h-7" style={{ color: iconColor, strokeWidth: 2.6 }} />
            </motion.div>
          </motion.span>
        </div>

        <p className="text-[10px] font-semibold text-[#737b8d] mt-3">{description}</p>
      </div>

      {/* Bottom border accent on hover */}
      <motion.span
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left transition-transform duration-300"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}44)` }}
      />
    </motion.article>
  );
}
