// backend/routes/chatsRouter.js
const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authmiddleware");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint (no auth required)
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Chats router is working" });
});

// GET user's chats
router.get("/", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Add chat summary endpoint
router.post("/summary", authMiddleware, async (req, res) => {
  try {
    const limit = Number(req.body?.limit) || 20;
    const chats = await Chat.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(limit);

    if (!chats || chats.length === 0) {
      return res.json({ summary: "No chat history available to summarize." });
    }

    // If Gemini API key is not available, provide a basic summary
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found, providing basic summary");
      
      const topics = chats.map(c => c.userMessage.toLowerCase().split(' ').slice(0, 3).join(' '));
      const uniqueTopics = [...new Set(topics)];
      const basicSummary = `Recent chat activity includes ${chats.length} conversations covering topics like: ${uniqueTopics.slice(0, 5).join(', ')}. The AI provided responses with classifications: ${chats.map(c => c.classification).join(', ')}.`;
      
      return res.json({ summary: basicSummary, type: "basic" });
    }

    // Use Gemini for AI-powered summary
    try {
      const conversationBullets = chats
        .map((c, i) => `Q${chats.length - i}: ${c.userMessage}\nA${chats.length - i}: ${c.aiMessage}`)
        .join("\n\n");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Summarize the following Q/A chat history succinctly for a product activity log.\n\n${conversationBullets}\n\nYour output should be a concise paragraph (4-7 sentences) capturing: main topics, key advice given, any cautions, and overall sentiment. No preface or bullets.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return res.json({ summary: text, type: "ai" });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      // Fallback to basic summary if Gemini fails
      const topics = chats.map(c => c.userMessage.toLowerCase().split(' ').slice(0, 3).join(' '));
      const uniqueTopics = [...new Set(topics)];
      const basicSummary = `Recent chat activity includes ${chats.length} conversations covering topics like: ${uniqueTopics.slice(0, 5).join(', ')}. The AI provided responses with classifications: ${chats.map(c => c.classification).join(', ')}.`;
      
      return res.json({ summary: basicSummary, type: "basic_fallback" });
    }
  } catch (err) {
    console.error("Summary generation error:", err);
    return res.status(500).json({ error: "Failed to summarize chats", details: err.message });
  }
});

module.exports = router;
