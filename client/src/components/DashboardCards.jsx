import { FiBarChart2, FiCreditCard, FiTrendingUp, FiUsers } from "react-icons/fi";
import { formatCurrency, formatNumber } from "../utils/formatters";

const cards = [
  { key: "todayCollection", title: "Today's collection", description: "Total collected today", icon: FiTrendingUp, tone: "green" },
  { key: "mtdCollection", title: "Total MTD collection", description: "Total till selected month", icon: FiBarChart2, tone: "blue" },
  { key: "cashfreeCollection", title: "Cashfree collection", description: "Collected via Cashfree", icon: FiCreditCard, tone: "purple" },
  { key: "totalBanks", title: "Total banks", description: "Banks in this report", icon: FiUsers, tone: "orange" },
];

export default function DashboardCards({ summary }) {
  return (
    <section className="metrics-grid" aria-label="Collection overview">
      {cards.map(({ key, title, description, icon: Icon, tone }) => (
        <article className={`metric-card metric-card--${tone}`} key={key}>
          <span className="metric-accent" />
          <p>{title}</p>
          <div className="metric-value-row"><strong>{key === "totalBanks" ? formatNumber(summary[key]) : formatCurrency(summary[key])}</strong><span className="metric-icon"><Icon /></span></div>
          <small>{description}</small>
        </article>
      ))}
    </section>
  );
}
