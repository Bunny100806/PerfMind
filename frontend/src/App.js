import "./App.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Optimization from "./pages/Optimization";
import Metrics from "./pages/Metrics";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";
import History from "./pages/History";

import {
  Zap,
  Cpu,
  Brain,
  ShieldCheck,
  Settings as SettingsIcon,
  History as HistoryIcon,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-orb"></div>

      <div className="splash-content">
        <div className="splash-logo">⚡</div>
        <h1>PerfMind</h1>
        <p>Execution-Aware Multi-Language Code Optimization</p>

        <div className="splash-loader">
          <div></div>
        </div>

        <span>Initializing Multi-Agent Intelligence...</span>
      </div>
    </div>
  );
}

function Layout() {
  const location = useLocation();

  const [language, setLanguage] = useState("python");

  const [code, setCode] = useState(`result = []

for i in range(2000):
    for j in range(2000):
        result.append(i * j)

print(len(result))`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/full-pipeline`, {
        code,
        language,
      });

      setResult(response.data);
    } catch (err) {
      alert("Backend connection failed");
    }

    setLoading(false);
  };

  const metrics = useMemo(() => {
    if (!result?.before || !result?.after) {
      return {
        gain: "--",
        savedTime: "--",
        memorySaved: "--",
        score: "--",
      };
    }

    const gain = (
      ((result.before.time - result.after.time) / result.before.time) *
      100
    ).toFixed(1);

    const savedTime = (result.before.time - result.after.time).toFixed(3);

    const memorySaved = (
      ((result.before.memory - result.after.memory) / result.before.memory) *
      100
    ).toFixed(1);

    return {
      gain,
      savedTime,
      memorySaved,
      score: "92",
    };
  }, [result]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <Zap className="brand-icon" size={36} />

            <div>
              <h1>PerfMind</h1>
              <p>Multi-Language AI Optimizer</p>
            </div>
          </div>

          <nav className="side-nav">
            <Link
              to="/"
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              Dashboard
            </Link>

            <Link
              to="/analysis"
              className={`nav-item ${
                location.pathname === "/analysis" ? "active" : ""
              }`}
            >
              AI Analysis
            </Link>

            <Link
              to="/optimization"
              className={`nav-item ${
                location.pathname === "/optimization" ? "active" : ""
              }`}
            >
              Optimization Engine
            </Link>

            <Link
              to="/metrics"
              className={`nav-item ${
                location.pathname === "/metrics" ? "active" : ""
              }`}
            >
              Runtime Metrics
            </Link>

            <Link
              to="/agents"
              className={`nav-item ${
                location.pathname === "/agents" ? "active" : ""
              }`}
            >
              Agent Monitor
            </Link>

            <Link
              to="/history"
              className={`nav-item ${
                location.pathname === "/history" ? "active" : ""
              }`}
            >
              <HistoryIcon size={18} />
              History
            </Link>

            <Link
              to="/settings"
              className={`nav-item ${
                location.pathname === "/settings" ? "active" : ""
              }`}
            >
              <SettingsIcon size={18} />
              Settings
            </Link>
          </nav>
        </div>

        <div className="version-card">
          <Brain size={42} />
          <h3>PerfMind v2.0</h3>
          <p>Python + JS + Java + C/C++</p>
          <p>Powered by AI Agents</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="top-header">
          <div>
            <h1>Execution-Aware Multi-Language Code Optimization</h1>
            <p>Analyze. Optimize. Execute. Validate.</p>
          </div>

          <div className="system-badges">
            <div className="sys-badge violet">
              <Cpu size={18} />
              FastAPI
            </div>

            <div className="sys-badge gold">🦙 Ollama</div>

            <div className="sys-badge green">
              <ShieldCheck size={18} />
              Llama3
            </div>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                runAnalysis={runAnalysis}
                loading={loading}
                result={result}
                metrics={metrics}
              />
            }
          />

          <Route path="/analysis" element={<Analysis result={result} />} />

          <Route
            path="/optimization"
            element={<Optimization result={result} />}
          />

          <Route path="/metrics" element={<Metrics result={result} />} />

          <Route path="/agents" element={<Agents />} />

          <Route path="/history" element={<History />} />

          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {showSplash ? <SplashScreen /> : <Layout />}
    </BrowserRouter>
  );
}

export default App;