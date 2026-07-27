import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-black text-[#10182d]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function BankChart({ data }) {
  const activeIndex = data.reduce((bestIndex, item, index, items) => (item.value > items[bestIndex].value ? index : bestIndex), 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="chart-card min-w-0 p-5 rounded-[10px] bg-white border border-[#e9edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)] hover:shadow-[0_12px_28px_rgba(19,35,58,0.12)] transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xs font-black text-[#111a2e] uppercase tracking-wider m-0">Bank wise today collection</h2>
      </div>
      <span className="block h-1 w-[31px] rounded-full bg-gradient-to-r from-[#109c4b] to-[#82d690] mt-3" />

      <div className="w-full h-[218px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 4, left: -12, bottom: 14 }}>
            <CartesianGrid vertical={false} stroke="#e8edf3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-38}
              textAnchor="end"
              height={62}
              tick={{ fill: "#657185", fontSize: 10, fontWeight: 700 }}
            />
            <YAxis tickLine={false} axisLine={false} tickFormatter={formatCompact} tick={{ fill: "#657185", fontSize: 10 }} />
            <Tooltip cursor={{ fill: "rgba(38, 178, 91, 0.06)" }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[7, 7, 0, 0]} maxBarSize={46}>
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={index === activeIndex && entry.value > 0 ? "#ec1f63" : "#16a85d"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.article>
  );
}
