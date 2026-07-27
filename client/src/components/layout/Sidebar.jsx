// import { motion, AnimatePresence } from "framer-motion";
// import {
//   LayoutDashboard,
//   FileText,
//   BarChart3,
//   Repeat,
//   TrendingUp,
//   Download,
//   Settings,
//   X,
// } from "lucide-react";
// import { useState } from "react";
// import { formatMonth } from "../../utils/formatters";

// const navigation = [
//   { label: "Dashboard", icon: LayoutDashboard },
//   { label: "Collection Report", icon: FileText },
//   { label: "Bank Summary", icon: BarChart3 },
//   { label: "Transactions", icon: Repeat },
//   { label: "Reports", icon: FileText },
//   { label: "Charts", icon: TrendingUp },
//   { label: "Export Data", icon: Download },
//   { label: "Settings", icon: Settings },
// ];

// const itemVariants = {
//   initial: { opacity: 0, x: -20 },
//   animate: (i) => ({
//     opacity: 1,
//     x: 0,
//     transition: { delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
//   }),
// };

// export default function Sidebar({ isOpen, onClose }) {
//   const [activeItem, setActiveItem] = useState("Dashboard");
//   const period = formatMonth(new Date().toISOString().slice(0, 7));

//   function selectItem(label) {
//     setActiveItem(label);
//     onClose();
//   }

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="sidebar-mobile-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
//             onClick={onClose}
//           />
//         )}
//       </AnimatePresence>
//       <aside
//         className={`sidebar fixed lg:sticky top-0 left-0 z-50 w-[236px] h-screen flex-shrink-0 flex flex-col bg-white border-r border-[#edf0f3] shadow-lg shadow-black/[0.04] overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       >
//         <div className="sidebar-brand flex items-center justify-between min-h-[92px] px-5 py-[18px] border-b border-[#edf0f3]">
//           <div className="flex items-center gap-2.5 min-w-0">
//             <span className="relative flex items-center justify-center w-11 h-11 text-xl font-black italic text-[#0b1628] rotate-[-12deg]">
//               <span className="absolute inset-1 rounded-full border-4 border-[#0b1628] border-r-transparent" />
//               <span className="relative z-[1] -mr-0.5">S</span>
//               <i className="relative z-[1] text-[#52bc35] not-italic -mr-0.5">4</i>
//               <b className="relative z-[1]">S</b>
//             </span>
//             <div className="grid gap-0.5 whitespace-nowrap">
//               <strong className="text-[18px] font-black text-[#0a1426] tracking-tight leading-none">
//                 SALARY <em className="text-[#55bc37] not-italic">4</em> SURE
//               </strong>
//               <small className="text-[8px] font-semibold text-[#778092] tracking-wider uppercase">
//                 Smart Collection. Secure Future.
//               </small>
//             </div>
//           <button
//             className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-[#f2f6f3] hover:bg-gray-200 transition-colors text-gray-600"
//             onClick={onClose}
//             aria-label="Close sidebar"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//         <nav className="sidebar-nav flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
//           {navigation.map(({ label, icon: Icon }, i) => {
//             const isActive = activeItem === label;
//             return (
//               <motion.button
//                 key={label}
//                 custom={i}
//                 variants={itemVariants}
//                 initial="initial"
//                 animate="animate"
//                 whileHover={{ x: 2 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => selectItem(label)}
//                 className={`relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
//                   isActive
//                     ? "text-white bg-gradient-to-r from-[#079447] to-[#74d22d] shadow-lg shadow-[#29ad47]/30"
//                     : "text-[#1c2638] hover:text-[#07883b] hover:bg-[#effaf3]"
//                 }`}
//               >
//                 <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : ""}`} />
//                 <span>{label}</span>
//               </motion.button>
//             );
//           })}
//         </nav>
//         <div className="sidebar-bottom relative mt-auto px-[18px] pb-[18px] bg-gradient-to-b from-white to-[#f2faee] min-h-[200px]">
//           <div className="sidebar-period-card relative z-[1] flex items-start gap-2.5 p-3.5 bg-white border border-[#e9edf0] rounded-[10px] shadow-[0_4px_12px_rgba(22,43,58,0.04)]">
//             <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#e7f8eb] text-[#07883b] flex-shrink-0 mt-0.5">
//               <FileText className="w-3.5 h-3.5" />
//             </span>
//             <div className="grid gap-1">
//               <p className="text-[10px] font-extrabold text-[#07883b] uppercase tracking-wider">Report Period</p>
//               <strong className="text-lg font-black text-[#07883b] leading-none">{period}</strong>
//               <span className="text-xs font-bold text-[#07883b]/70">MTD</span>
//             </div>
//           <div className="absolute bottom-[21px] right-[24px] w-[124px] h-[106px] opacity-90 pointer-events-none select-none">
//             <div className="absolute bottom-0 right-1 w-[111px] h-[51px] rounded-[62%_40%_10%_14%] bg-gradient-to-br from-[#e2f7d4] to-white -rotate-[9deg]" />
//             <span className="absolute bottom-6 right-[43px] z-[1] w-[45px] h-[45px] rounded-full bg-gradient-to-br from-[#0a8041] to-[#74c836] border-[6px] border-[#f8fff6] flex items-center justify-center text-[22px] font-black text-white shadow-[0_7px_10px_rgba(22,137,60,0.2)]">
//               ₹
//             </span>
//             <i className="absolute bottom-0 left-5 w-[6px] h-[51px] rounded-md bg-[#b7c8ba] -rotate-[15deg]" />
//             <i className="absolute bottom-0 left-[50px] w-[6px] h-[60px] rounded-md bg-[#b7c8ba]" />
//             <i className="absolute bottom-0 left-[79px] w-[6px] h-[51px] rounded-md bg-[#b7c8ba] rotate-[15deg]" />
//           </div>
//       </aside>
//     </>
//   );
// }



