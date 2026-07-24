import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatCurrency } from "../utils/formatters";

export default function BankChart({ data }) {
  const activeIndex = data.reduce((bestIndex, item, index, items) => (item.value > items[bestIndex].value ? index : bestIndex), 0);
  return (
    <article className="panel chart-panel">
      <div className="panel-heading"><div><h2>Bank wise today collection</h2><span className="title-accent" /></div></div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 4, left: -12, bottom: 14 }}>
            <CartesianGrid vertical={false} stroke="#e8edf3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-38} textAnchor="end" height={62} tick={{ fill: "#657185", fontSize: 10, fontWeight: 700 }} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={formatCompact} tick={{ fill: "#657185", fontSize: 10 }} />
            <Tooltip cursor={{ fill: "rgba(38, 178, 91, 0.06)" }} formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" radius={[7, 7, 0, 0]} maxBarSize={46}>
              {data.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={index === activeIndex && entry.value > 0 ? "#ec1f63" : "#16a85d"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
