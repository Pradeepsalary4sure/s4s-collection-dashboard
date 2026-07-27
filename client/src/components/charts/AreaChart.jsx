import { motion } from "framer-motion";
import {
  AreaChart as ReAreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-black" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function generateBankData() {
  const banks = ["HDFC", "ICICI", "BOB", "YES BANK", "IDFC"];
  return banks.map((bank) => ({
    name: bank,
    today: Math.floor(Math.random() * 800000) + 100000,
    mtd: Math.floor(Math.random() * 5000000) + 500000,
  }));
}

export default function BankAreaChart({ data }) {
  const chartData = data?.length ? data : generateBankData();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="chart-card min-w-0 p-5 rounded-[10px] bg-white border border-[#e9edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)] hover:shadow-[0_12px_28px_rgba(19,35,58,0.12)] transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="block h-[3px] w-[25px] rounded-full bg-gradient-to-r from-purple-400 to-purple-300" />
        <h3 className="text-xs font-black text-[#111a2e] uppercase tracking-wider">Bank Performance Overview</h3>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ReAreaChart data={chartData} margin={{ top: 10, right: 4, left: -10, bottom: 10 }}>
            <defs>
              <linearGradient id="areaTodayLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="areaMtdLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e8edf3" />
            <XAxis
              dataKey="name"
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
            <Area type="monotone" dataKey="today" stroke="#10b981" strokeWidth={2} fill="url(#areaTodayLight)" dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
            <Area type="monotone" dataKey="mtd" stroke="#8b5cf6" strokeWidth={2} fill="url(#areaMtdLight)" dot={false} activeDot={{ r: 4, fill: "#8b5cf6" }} />
          </ReAreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-[3px] rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-[#657185]">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-[3px] rounded-full bg-purple-500" />
          <span className="text-[10px] font-bold text-[#657185]">MTD</span>
        </div>
        </div>
    </motion.article>
  );
}
