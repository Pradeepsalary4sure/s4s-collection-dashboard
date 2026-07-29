// import { motion } from "framer-motion";
// import { Sparkles } from "lucide-react";
// import BankLogo from "../BankLogo";
// import { formatCurrency, formatReportDate } from "../../utils/formatters";

// function bankClass(bank) {
//   return `bank-badge--${bank.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
// }

// const rowVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: (i) => ({
//     opacity: 1,
//     x: 0,
//     transition: { delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
//   }),
// };

// export default function CollectionTable({ rows, date }) {
//   const isNamanTotal = (bank) => bank?.toLowerCase().includes("naman");
//   const isGrandTotal = (bank) => bank?.toLowerCase().includes("grand");

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
//       className="collection-table relative overflow-hidden rounded-[9px] bg-white border border-[#e8edf0] shadow-[0_5px_18px_rgba(19,35,58,0.08)]"
//     >
//       {/* Header */}
//       <div className="relative overflow-hidden px-5 py-3 bg-gradient-to-r from-[#078f45] via-[#3bb828] to-[#55c334]">
//         <h3 className="relative z-10 text-base font-black text-white uppercase tracking-wider text-center">
//           SALARY 4 SURE Collection Report &middot; {formatReportDate(date)}
//         </h3>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[810px] border-collapse table-fixed">
//           <thead>
//             <tr>
//               <th className="py-3 px-4 text-left text-xs font-black text-[#172033] uppercase tracking-wider bg-[#fbfcfc] border-b border-[#e4e8ed] w-[20%]">
//                 Bank Name
//               </th>
//               {["S4S", "S4S Aman", "Rupee 1", "Total", "Total MTD"].map((header, i) => (
//                 <th
//                   key={header}
//                   className={`py-3 px-4 text-right text-xs font-black text-[#172033] uppercase tracking-wider bg-[#fbfcfc] border-b border-[#e4e8ed] border-l border-[#edf0f2] w-[16%]`}
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, index) => {
//               const isNaman = isNamanTotal(row.bank);
//               const isGrand = isGrandTotal(row.bank);
//               const isBank = row.kind === "bank";

//               return (
//                 <motion.tr
//                   key={`${row.kind}-${row.bank}`}
//                   custom={index}
//                   variants={rowVariants}
//                   initial="hidden"
//                   animate="visible"
//                   whileHover={{
//                     backgroundColor: isNaman ? "#e2e7ff" : "#f7fafc",
//                   }}
//                   className={`border-b border-[#e8ecef] transition-colors relative ${
//                     isNaman
//                       ? "bg-gradient-to-r from-[#d4daff] via-[#eeddff] to-[#fad4e8] border-y-2 border-purple-300/80 naman-row"
//                       : ""
//                   } ${isGrand ? "bg-gradient-to-r from-[#078f45] via-[#3bb828] to-[#55c334] grand-total-row" : ""} ${row.kind === "subtotal" && !isNaman ? "bg-gray-50 subtotal-row" : ""}`}
//                 >
//                   {/* Bank Name column */}
//                   <td className="py-[7px] px-4 relative z-10">
//                     {isBank ? (
//                       <span className={`bank-badge ${bankClass(row.bank)}`}>
//                         <BankLogo bank={row.bank} />
//                         {row.bank}
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1.5">
//                         {isNaman && (
//                           <motion.span
//                             animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
//                             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//                           >
//                             <Sparkles className="w-3.5 h-3.5 text-purple-500" />
//                           </motion.span>
//                         )}
//                         <motion.span
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           className={`text-sm font-black ${
//                             isNaman
//                               ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
//                               : ""
//                           } ${isGrand ? "text-black text-base" : ""} ${!isNaman && !isGrand ? "text-[#10182d]" : ""}`}
//                         >
//                           {row.bank}
//                         </motion.span>
//                       </span>
//                     )}
//                   </td>

//                   {/* Data columns */}
//                   {["s4s", "s4sAman", "rupeeOne", "total", "totalMtd"].map((col) => {
//                     const colorMap = {
//                       s4s: "text-[#108e48]",
//                       s4sAman: "text-[#1769d7]",
//                       rupeeOne: "text-[#8a38d0]",
//                       total: "text-[#ed6b1a]",
//                       totalMtd: "text-[#145fcb]",
//                     };
//                     return (
//                       <td
//                         key={col}
//                         className={`py-[7px] px-4 text-right text-xs tabular-nums border-l border-[#edf0f2] relative z-10 ${
//                           isGrand ? "!text-black !font-black text-base" : colorMap[col]
//                         }`}
//                       >
//                         <motion.span
//                           key={row[col]}
//                           initial={isNaman ? { opacity: 0, y: 3 } : false}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className={isGrand ? "font-black" : ""}
//                         >
//                           {formatCurrency(row[col])}
//                         </motion.span>
//                       </td>
//                     );
//                   })}
//                 </motion.tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </motion.section>
//   );
// }








import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
      className="collection-table relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-200 shadow-[0_20px_60px_rgba(16,185,129,0.20)]"
    >
      {/* Header */}
      <div className="relative overflow-hidden px-5 py-4 bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 shadow-[0_10px_30px_rgba(34,197,94,0.45)]">
        <h3 className="relative z-10 text-base font-black text-white uppercase tracking-wider text-center">
          SALARY 4 SURE Collection Report &middot; {formatReportDate(date)}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[810px] border-collapse table-fixed">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left text-sm font-extrabold uppercase tracking-wider
                  bg-gradient-to-r from-sky-100 via-cyan-100 to-blue-100
                  text-slate-800 border-b border-sky-200 w-[20%]">
                  Bank Name
              </th>
              {["S4S", "S4S Aman", "Rupee 1", "Total", "Total MTD"].map((header, i) => (
                <th
                    key={header}
                    className="py-4 px-4 text-right text-sm font-extrabold uppercase tracking-wider
                    bg-gradient-to-r from-sky-100 via-cyan-100 to-blue-100
                    text-slate-800 border-b border-sky-200 border-l border-sky-100 w-[16%]"
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
                  // whileHover={{
                  //   backgroundColor: isNaman ? "#f16710" : "#10f1c8",
                  // }}
                  whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.25 }
                    }}

                  className={`border-b border-emerald-100 transition-all duration-300 hover:bg-emerald-50/60 relative ${
                    isNaman
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white border-y-[3px] border-purple-400 shadow-[0_0_30px_rgba(139,92,246,.45)] naman-row"
                      : ""
                  } ${isGrand ? "bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 border-y-[4px] border-yellow-500 shadow-[0_0_35px_rgba(255,193,7,.5)] grand-total-row" : ""} ${row.kind === "subtotal" && !isNaman ? "bg-gray-50 subtotal-row" : ""}`}
                >
                  {/* Bank Name column */}
                  <td className="py-[7px] px-4 relative z-10">
                    {isBank ? (
                      <span
                        className={`bank-badge ${bankClass(row.bank)}
                        rounded-xl px-4 py-2
                        shadow-lg
                        hover:shadow-emerald-400/40
                        hover:scale-105
                        transition-all duration-300`}
                      >
                        <BankLogo bank={row.bank} />
                        {row.bank}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        {isNaman && (
                          <motion.span
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          </motion.span>
                        )}
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`text-sm font-black ${
                            isNaman
                              ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
                              : ""
                          } ${isGrand ? "text-black text-[22px] font-extrabold tracking-wide drop-shadow-md" : ""} ${!isNaman && !isGrand ? "text-[#10182d]" : ""}`}
                        >
                          {row.bank}
                        </motion.span>
                      </span>
                    )}
                  </td>

                  {/* Data columns */}
                  {["s4s", "s4sAman", "rupeeOne", "total", "totalMtd"].map((col) => {
                    const colorMap = {
                      s4s: "text-[#108e48]",
                      s4sAman: "text-[#1769d7]",
                      rupeeOne: "text-[#8a38d0]",
                      total: "text-[#ed6b1a]",
                      totalMtd: "text-[#145fcb]",
                      backgroundColor: "bg-[#FFD700]",
                    };
                    return (
                      <td
                        key={col}
                        className={`py-3 px-10 text-right border-l border-emerald-100 relative z-10 transition-all duration-300
                        ${
                          isGrand
                            ? "text-[22px] font-extrabold text-black drop-shadow-md"
                            : `text-sm font-bold ${colorMap[col]}`
                        }`}
                      >
                        <motion.span
                          key={row[col]}
                          initial={isNaman ? { opacity: 0, y: 3 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={isGrand ? "font-black" : ""}
                        >
                          {formatCurrency(row[col])}
                        </motion.span>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

