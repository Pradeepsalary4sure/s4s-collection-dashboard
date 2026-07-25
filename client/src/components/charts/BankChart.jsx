import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "../../utils/formatters";

const bankColors = {
  HDFC: "#327df5",
  ICICI: "#fb6245",
  BOB: "#d81921",
  "YES BANK": "#079440",
  IDFC: "#8c0b2b",
  "IDFC NEW": "#0095ad",
  CASHFREE: "#db1462",
};

function getBarColor(name) {
  const upper = name?.toUpperCase() || "";
  return bankColors[upper] || "#16a85d";
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold text-gray-300 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function BankChart({ data }) {
  const [activeBar, setActiveBar] = useState(null);
  const activeIndex = data.reduce(
    (bestIndex, item, index, items) =>
      item.value > items[bestIndex].value ? index : bestIndex,
    0
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/5"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Bank Wise Today Collection
          </h3>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 4, left: -10, bottom: 10 }}
              onMouseLeave={() => setActiveBar(null)}
            >
              <defs>
                {data.map((entry, index) => (
                  <linearGradient
                    key={`grad-${index}`}
                    id={`barGradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={getBarColor(entry.name)}
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor={getBarColor(entry.name)}
                      stopOpacity={0.4}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={65}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCompact}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.06)" }} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                onMouseEnter={(_, index) => setActiveBar(index)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#barGradient-${index})`}
                    stroke={activeBar === index ? getBarColor(entry.name) : "transparent"}
                    strokeWidth={activeBar === index ? 2 : 0}
                    style={{
                      filter: activeBar === index
                        ? `drop-shadow(0 0 8px ${getBarColor(entry.name)}50)`
                        : "none",
                      transition: "filter 0.2s ease, stroke 0.2s ease",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <span className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
    </motion.article>
  );
}

