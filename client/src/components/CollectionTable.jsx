import BankLogo from "./BankLogo";
import { formatCurrency, formatReportDate } from "../utils/formatters";

function bankClass(bank) {
  return `bank-badge--${bank.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

export default function CollectionTable({ rows, date }) {
  return (
    <section className="collection-table-panel">
      <div className="collection-table-title">Collection report of {formatReportDate(date)}</div>
      <div className="table-scroll">
        <table className="collection-table">
          <thead><tr><th>Bank name</th><th>S4S</th><th>S4S Aman</th><th>Rupee 1</th><th>Total</th><th>Total MTD</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr className={`table-row--${row.kind}`} key={`${row.kind}-${row.bank}`}>
                <td>
                  {row.kind === "bank" ? <span className={`bank-badge ${bankClass(row.bank)}`}><BankLogo bank={row.bank} />{row.bank}</span> : <strong>{row.bank}</strong>}
                </td>
                <td className="number-cell number-cell--green">{formatCurrency(row.s4s)}</td>
                <td className="number-cell number-cell--blue">{formatCurrency(row.s4sAman)}</td>
                <td className="number-cell number-cell--purple">{formatCurrency(row.rupeeOne)}</td>
                <td className="number-cell number-cell--orange">{formatCurrency(row.total)}</td>
                <td className="number-cell number-cell--mtd">{formatCurrency(row.totalMtd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
