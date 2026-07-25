import { motion } from "framer-motion";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";
import { TrendingUp, BarChart3, CreditCard, Building2 } from "lucide-react";

const cardConfigs = {
  todayCollection: {
    title: "Today's Collection",
    description: "Total collected today",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-emerald-400",
    glow: "emerald",
    accent: "emerald",
  },
  mtdCollection: {
    title: "Total MTD Collection",
    description: "Total till selected month",
    icon: BarChart3,
    gradient: "from-blue-500 to-blue-400",
    glow: "blue",
    accent: "blue",
  },
  cashfreeCollection: {
    title: "Cashfree Collection",
    description: "Collected via Cashfree",
    icon: CreditCard,
    gradient: "from-purple-500 to-purple-400",
    glow: "purple",
    accent: "purple",
  },
  totalBanks: {
    title: "Total Banks",
    description: "Banks in this report",
    icon: Building2,
    gradient: "from-amber-500 to-amber-400",
    glow: "amber",
    accent: "amber",
  },
};

const glowMap = {
  emerald: "shadow-emerald-500/20",
  blue: "shadow-blue-500/20",
  purple: "shadow-purple-500/20",
  amber: "shadow-amber-500/20",
};

const accentMap = {
  emerald: "bg-gradient-to-r from-emerald-400 to-emerald-300",
  blue: "bg-gradient-to-r from-blue-400 to-blue-300",
  purple: "bg-gradient-to-r from-purple-400 to-purple-300",
  amber: "bg-gradient-to-r from-amber-400 to-amber-300",
};

export default function KpiCard({ dataKey, value, isCurrency = true, delay = 0 }) {
  const config = cardConfigs[dataKey];
  if (!config) return null;

  const { title, description, icon: Icon, gradient, glow, accent } = config;

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl ${glowMap[glow]} hover:shadow-2xl hover:border-white/20 transition-all duration-300 group`}
    >
      {/* Gradient overlay */}
      <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient}/5`} />

      {/* Glow effect */}
      <span className={`absolute -top-20 -right-20 w-40 h-40 bg-${accent}-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Accent line */}
      <span className={`block w-8 h-1 mb-4 rounded-full ${accentMap[accent]}`} />

      <div className="relative z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {title}
        </p>

        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="flex-1 min-w-0">
            <motion.p
              key={finalValue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl md:text-3xl font-black tracking-tight truncate text-white`}
            >
              {displayValue}
            </motion.p>
          </div>

          <span className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}/20 border border-white/10 shadow-lg`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${accent}-400`} />
          </span>
        </div>

        <p className="text-[11px] text-gray-500 font-medium mt-2">{description}</p>
      </div>
    </motion.article>
  );
}

