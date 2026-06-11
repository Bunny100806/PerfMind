import {
  Server,
  Cpu,
  ShieldCheck,
  Database,
  CheckCircle,
  Activity,
  Globe,
  Zap,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h2>System Settings</h2>
          <p>PerfMind AI Optimization Environment</p>
        </div>

        <div className="settings-status">
          <CheckCircle size={18} />
          System Online
        </div>
      </div>

      <div className="settings-grid">

        <div className="settings-card purple-setting">
          <div className="settings-icon">
            <Server size={34} />
          </div>

          <h3>Backend API</h3>

          <div className="setting-info">
            <span>Framework</span>
            <strong>FastAPI</strong>
          </div>

          <div className="setting-info">
            <span>Port</span>
            <strong>8000</strong>
          </div>

          <div className="setting-info">
            <span>Status</span>
            <strong>Connected</strong>
          </div>
        </div>

        <div className="settings-card gold-setting">
          <div className="settings-icon">
            <Cpu size={34} />
          </div>

          <h3>AI Model</h3>

          <div className="setting-info">
            <span>Provider</span>
            <strong>Ollama</strong>
          </div>

          <div className="setting-info">
            <span>Model</span>
            <strong>Llama3</strong>
          </div>

          <div className="setting-info">
            <span>Status</span>
            <strong>Running</strong>
          </div>
        </div>

        <div className="settings-card green-setting">
          <div className="settings-icon">
            <ShieldCheck size={34} />
          </div>

          <h3>Security</h3>

          <div className="setting-info">
            <span>Execution</span>
            <strong>Sandboxed</strong>
          </div>

          <div className="setting-info">
            <span>Validation</span>
            <strong>Enabled</strong>
          </div>

          <div className="setting-info">
            <span>Protection</span>
            <strong>Active</strong>
          </div>
        </div>

        <div className="settings-card blue-setting">
          <div className="settings-icon">
            <Database size={34} />
          </div>

          <h3>Architecture</h3>

          <div className="setting-info">
            <span>Agents</span>
            <strong>4 Active</strong>
          </div>

          <div className="setting-info">
            <span>Pipeline</span>
            <strong>Multi-Agent</strong>
          </div>

          <div className="setting-info">
            <span>Monitoring</span>
            <strong>Enabled</strong>
          </div>
        </div>

      </div>

      <div className="system-monitor">

        <div className="monitor-title">
          <Activity size={24} />
          <h3>Live System Monitor</h3>
        </div>

        <div className="monitor-grid">

          <div className="monitor-box">
            <Zap size={28} />
            <h4>Optimization Engine</h4>
            <p>Operational</p>
          </div>

          <div className="monitor-box">
            <Globe size={28} />
            <h4>Frontend Client</h4>
            <p>React Connected</p>
          </div>

          <div className="monitor-box">
            <Server size={28} />
            <h4>Backend Server</h4>
            <p>Healthy</p>
          </div>

          <div className="monitor-box">
            <Cpu size={28} />
            <h4>Inference Runtime</h4>
            <p>Llama3 Active</p>
          </div>

        </div>
      </div>

    </div>
  );
}