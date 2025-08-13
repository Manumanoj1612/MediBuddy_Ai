// backend/routes/chatsRouter.js
const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET all chats
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

module.exports = router;

// Add chat summary endpoint
router.post("/summary", async (req, res) => {
  try {
    const limit = Number(req.body?.limit) || 20;
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(limit);

    if (!chats || chats.length === 0) {
      return res.json({ summary: "No chat history available to summarize." });
    }

    const conversationBullets = chats
      .map((c, i) => `Q${chats.length - i}: ${c.userMessage}\nA${chats.length - i}: ${c.aiMessage}`)
      .join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the following Q/A chat history succinctly for a product activity log.\n\n${conversationBullets}\n\nYour output should be a concise paragraph (4-7 sentences) capturing: main topics, key advice given, any cautions, and overall sentiment. No preface or bullets.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ summary: text });
  } catch (err) {
    console.error("Summary generation error:", err);
    return res.status(500).json({ error: "Failed to summarize chats" });
  }
});
