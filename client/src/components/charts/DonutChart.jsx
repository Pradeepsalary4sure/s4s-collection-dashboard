import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/formatters";

const colors = ["#e72264", "#22a950", "#f57925", "#18b9c8", "#b3bbc4"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-gray-600">{payload[0].name}</p>
        <p className="text-sm font-black text-[#10182d]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = total ? data.filter((item) => item.value > 0) : [{ name: "No collection", value: 1 }];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="chart-card min-w-0 p-5 rounded-[10px] bg-white border border-[#e9edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)] hover:shadow-[0_12px_28px_rgba(19,35,58,0.12)] transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xs font-black text-[#111a2e] uppercase tracking-wider m-0">MTD collection breakup</h2>
      </div>
      <span className="block h-1 w-[31px] rounded-full bg-gradient-to-r from-[#109c4b] to-[#82d690] mt-3" />

      <div className="grid gap-1.5 h-[222px]" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
        <div className="h-[205px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="57%" outerRadius="82%" paddingAngle={total ? 2 : 0} stroke="none">
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={total ? colors[index % colors.length] : "#dfe6ed"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid pointer-events-none" style={{ alignContent: "center", justifyItems: "center", gap: "3px" }}>
            <strong className="text-xs font-black text-[#344054]">{total ? "MTD" : "No data"}</strong>
            <span className="text-[10px] font-bold text-[#6c7586] text-center max-w-[100px]">
              {total ? formatCurrency(total, { notation: "compact" }) : ""}
            </span>
          </div>
        </div>

        <div className="grid gap-3.5">
          {data.map((item, index) => (
            <div className="grid items-center gap-[7px] text-[10px] font-bold" style={{ gridTemplateColumns: "8px minmax(0, 1fr) auto" }} key={item.name}>
              <span className="w-2 h-2 rounded-full" style={{ background: colors[index % colors.length] }} />
              <b className="chart-legend-label text-[#3c4555] truncate font-bold">{item.name}</b>
              <strong className="chart-legend-value text-[10px] font-black text-[#172033]">{formatCurrency(item.value)}</strong>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

