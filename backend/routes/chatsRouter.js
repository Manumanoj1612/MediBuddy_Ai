// backend/routes/chatsRouter.js
const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

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
