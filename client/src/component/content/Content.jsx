import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Content() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I’m Health AI. Ask me anything about health and I’ll help you." }
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Fetch chat history on load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chats");
        setChatHistory(res.data);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userQuery = query;
    setMessages(prev => [...prev, { sender: "user", text: userQuery }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ask", { question: userQuery });
      const answer = res.data?.answer || "No answer provided.";
      const sources = Array.isArray(res.data?.sources) ? res.data.sources : [];
      const classification = res.data?.classification || "Not classified";

      const formattedMessage =
        `**Answer:** ${answer}\n\n` +
        (sources.length
          ? `**Sources:**\n${sources.map((src, i) => `${i + 1}. [${src}](${src})`).join("\n")}\n\n`
          : "") +
        `**Classification:** ${classification}`;

      setMessages(prev => [...prev, { sender: "ai", text: formattedMessage }]);
      setChatHistory(prev => [
        { userMessage: userQuery, aiMessage: answer, sources, classification },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "⚠️ Error fetching response.";
      setMessages(prev => [...prev, { sender: "ai", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/chats/summary", { limit: 20 });
      console.log("Chat Summary:", res.data?.summary || res.data);
    } catch (err) {
      console.error("Error summarizing chats:", err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChatFromHistory = (chat) => {
    const formattedMessage =
      `**Answer:** ${chat.aiMessage}\n\n` +
      (chat.sources && chat.sources.length
        ? `**Sources:**\n${chat.sources.map((src, i) => `${i + 1}. [${src}](${src})`).join("\n")}\n\n`
        : "") +
      `**Classification:** ${chat.classification}`;

    setMessages([
      { sender: "user", text: chat.userMessage },
      { sender: "ai", text: formattedMessage },
    ]);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Fixed Drawer */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {chatHistory.length === 0 && <p className="p-4 text-gray-500">No past chats.</p>}
          {chatHistory.map((chat, idx) => (
            <div
              key={idx}
              onClick={() => openChatFromHistory(chat)}
              className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
            >
              <p className="font-medium truncate">{chat.userMessage}</p>
              <p className="text-sm text-gray-500 truncate">{chat.aiMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-lg break-words shadow-sm ${
                msg.sender === "user" ? "bg-green-500 text-white rounded-br-none" : "bg-green-100 text-green-900 rounded-bl-none"
              }`}>
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
            onClick={handleSummarize}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold"
          >
            Summarize
          </button>
          <button
            onClick={handleSend}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
