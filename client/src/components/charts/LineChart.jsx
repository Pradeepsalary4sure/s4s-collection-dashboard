import { motion } from "framer-motion";
import {
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import { formatCompact, formatCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold text-gray-300 mb-1">{label}</p>
        <p className="text-sm font-bold text-emerald-400">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// Generate mock MTD data if none provided
function generateMTDData() {
  const days = Array.from({ length: 15 }, (_, i) => i + 1);
  return days.map((day) => ({
    day: `Day ${day}`,
    value: Math.floor(Math.random() * 500000) + 200000,
  }));
}

export default function MTDLineChart({ data }) {
  const chartData = data?.length ? data : generateMTDData();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/5"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            MTD Collection Trend
          </h3>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart
              data={chartData}
              margin={{ top: 10, right: 4, left: -10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCompact}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                fill="url(#lineGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#10b981",
                  stroke: "#064e3b",
                  strokeWidth: 2,
                }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <span className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
    </motion.article>
  );
}

