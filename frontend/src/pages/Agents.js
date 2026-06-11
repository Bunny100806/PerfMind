import {
  Brain,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function Agents() {
  return (
    <div className="agents-wrapper">

      <div className="agent-card purple-agent">
        <div className="agent-top">
          <Brain size={34} />
          <span className="agent-status">Active</span>
        </div>

        <h2>Analyzer Agent</h2>

        <p>
          Detects performance bottlenecks, nested loops,
          memory-heavy operations, and execution inefficiencies.
        </p>

        <div className="agent-footer">
          <CheckCircle size={18} />
          <span>Running Successfully</span>
        </div>
      </div>

      <div className="agent-card gold-agent">
        <div className="agent-top">
          <Cpu size={34} />
          <span className="agent-status">Active</span>
        </div>

        <h2>Optimizer Agent</h2>

        <p>
          Generates optimized Python code using vectorization,
          algorithmic improvements, and runtime-aware logic.
        </p>

        <div className="agent-footer">
          <CheckCircle size={18} />
          <span>Optimization Enabled</span>
        </div>
      </div>

      <div className="agent-card green-agent">
        <div className="agent-top">
          <ShieldCheck size={34} />
          <span className="agent-status">Active</span>
        </div>

        <h2>Validator Agent</h2>

        <p>
          Executes both original and optimized code versions
          and validates correctness with runtime comparison.
        </p>

        <div className="agent-footer">
          <CheckCircle size={18} />
          <span>Validation Complete</span>
        </div>
      </div>

      <div className="agent-card blue-agent">
        <div className="agent-top">
          <Zap size={34} />
          <span className="agent-status">Active</span>
        </div>

        <h2>Execution Agent</h2>

        <p>
          Tracks execution speed, CPU utilization,
          memory usage, and optimization gains in real time.
        </p>

        <div className="agent-footer">
          <CheckCircle size={18} />
          <span>Metrics Captured</span>
        </div>
      </div>

    </div>
  );
}