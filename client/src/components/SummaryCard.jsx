import { FiBarChart2, FiCreditCard, FiTrendingUp, FiUsers } from "react-icons/fi";
import { formatCurrency, formatNumber } from "../utils/formatters";

const summaryItems = [
  { key: "todayCollection", label: "Today's collection", icon: FiTrendingUp, tone: "green" },
  { key: "mtdCollection", label: "MTD collection", icon: FiBarChart2, tone: "blue" },
  { key: "cashfreeCollection", label: "Cashfree collection", icon: FiCreditCard, tone: "pink" },
  { key: "totalBanks", label: "Total banks", icon: FiUsers, tone: "orange" },
];

export default function SummaryCard({ summary }) {
  return (
    <article className="panel summary-panel">
      <div className="panel-heading"><div><h2>Collection summary</h2><span className="title-accent" /></div></div>
      <div className="summary-list">
        {summaryItems.map(({ key, label, icon: Icon, tone }) => (
          <div className="summary-item" key={key}>
            <span className={`summary-icon summary-icon--${tone}`}><Icon /></span>
            <span>{label}</span>
            <strong>{key === "totalBanks" ? formatNumber(summary[key]) : formatCurrency(summary[key])}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}
