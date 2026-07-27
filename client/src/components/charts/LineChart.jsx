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
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-black text-emerald-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

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
      className="chart-card min-w-0 p-5 rounded-[10px] bg-white border border-[#e9edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)] hover:shadow-[0_12px_28px_rgba(19,35,58,0.12)] transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="block h-[3px] w-[25px] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
        <h3 className="text-xs font-black text-[#111a2e] uppercase tracking-wider">MTD Collection Trend</h3>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={chartData} margin={{ top: 10, right: 4, left: -10, bottom: 10 }}>
            <defs>
              <linearGradient id="lineGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e8edf3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#657185", fontSize: 9, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompact}
              tick={{ fill: "#657185", fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" fill="url(#lineGradientLight)" stroke="none" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </motion.article>
  );
}

