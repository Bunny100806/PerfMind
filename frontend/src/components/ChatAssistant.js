import { useState } from "react";
import axios from "axios";
import { Bot, Send } from "lucide-react";

export default function ChatAssistant({ code, language, result }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am PerfMind AI. Ask me about code performance, complexity, memory usage, or optimization.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        question,
        code,
        language,
        analysis: result?.analysis || "",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "AI assistant failed to respond. Make sure backend and Ollama are running.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-assistant">
      <div className="section-title">
        <Bot size={20} />
        <h3>PerfMind AI Chat Assistant</h3>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            className={`chat-message ${
              msg.role === "user" ? "user-message" : "assistant-message"
            }`}
            key={index}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant-message">
            Thinking...
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askAI();
          }}
          placeholder="Ask about performance, complexity, memory, or optimization..."
        />

        <button onClick={askAI} disabled={loading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}