import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Metrics({ result }) {
  const chartData = result?.success
    ? [
        {
          name: "Original",
          Time: result.before.time,
          Memory: result.before.memory / 1000000,
        },
        {
          name: "Optimized",
          Time: result.after.time,
          Memory: result.after.memory / 1000000,
        },
      ]
    : [];

  return (
    <div className="metrics-page">
      <div className="dash-panel metrics-card">
        <h2>Runtime Metrics</h2>

        {result?.success ? (
          <>
            <div className="metrics-summary">
              <div>
                <h3>Original Time</h3>
                <p>{result.before.time}s</p>
              </div>

              <div>
                <h3>Optimized Time</h3>
                <p>{result.after.time}s</p>
              </div>

              <div>
                <h3>Original Memory</h3>
                <p>{(result.before.memory / 1000000).toFixed(3)} MB</p>
              </div>

              <div>
                <h3>Optimized Memory</h3>
                <p>{(result.after.memory / 1000000).toFixed(3)} MB</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050816",
                    border: "1px solid #a855f7",
                    color: "white",
                  }}
                />
                <Legend />
                <Bar dataKey="Time" fill="#a855f7" />
                <Bar dataKey="Memory" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p className="empty-text">
            Run analysis from the Dashboard page to view runtime metrics.
          </p>
        )}
      </div>
    </div>
  );
}