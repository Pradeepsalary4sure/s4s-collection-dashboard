import { Calendar } from "lucide-react";

export default function DateFilter({ value, onChange }) {
  return (
    <label className="hidden md:flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-[#e2e8ed] hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
      <Calendar className="w-[17px] h-[17px] text-gray-500 flex-shrink-0" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Report date"
        className="w-[122px] bg-transparent border-none outline-none text-xs text-[#172033] placeholder-gray-400 font-bold [color-scheme:light]"
      />
    </label>
  );
}

