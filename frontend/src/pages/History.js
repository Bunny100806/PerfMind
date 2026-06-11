import { useEffect, useState } from "react";
import axios from "axios";
import { History as HistoryIcon, CheckCircle, XCircle } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/history");
      setHistory(response.data.history || []);
    } catch (error) {
      alert("Failed to load history");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h2>Analysis History</h2>
          <p>Saved optimization runs and runtime results</p>
        </div>

        <button onClick={loadHistory}>
          <HistoryIcon size={18} />
          Refresh
        </button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">No history available yet.</div>
        ) : (
          history.map((item) => (
            <div className="history-card" key={item.id}>
              <div className="history-top">
                <div>
                  <h3>{item.language.toUpperCase()}</h3>
                  <p>{item.created_at}</p>
                </div>

                <div className={item.success ? "history-success" : "history-failed"}>
                  {item.success ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  {item.success ? "Success" : "Failed"}
                </div>
              </div>

              <div className="history-metrics">
                <div>
                  <span>Original Time</span>
                  <strong>{item.original_time}s</strong>
                </div>

                <div>
                  <span>Optimized Time</span>
                  <strong>{item.optimized_time}s</strong>
                </div>

                <div>
                  <span>Original Memory</span>
                  <strong>{item.original_memory} bytes</strong>
                </div>

                <div>
                  <span>Optimized Memory</span>
                  <strong>{item.optimized_memory} bytes</strong>
                </div>
              </div>

              {!item.success && item.error && (
                <div className="history-error">
                  {item.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}