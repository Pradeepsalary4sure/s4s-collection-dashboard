import { FiRefreshCw } from "react-icons/fi";

export default function ErrorScreen({ message, onRetry }) {
  return (
    <section className="error-screen" role="alert">
      <span>!</span>
      <h2>Report unavailable</h2>
      <p>{message}</p>
      <button type="button" onClick={onRetry}><FiRefreshCw />Try again</button>
    </section>
  );
}
