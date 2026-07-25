import { motion } from "framer-motion";
import BankLogo from "../BankLogo";
import { formatCurrency, formatReportDate } from "../../utils/formatters";

function bankClass(bank) {
  return `bank-badge--${bank.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function CollectionTable({ rows, date }) {
  const isNamanTotal = (bank) => bank?.toLowerCase().includes("naman");
  const isGrandTotal = (bank) => bank?.toLowerCase().includes("grand");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/5"
    >
      {/* Header */}
      <div className="relative overflow-hidden px-5 py-4 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-transparent border-b border-white/5">
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
        <h3 className="relative z-10 text-xs font-bold text-white tracking-wider uppercase text-center">
          Collection Report &middot; {formatReportDate(date)}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="sticky top-0 z-10 py-3.5 px-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-900/80 backdrop-blur-xl border-b border-white/5 w-[19%]">
                Bank Name
              </th>
              {["S4S", "S4S Aman", "Rupee 1", "Total", "Total MTD"].map((header) => (
                <th
                  key={header}
                  className="sticky top-0 z-10 py-3.5 px-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-900/80 backdrop-blur-xl border-b border-white/5 border-l border-white/5"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isNaman = isNamanTotal(row.bank);
              const isGrand = isGrandTotal(row.bank);
              const isBank = row.kind === "bank";

              return (
                <motion.tr
                  key={`${row.kind}-${row.bank}`}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className={`
                    border-b border-white/5 transition-colors
                    ${isNaman ? "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent" : ""}
                    ${isGrand ? "bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent" : ""}
                    ${row.kind === "subtotal" ? "bg-white/[0.02]" : ""}
                  `}
                >
                  <td className="py-3 px-4">
                    {isBank ? (
                      <span className={`bank-badge ${bankClass(row.bank)}`}>
                        <BankLogo bank={row.bank} />
                        {row.bank}
                      </span>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`
                          text-sm font-bold
                          ${isNaman ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" : ""}
                          ${isGrand ? "bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent" : ""}
                          ${!isNaman && !isGrand ? "text-white" : ""}
                        `}
                      >
                        {row.bank}
                      </motion.span>
                    )}
                  </td>
                  {["s4s", "s4sAman", "rupeeOne", "total", "totalMtd"].map((col) => {
                    const colorMap = {
                      s4s: "text-emerald-400",
                      s4sAman: "text-blue-400",
                      rupeeOne: "text-purple-400",
                      total: "text-amber-400",
                      totalMtd: "text-cyan-400",
                    };
                    return (
                      <td
                        key={col}
                        className={`py-3 px-4 text-right text-xs font-bold tabular-nums border-l border-white/5 ${colorMap[col]} ${isNaman ? "font-black" : ""} ${isGrand ? "font-black" : ""}`}
                      >
                        {formatCurrency(row[col])}
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Glass reflection */}
      <span className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
    </motion.section>
  );
}
