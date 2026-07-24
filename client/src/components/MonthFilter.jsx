import { FiCalendar } from "react-icons/fi";

export default function MonthFilter({ value, onChange }) {
  return (
    <label className="filter-control filter-control--month">
      <FiCalendar aria-hidden="true" />
      <input aria-label="Report month" type="month" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
