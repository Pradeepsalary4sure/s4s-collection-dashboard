import { FiCalendar } from "react-icons/fi";

export default function DateFilter({ value, onChange }) {
  return (
    <label className="filter-control">
      <FiCalendar aria-hidden="true" />
      <input aria-label="Report date" type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
