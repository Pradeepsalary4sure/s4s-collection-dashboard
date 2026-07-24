import { FiMenu } from "react-icons/fi";
import DateFilter from "./DateFilter";
import ExportButton from "./ExportButton";
import MonthFilter from "./MonthFilter";
import { formatReportDate } from "../utils/formatters";

export default function Navbar({ filters, onDateChange, onMonthChange, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="menu-trigger" type="button" aria-label="Open navigation" onClick={onMenuClick}><FiMenu /></button>
      <div className="topbar-title"><p>Collection report</p><span>{formatReportDate(filters.date)}</span></div>
      <div className="topbar-actions">
        <DateFilter value={filters.date} onChange={onDateChange} />
        <MonthFilter value={filters.month} onChange={onMonthChange} />
        <ExportButton filters={filters} />
      </div>
    </header>
  );
}
