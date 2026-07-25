import { motion } from "framer-motion";
import { TrendingUp, BarChart3, CreditCard, Building2 } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/formatters";

const summaryItems = [
  { key: "todayCollection", label: "Today's Collection", icon: TrendingUp, gradient: "from-emerald-500 to-emerald-400", iconBg: "bg-emerald-500/20 border-emerald-500/10" },
  { key: "mtdCollection", label: "MTD Collection", icon: BarChart3, gradient: "from-blue-500 to-blue-400", iconBg: "bg-blue-500/20 border-blue-500/10" },
  { key: "cashfreeCollection", label: "Cashfree Collection", icon: CreditCard, gradient: "from-purple-500 to-purple-400", iconBg: "bg-purple-500/20 border-purple-500/10" },
  { key: "totalBanks", label: "Total Banks", icon: Building2, gradient: "from-amber-500 to-amber-400", iconBg: "bg-amber-500/20 border-amber-500/10" },
];

export default function SummaryCard({ summary }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/5"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Collection Summary</h3>
        </div>

        <div className="grid gap-3">
          {summaryItems.map(({ key, label, icon: Icon, gradient, iconBg }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
            >
              <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`w-4.5 h-4.5 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
              </span>
              <span className="flex-1 text-xs font-semibold text-gray-400">{label}</span>
              <strong className="text-sm font-black text-white tabular-nums">
                {key === "totalBanks" ? formatNumber(summary[key]) : formatCurrency(summary[key])}
              </strong>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
