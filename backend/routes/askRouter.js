// backend/routes/askRouter.js
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { question } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
You are InfoCheckAI — an AI that answers *any* type of question (general knowledge, tech, health, science, etc.).
If the topic is health, use accurate evidence-based data.

Your response must:
1. Give a clear, correct, and useful answer.
2. Provide 2–3 trustworthy source links (must be valid URLs).
3. Classify the accuracy of the question into: "Accurate", "Misleading", or "Harmful".
4. Give an estimated "accuracy_percentage" as a number between 0 and 100.
5. Output **strict JSON** in the format:
{
  "answer": "string",
  "sources": ["url1", "url2", "url3"],
  "classification": "Accurate | Misleading | Harmful",
  "accuracy_percentage": number
}

Return ONLY JSON, no extra text.
`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(`${systemPrompt}\n\nUser question: ${question}`);
      const text = result.response.text();
      console.log("Raw Gemini output:", text);

      let parsed;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
        else throw new Error("No JSON found in AI output");
      } catch (err) {
        console.error("JSON Parse Error:", err);
        return res.status(500).json({ error: "Invalid AI response format" });
      }

      // Save chat to DB
      const chat = new Chat({
        userMessage: question,
        aiMessage: parsed.answer,
        classification: parsed.classification || "Not classified",
        sources: parsed.sources || [],
        accuracyPercentage: parsed.accuracy_percentage || null,
      });

      await chat.save();

      return res.json(parsed);

    } catch (error) {
      if (error.status === 503) {
        attempts++;
        const waitTime = 2000 * attempts;
        console.warn(`Gemini overloaded. Retrying in ${waitTime / 1000}s...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: "Something went wrong with Gemini API." });
      }
    }
  }

  res.status(503).json({
    error: "Gemini AI is busy right now. Please try again later."
  });
});

module.exports = router;
