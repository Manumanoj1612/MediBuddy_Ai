import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Content() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I’m Health AI. Ask me anything about health and I’ll help you." }
  ]);
  const [query, setQuery] = useState("");
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userQuery = query;
    setMessages(prev => [...prev, { sender: "user", text: userQuery }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ask", {
        question: userQuery,
      });

      const answer = res.data?.answer || "No answer provided.";
      const sources = Array.isArray(res.data?.sources) ? res.data.sources : [];
      const classification = res.data?.classification || "Not classified";

      const formattedMessage =
        `**Answer:** ${answer}\n\n` +
        (sources.length
          ? `**Sources:**\n${sources.map((src, i) => `${i + 1}. [${src}](${src})`).join("\n")}\n\n`
          : "") +
        `**Classification:** ${classification}`;

      setMessages(prev => [
        ...prev,
        { sender: "ai", text: formattedMessage }
      ]);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "⚠️ Error fetching response.";
      setMessages(prev => [...prev, { sender: "ai", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-lg break-words shadow-sm ${
                msg.sender === "user"
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-green-100 text-green-900 rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-green-100 text-green-900 rounded-bl-none">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <div className="p-4 bg-white border-t border-gray-300 flex items-center gap-2 sticky bottom-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your health question..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
