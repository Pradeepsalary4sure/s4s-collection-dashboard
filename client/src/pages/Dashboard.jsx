import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import BankChart from "../components/BankChart";
import CollectionTable from "../components/CollectionTable";
import DashboardCards from "../components/DashboardCards";
import DonutChart from "../components/DonutChart";
import ErrorScreen from "../components/ErrorScreen";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import { getDashboard } from "../services/api";
import { formatDateTime, toInputDate } from "../utils/formatters";

const initialDate = toInputDate(new Date());

export default function Dashboard() {
  const [filters, setFilters] = useState({ date: initialDate, month: initialDate.slice(0, 7) });
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      setIsLoading(true);
      setError("");
      try {
        const nextReport = await getDashboard(filters, controller.signal);
        setReport(nextReport);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(requestError.response?.data?.message || "Collection data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => controller.abort();
  }, [filters]);

  function changeDate(date) {
    setFilters((current) => ({ ...current, date, month: date.slice(0, 7) }));
  }

  function changeMonth(month) {
    setFilters((current) => ({
      date: current.date.startsWith(month) ? current.date : `${month}-01`,
      month,
    }));
  }

  const activeFilters = report?.filters || filters;

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main className="dashboard-main">
        <Navbar
          filters={activeFilters}
          onDateChange={changeDate}
          onMonthChange={changeMonth}
          onMenuClick={() => setIsMenuOpen(true)}
        />

        {isLoading && !report ? <Loader /> : null}
        {error && !report ? <ErrorScreen message={error} onRetry={() => setFilters({ ...filters })} /> : null}

        {report ? (
          <div className="dashboard-content">
            {report.notice ? <div className="inline-alert">{report.notice}</div> : null}
            {error ? <div className="inline-alert">Showing the last loaded report. {error}</div> : null}
            {isLoading ? <div className="refreshing-indicator"><FiRefreshCw /> Refreshing report</div> : null}
            <DashboardCards summary={report.summary} />
            <CollectionTable rows={report.table} date={report.filters.date} />
            <section className="analytics-grid" aria-label="Collection analytics">
              <BankChart data={report.charts.bankWiseToday} />
              <DonutChart data={report.charts.mtdBreakup} />
              <SummaryCard summary={report.summary} />
            </section>
            <footer className="dashboard-footer">
              <span>© {new Date().getFullYear()} Salary 4 Sure. All rights reserved.</span>
              <span>Last updated: {formatDateTime(report.updatedAt)}</span>
            </footer>
          </div>
        ) : null}
      </main>
    </div>
  );
}
