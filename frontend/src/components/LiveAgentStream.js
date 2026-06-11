import { Brain, Cog, PlayCircle, ShieldCheck, CheckCircle } from "lucide-react";

export default function LiveAgentStream({ logs }) {
  const steps = [
    {
      name: "Analyzer Agent",
      icon: <Brain size={22} />,
      keyword: "Analyzer",
    },
    {
      name: "Optimizer Agent",
      icon: <Cog size={22} />,
      keyword: "Optimizer",
    },
    {
      name: "Executor Agent",
      icon: <PlayCircle size={22} />,
      keyword: "Executor",
    },
    {
      name: "Validator Agent",
      icon: <ShieldCheck size={22} />,
      keyword: "Validator",
    },
  ];

  return (
    <div className="live-agent-stream">
      <div className="section-title">
        <Brain size={20} />
        <h3>Live Agent Stream</h3>
      </div>

      <div className="live-agent-list">
        {steps.map((step) => {
          const completed = logs?.some((log) =>
            log.toLowerCase().includes(step.keyword.toLowerCase())
          );

          return (
            <div
              className={`live-agent-step ${completed ? "step-complete" : ""}`}
              key={step.name}
            >
              <div className="live-agent-icon">{step.icon}</div>

              <div>
                <h4>{step.name}</h4>
                <p>{completed ? "Completed" : "Waiting"}</p>
              </div>

              {completed && <CheckCircle className="live-check" size={20} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}