import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Repeat,
  TrendingUp,
  Download,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { formatMonth } from "../../utils/formatters";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Collection Report", icon: FileText },
  { label: "Bank Summary", icon: BarChart3 },
  { label: "Transactions", icon: Repeat },
  { label: "Reports", icon: FileText },
  { label: "Charts", icon: TrendingUp },
  { label: "Export Data", icon: Download },
  { label: "Settings", icon: Settings },
];

const itemVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const period = formatMonth(
    new Date().toISOString().slice(0, 7)
  );

  const selectItem = (label) => {
    setActiveItem(label);

    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-[236px] h-screen flex flex-col bg-white border-r border-[#edf0f3] shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between min-h-[92px] px-5 py-4 border-b border-[#edf0f3]">
          <div className="flex items-center gap-3">
            <span className="relative flex items-center justify-center w-11 h-11 text-xl font-black italic text-[#0b1628] rotate-[-12deg]">
              <span className="absolute inset-1 rounded-full border-4 border-[#0b1628] border-r-transparent" />
              <span className="relative z-10">S</span>
              <span className="relative z-10 text-[#52bc35]">4</span>
              <span className="relative z-10">S</span>
            </span>

            <div>
              <h2 className="text-[18px] font-black text-[#0a1426] leading-none">
                SALARY <span className="text-[#55bc37]">4</span> SURE
              </h2>

              <p className="text-[8px] uppercase font-semibold text-gray-500 tracking-wider">
                Smart Collection. Secure Future.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
          {navigation.map(({ label, icon: Icon }, i) => {
            const active = activeItem === label;

            return (
              <motion.button
                key={label}
                custom={i}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectItem(label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Card */}
        <div className="relative p-5 bg-gradient-to-b from-white to-green-50 border-t">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <FileText
                  size={16}
                  className="text-green-700"
                />
              </div>

              <div>
                <p className="text-[11px] uppercase font-bold text-green-700">
                  Report Period
                </p>

                <h3 className="text-xl font-black text-green-700">
                  {period}
                </h3>

                <p className="text-xs text-green-600">
                  Month To Date
                </p>
              </div>
            </div>
          </div>

          {/* Decoration */}
          <div className="absolute bottom-4 right-4 opacity-80 pointer-events-none">
            {/* <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-lime-400 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
              ₹ */}
            {/* </div> */}
          </div>
        </div>
      </aside>
    </>
  );
}