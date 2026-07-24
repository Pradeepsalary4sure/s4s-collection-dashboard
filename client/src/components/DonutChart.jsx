import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../utils/formatters";

const colors = ["#e72264", "#22a950", "#f57925", "#18b9c8", "#b3bbc4"];

export default function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = total ? data.filter((item) => item.value > 0) : [{ name: "No collection", value: 1 }];
  return (
    <article className="panel chart-panel donut-panel">
      <div className="panel-heading"><div><h2>MTD collection breakup</h2><span className="title-accent" /></div></div>
      <div className="donut-layout">
        <div className="donut-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="57%" outerRadius="82%" paddingAngle={total ? 2 : 0} stroke="none">
                {chartData.map((entry, index) => <Cell key={entry.name} fill={total ? colors[index % colors.length] : "#dfe6ed"} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend content={() => null} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-centre"><strong>{total ? "MTD" : "No data"}</strong><span>{total ? formatCurrency(total, { notation: "compact" }) : ""}</span></div>
        </div>
        <div className="chart-legend">
          {data.map((item, index) => <div className="legend-row" key={item.name}><span className={`legend-dot legend-dot--${index}`} /><b>{item.name}</b><strong>{formatCurrency(item.value)}</strong></div>)}
        </div>
      </div>
    </article>
  );
}
