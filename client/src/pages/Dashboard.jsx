import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import KpiCard from "../components/dashboard/KpiCard";
import CollectionTable from "../components/dashboard/CollectionTable";
import SummaryCard from "../components/dashboard/SummaryCard";
import Loader from "../components/dashboard/Loader";
import ErrorScreen from "../components/dashboard/ErrorScreen";
import BankChart from "../components/charts/BankChart";
import DonutChart from "../components/charts/DonutChart";
import MTDLineChart from "../components/charts/LineChart";
import BankAreaChart from "../components/charts/AreaChart";
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
          setError(
            requestError.response?.data?.message ||
              "Collection data could not be loaded."
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => controller.abort();
  }, [filters]);

  function changeDate(date) {
    setFilters((current) => ({
      ...current,
      date,
      month: date.slice(0, 7),
    }));
  }

  function changeMonth(month) {
    setFilters((current) => ({
      date: current.date.startsWith(month) ? current.date : `${month}-01`,
      month,
    }));
  }

  const activeFilters = report?.filters || filters;

  return (
    <div className="flex min-h-screen relative z-10">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          filters={activeFilters}
          onDateChange={changeDate}
          onMonthChange={changeMonth}
          onMenuClick={() => setIsMenuOpen(true)}
        />

        <div className="flex-1 px-4 md:px-6 pb-6">
          <AnimatePresence mode="wait">
            {isLoading && !report ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader />
              </motion.div>
            ) : null}

            {error && !report ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorScreen
                  message={error}
                  onRetry={() => setFilters({ ...filters })}
                />
              </motion.div>
            ) : null}

            {report ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="dashboard-section space-y-5 pt-5"
              >
                {/* Notice & Error alerts */}
                {report.notice ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-notice px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700"
                  >
                    {report.notice}
                  </motion.div>
                ) : null}

                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-error px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2"
                  >
                    <span>Showing the last loaded report.</span>
                    <span className="text-rose-500">{error}</span>
                  </motion.div>
                ) : null}

                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-refresh-badge fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-lg text-[10px] font-bold text-gray-600"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                    <span>Refreshing report</span>
                  </motion.div>
                ) : null}

                {/* KPI Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard
                    dataKey="todayCollection"
                    value={report.summary.todayCollection}
                    isCurrency={true}
                    delay={0}
                  />
                  <KpiCard
                    dataKey="mtdCollection"
                    value={report.summary.mtdCollection}
                    isCurrency={true}
                    delay={0.05}
                  />
                  <KpiCard
                    dataKey="cashfreeCollection"
                    value={report.summary.cashfreeCollection}
                    isCurrency={true}
                    delay={0.1}
                  />
                  <KpiCard
                    dataKey="totalBanks"
                    value={report.summary.totalBanks}
                    isCurrency={false}
                    delay={0.15}
                  />
                </section>

                {/* Collection Table */}
                <CollectionTable
                  rows={report.table}
                  date={report.filters.date}
                />

                {/* Analytics Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                  <BankChart data={report.charts.bankWiseToday} />
                  <DonutChart data={report.charts.mtdBreakup} />
                  <MTDLineChart />
                  <BankAreaChart />
                </section>

                {/* Summary + Footer */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-1">
                    <SummaryCard summary={report.summary} date={report.filters.date} />
                  </div>
                  <div className="lg:col-span-3 flex items-end">
                    <motion.footer
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="w-full flex flex-col sm:flex-row justify-between gap-3 px-4 py-3 rounded-[10px] bg-white border border-[#e9edf0] text-[10px] font-semibold text-[#7c8492]"
                    >
                      <span>
                        &copy; {new Date().getFullYear()} Salary 4 Sure. All
                        rights reserved.
                      </span>
                      <span>
                        created by pradeep : {}
                      </span>
                    </motion.footer>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
