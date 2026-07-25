import { Calendar } from "lucide-react";

export default function DateFilter({ value, onChange }) {
  return (
    <label className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
      <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Report date"
        className="w-24 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 font-semibold [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
      />
    </label>
  );
}

