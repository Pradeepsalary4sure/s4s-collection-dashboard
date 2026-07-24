import { useState } from "react";
import {
  FiBarChart2,
  FiDownload,
  FiFileText,
  FiGrid,
  FiRepeat,
  FiSettings,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { formatMonth } from "../utils/formatters";

const navigation = [
  { label: "Dashboard", icon: FiGrid },
  { label: "Collection Report", icon: FiFileText },
  { label: "Bank Summary", icon: FiBarChart2 },
  { label: "Transactions", icon: FiRepeat },
  { label: "Reports", icon: FiFileText },
  { label: "Charts", icon: FiTrendingUp },
  { label: "Export Data", icon: FiDownload },
  { label: "Settings", icon: FiSettings },
];

export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const period = formatMonth(new Date().toISOString().slice(0, 7));

  function selectItem(label) {
    setActiveItem(label);
    onClose();
  }

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar-top">
        <div className="brand" aria-label="Salary 4 Sure">
          <span className="brand-mark"><span>S</span><i>4</i><b>S</b></span>
          <span className="brand-copy"><strong>SALARY <em>4</em> SURE</strong><small>Smart Collection. Secure Future.</small></span>
        </div>
        <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}><FiX /></button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            className={`nav-item ${activeItem === label ? "nav-item--active" : ""}`}
            key={label}
            type="button"
            onClick={() => selectItem(label)}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="report-period">
          <span className="period-icon"><FiFileText /></span>
          <div><small>Report period</small><strong>{period}</strong><b>MTD</b></div>
        </div>
        <div className="sidebar-illustration" aria-hidden="true"><span>₹</span><i /><i /><i /></div>
      </div>
    </aside>
  );
}
