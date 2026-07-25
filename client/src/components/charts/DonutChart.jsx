import { motion } from "framer-motion";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";

const colors = ["#e72264", "#22a950", "#f57925", "#18b9c8", "#b3bbc4"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold text-gray-300 mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-white">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = total
    ? data.filter((item) => item.value > 0)
    : [{ name: "No collection", value: 1 }];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/5"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-300" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            MTD Collection Breakup
          </h3>
        </div>

        <div className="grid grid-cols-[1fr_1.2fr] gap-4 items-center">
          {/* Donut */}
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={total ? 3 : 0}
                  stroke="none"
                  animationBegin={200}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={total ? colors[index % colors.length] : "rgba(255,255,255,0.1)"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                {total ? "MTD" : "No Data"}
              </p>
              {total > 0 && (
                <p className="text-sm font-black text-white mt-1">
                  {formatCurrency(total, { notation: "compact" })}
                </p>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.06, duration: 0.3 }}
                className="flex items-center gap-2.5"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="flex-1 text-[10px] font-semibold text-gray-400 truncate">
                  {item.name}
                </span>
                <span className="text-[10px] font-bold text-white tabular-nums">
                  {formatCurrency(item.value)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <span className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
    </motion.article>
  );
}

