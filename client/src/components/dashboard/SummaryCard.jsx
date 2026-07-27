import { motion } from "framer-motion";
import { TrendingUp, BarChart3, CreditCard, Building2, Award, Sparkles } from "lucide-react";
import { formatCurrency, formatNumber, formatReportDate } from "../../utils/formatters";

const summaryItems = [
  { key: "todayCollection", label: "Today's collection", icon: TrendingUp, tone: "green" },
  { key: "mtdCollection", label: "MTD collection", icon: BarChart3, tone: "blue" },
  { key: "cashfreeCollection", label: "Cashfree collection", icon: CreditCard, tone: "purple" },
  { key: "totalBanks", label: "Total banks", icon: Building2, tone: "orange" },
];

const toneConfig = {
  green: { bg: "#18a958", text: "#109344" },
  blue: { bg: "#1169e8", text: "#0966db" },
  purple: { bg: "#e81b68", text: "#832fd0" },
  orange: { bg: "#f77d1c", text: "#ef6919" },
};

export default function SummaryCard({ summary, date }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="collection-summary-card relative overflow-hidden p-5 md:p-[21px] rounded-[10px] bg-white border border-[#e9edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)] hover:shadow-[0_12px_28px_rgba(19,35,58,0.12)] transition-all duration-300"
    >
      {/* Animated gradient background blob */}
      <motion.span
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/5 to-blue-500/5 blur-2xl pointer-events-none"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-xs font-black text-[#111a2e] uppercase tracking-wider">
            Collection Summary
          </h3>
          <span className="block h-1 w-[31px] rounded-full bg-gradient-to-r from-[#109c4b] to-[#82d690] mt-3" />
          <p className="text-[10px] font-bold text-[#667085] mt-2">
            {date ? formatReportDate(date) : ""}
          </p>
        </div>

        <div className="grid gap-3.5">
          {summaryItems.map(({ key, label, icon: Icon, tone }, i) => {
            const config = toneConfig[tone];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="summary-item grid items-center gap-2.5 text-xs font-bold px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-default"
                style={{
                  gridTemplateColumns: "30px minmax(0, 1fr) auto",
                  color: "#344054",
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="flex items-center justify-center w-[30px] h-[30px] rounded-md text-white shadow-sm"
                  style={{ background: config.bg }}
                >
                  <Icon className="w-4 h-4" />
                </motion.span>
                <span className="tracking-wide">{label}</span>
                <strong className="text-xs font-black text-[#141e32]">
                  {key === "totalBanks"
                    ? formatNumber(summary[key])
                    : formatCurrency(summary[key])}
                </strong>
              </motion.div>
            );
          })}

          {/* Total (Naman) - Premium Highlighted Row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + summaryItems.length * 0.08, duration: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
            className="summary-naman-row relative overflow-hidden grid items-center gap-2.5 text-xs font-bold p-3.5 rounded-xl border-2 shadow-lg cursor-default"
            style={{
              gridTemplateColumns: "34px minmax(0, 1fr) auto",
              background: "linear-gradient(135deg, #eef2ff, #faf5ff, #fdf2f8)",
              borderColor: "rgba(99, 102, 241, 0.3)",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
            }}
          >
            {/* Sparkle particles */}
            <motion.span
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-1 -right-1 w-3 h-3"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.span>

            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 text-white shadow-md relative z-10"
            >
              <Award className="w-4.5 h-4.5" />
            </motion.span>

            <span className="summary-naman-label font-black tracking-wide relative z-10">
              Total (Naman)
            </span>

            <motion.strong
              key={summary.namanCollection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="summary-naman-amount text-sm font-black relative z-10"
            >
              {formatCurrency(summary.namanCollection)}
            </motion.strong>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

