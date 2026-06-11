import axios from "axios";
import Editor from "@monaco-editor/react";

import LiveAgentStream from "../components/LiveAgentStream";
import CodeDiffViewer from "../components/CodeDiffViewer";
import ChatAssistant from "../components/ChatAssistant";

import {
  BarChart3,
  Brain,
  Box,
  Clock3,
  Code2,
  Search,
  Cog,
  PlayCircle,
  ShieldCheck,
  BadgeCheck,
  Terminal,
  Star,
  Zap,
  Upload,
  AlertTriangle,
  Download,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard({
  code,
  setCode,
  language,
  setLanguage,
  runAnalysis,
  loading,
  result,
  metrics,
}) {
  const editorLanguage =
    language === "cpp"
      ? "cpp"
      : language === "javascript"
      ? "javascript"
      : language;

  const chartData = result?.success
    ? [
        {
          name: "Original Code",
          "Execution Time (s)": Number(result.before.time.toFixed(4)),
          "Memory Usage (MB)": Number(
            (result.before.memory / 1000000).toFixed(4)
          ),
        },
        {
          name: "Optimized Code",
          "Execution Time (s)": Number(result.after.time.toFixed(4)),
          "Memory Usage (MB)": Number(
            (result.after.memory / 1000000).toFixed(4)
          ),
        },
      ]
    : [];

  const uploadFile = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCode(response.data.code);

      if (response.data.language) {
        setLanguage(response.data.language);
      }
    } catch (error) {
      alert("File upload failed. Make sure FastAPI backend is running.");
    }
  };

  const downloadReport = async () => {
    if (!result) {
      alert("Run analysis first before downloading report.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/export-report",
        {
          result: result,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = "perfmind_optimization_report.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("PDF report download failed.");
    }
  };

  return (
    <>
      <section className="stats-row">
        <div className="stat-card violet-card">
          <BarChart3 size={48} />
          <div>
            <h4>Optimization Gain</h4>
            <h2>{metrics.gain}%</h2>
            <p>Performance Improvement</p>
          </div>
        </div>

        <div className="stat-card gold-card">
          <Clock3 size={48} />
          <div>
            <h4>Execution Saved</h4>
            <h2>{metrics.savedTime}s</h2>
            <p>Faster Execution</p>
          </div>
        </div>

        <div className="stat-card violet-card">
          <Box size={48} />
          <div>
            <h4>Memory Saved</h4>
            <h2>{metrics.memorySaved}%</h2>
            <p>Memory Optimization</p>
          </div>
        </div>

        <div className="stat-card gold-card">
          <Star size={48} />
          <div>
            <h4>AI Score</h4>
            <h2>{metrics.score}/100</h2>
            <p>Optimization Quality</p>
          </div>
        </div>
      </section>

      <section className="code-panel">
        <div className="panel-title">
          <div className="title-left">
            <Code2 size={20} />
            <h3>Enter Your Code</h3>
          </div>

          <div className="panel-actions">
            <button className="run-btn" onClick={runAnalysis} disabled={loading}>
              <Zap size={18} />
              {loading ? "Running..." : "Run Analysis"}
            </button>

            <button
              className="report-btn"
              onClick={downloadReport}
              disabled={!result}
            >
              <Download size={18} />
              Download Report
            </button>
          </div>
        </div>

        <div className="language-selector">
          <label>Programming Language</label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <label className="upload-box">
          <Upload size={18} />
          <span>Upload Code File (.py / .js / .java / .c / .cpp / .txt)</span>
          <input
            type="file"
            accept=".py,.js,.java,.c,.cpp,.cc,.cxx,.txt"
            onChange={uploadFile}
          />
        </label>

        <div className="monaco-wrapper">
          <Editor
            height="360px"
            language={editorLanguage}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 16,
              fontFamily: "JetBrains Mono, Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              padding: {
                top: 20,
                bottom: 20,
              },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        </div>
      </section>

      {result && result.success === false && (
        <div className="security-error-box">
          <div>
            <AlertTriangle size={26} />
          </div>

          <div>
            <h3>Execution Blocked or Failed</h3>
            <p>{result.error}</p>
          </div>
        </div>
      )}

      <section className="middle-grid">
        <div className="dash-panel analysis-box">
          <div className="section-title">
            <Brain size={20} />
            <h3>AI Analysis</h3>
          </div>

          <pre>
            {result?.success
              ? result.analysis
              : result?.success === false
              ? "Code execution failed or was blocked before AI analysis."
              : "Run analysis to display detected performance issues, complexity problems, memory concerns, and optimization suggestions."}
          </pre>
        </div>

        <div className="dash-panel optimized-box">
          <div className="section-title">
            <Code2 size={20} />
            <h3>Optimized Code</h3>
          </div>

          <pre>
            {result?.success
              ? result.optimized_code
              : result?.success === false
              ? "Optimization skipped because execution failed or was blocked."
              : "Optimized code will appear here after the pipeline runs."}
          </pre>

          {result?.success && result.comparison?.accepted && (
            <div className="success-strip">
              <Zap size={17} />
              Optimized Successfully
            </div>
          )}
        </div>

        <div className="dash-panel chart-box">
          <div className="section-title">
            <BarChart3 size={20} />
            <h3>Runtime Metrics</h3>
          </div>

          {result?.success ? (
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1b2440" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: "#050816",
                    border: "1px solid #8b5cf6",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Execution Time (s)"
                  stroke="#9f67ff"
                  strokeWidth={4}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Memory Usage (MB)"
                  stroke="#facc15"
                  strokeWidth={4}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              Runtime chart will appear after successful analysis.
            </div>
          )}
        </div>
      </section>

      <LiveAgentStream logs={result?.logs || []} />

      <CodeDiffViewer
        originalCode={code}
        optimizedCode={result?.optimized_code || ""}
      />

      <ChatAssistant
        code={code}
        language={language}
        result={result}
      />

      <section className="bottom-grid">
        <div className="dash-panel agent-pipeline">
          <div className="section-title">
            <Brain size={20} />
            <h3>AI Agent Pipeline</h3>
          </div>

          <div className="agent-flow">
            <div className="agent-node violet-node">
              <Search size={34} />
              <h4>Analyzer Agent</h4>
              <p>Code Analysis</p>
              <p>Complexity Detection</p>
              <BadgeCheck className="check" size={20} />
            </div>

            <div className="arrow">→</div>

            <div className="agent-node gold-node">
              <Cog size={34} />
              <h4>Optimizer Agent</h4>
              <p>Code Optimization</p>
              <p>Pattern Recognition</p>
              <BadgeCheck className="check" size={20} />
            </div>

            <div className="arrow">→</div>

            <div className="agent-node violet-node">
              <PlayCircle size={34} />
              <h4>Executor Agent</h4>
              <p>Secure Execution</p>
              <p>Runtime Monitoring</p>
              <BadgeCheck className="check" size={20} />
            </div>

            <div className="arrow">→</div>

            <div className="agent-node gold-node">
              <ShieldCheck size={34} />
              <h4>Validator Agent</h4>
              <p>Performance Validation</p>
              <p>Results Comparison</p>
              <BadgeCheck className="check" size={20} />
            </div>
          </div>
        </div>

        <div className="dash-panel console-panel">
          <div className="section-title">
            <Terminal size={20} />
            <h3>Execution Console</h3>
          </div>

          <div className="console">
            {result?.logs ? (
              result.logs.map((log, index) => <p key={index}>&gt; {log}</p>)
            ) : (
              <>
                <p>&gt; Waiting for analysis request...</p>
                <p>&gt; FastAPI backend ready</p>
                <p>&gt; Ollama model standby</p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}