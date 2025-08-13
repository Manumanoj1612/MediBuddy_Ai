import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import DoctorProfileModal from "./DoctorProfileModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Content() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I’m Health AI. Ask me anything about health and I’ll help you." }
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    hospital: "Heart Care Medical Center",
    experience: "12+ years",
    languages: "English, Spanish",
    fee: "$120",
    rating: "4.9",
    about: "Specialized in cardiovascular health with expertise in preventive cardiology, heart disease management, and lifestyle interventions. Committed to providing comprehensive cardiac care.",
    email: "dr.sarah.johnson@heartcare.com"
  });
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    console.log("Auth check:", { isAuthenticated, token: token ? "exists" : "missing" });
    if (!isAuthenticated || !token) {
      console.log("Redirecting to login - not authenticated");
      navigate("/login");
      return;
    }
    console.log("User authenticated, setting loading to false");
    setIsLoading(false);
  }, [isAuthenticated, token, navigate]);

  // Fetch chat history and doctors on load
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !isAuthenticated) {
        console.log("Skipping fetchData - no token or not authenticated");
        return;
      }
      
      console.log("Fetching data with token:", token.substring(0, 20) + "...");
      
      try {
        // Fetch chat history with auth header
        const chatRes = await axios.get("http://localhost:5000/api/chats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Chat history fetched:", chatRes.data.length, "chats");
        setChatHistory(chatRes.data);
        
        // Fetch doctors
        const doctorRes = await axios.get("http://localhost:5000/api/doctors");
        console.log("Doctors fetched:", doctorRes.data.length, "doctors");
        setDoctors(doctorRes.data);
        
        // Set first doctor as default if available
        if (doctorRes.data.length > 0) {
          const firstDoctor = doctorRes.data[0];
          setDoctorInfo({
            name: firstDoctor.name || "Dr. Unknown",
            specialization: firstDoctor.description || "General Physician",
            hospital: "Medical Center",
            experience: "10+ years",
            languages: "English",
            fee: "$80",
            rating: "4.5",
            about: firstDoctor.description || "Experienced physician committed to providing quality healthcare.",
            email: firstDoctor.email
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          console.log("Unauthorized - redirecting to login");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [token, isAuthenticated, navigate]);

  const handleSend = async () => {
    if (!query.trim() || !token) return;

    const userQuery = query;
    setMessages(prev => [...prev, { sender: "user", text: userQuery }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ask", 
        { question: userQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      const errorMsg = err.response?.data?.error || "⚠️ Error fetching response.";
      setMessages(prev => [...prev, { sender: "ai", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!token) return;
    
    try {
      setSummaryLoading(true);
      const res = await axios.post("http://localhost:5000/api/chats/summary", 
        { limit: 20 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const summaryData = res.data;
      console.log("Chat Summary:", summaryData.summary);
      console.log("Summary Type:", summaryData.type);
      if (summaryData.type === "basic" || summaryData.type === "basic_fallback") {
        console.log("Note: Using basic summary due to missing Gemini API key");
      }
      
      // Set the summary and open the modal
      setSummary(summaryData.summary);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error summarizing chats:", err);
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      if (err.response?.data?.error) {
        console.error("Server error details:", err.response.data.error);
      }
    } finally {
      setSummaryLoading(false);
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

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 text-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Fixed Drawer */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
          {user && (
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          )}
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
            disabled={summaryLoading}
            className={`py-2 px-4 rounded-lg font-semibold ${
              summaryLoading 
                ? "bg-gray-400 cursor-not-allowed text-gray-600" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {summaryLoading ? "Generating..." : "Summarize"}
          </button>
          <button
            onClick={handleSend}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        summary={summary}
        doctorInfo={doctorInfo}
        doctors={doctors}
        onDoctorChange={(doctor) => {
          setDoctorInfo({
            name: doctor.name || "Dr. Unknown",
            specialization: doctor.description || "General Physician",
            hospital: "Medical Center",
            experience: "10+ years",
            languages: "English",
            fee: "$80",
            rating: "4.5",
            about: doctor.description || "Experienced physician committed to providing quality healthcare.",
            email: doctor.email
          });
        }}
      />
    </div>
  );
}
