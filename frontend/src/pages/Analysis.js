import {
  Brain,
  AlertTriangle,
  Gauge,
  Database,
  Sparkles,
} from "lucide-react";

export default function Analysis({ result }) {
  return (
    <div className="analysis-page">

      <div className="analysis-header-card">
        <div className="analysis-header-left">
          <Brain size={42} />
          <div>
            <h2>AI Analysis Engine</h2>
            <p>
              Execution-aware reasoning powered by Llama3 + FastAPI
            </p>
          </div>
        </div>

        <div className="analysis-status">
          Completed
        </div>
      </div>

      {result?.success ? (
        <>

          <div className="analysis-grid">

            <div className="analysis-box purple-box">
              <div className="analysis-icon">
                <AlertTriangle size={28} />
              </div>

              <h3>Performance Issues</h3>

              <ul>
                <li>Nested loop execution overhead</li>
                <li>Repeated append operations</li>
                <li>Large memory allocation growth</li>
              </ul>
            </div>

            <div className="analysis-box gold-box">
              <div className="analysis-icon">
                <Gauge size={28} />
              </div>

              <h3>Complexity Analysis</h3>

              <ul>
                <li>Time Complexity: O(n²)</li>
                <li>Space Complexity: O(n)</li>
                <li>Execution scaling issue detected</li>
              </ul>
            </div>

            <div className="analysis-box green-box">
              <div className="analysis-icon">
                <Database size={28} />
              </div>

              <h3>Memory Insights</h3>

              <ul>
                <li>Memory-heavy list operations</li>
                <li>Dynamic resizing overhead</li>
                <li>Optimization possible via comprehension</li>
              </ul>
            </div>

          </div>

          <div className="analysis-full-report">

            <div className="report-title">
              <Sparkles size={26} />
              <span>Detailed AI Reasoning</span>
            </div>

            <pre>{result.analysis}</pre>

          </div>

        </>
      ) : (
        <div className="analysis-empty">
          Run analysis from Dashboard to view AI insights.
        </div>
      )}
    </div>
  );
}