// const express = require("express");
// const router = express.Router();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.post("/ask", async (req, res) => {
//   const { question } = req.body;
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const systemPrompt = `
// You are Medi-BuddyAi, an expert in reliable health information.  
// Your tasks:
// 1. Answer the user's question using accurate, evidence-based health knowledge.
// 2. Provide 2–3 relevant trustworthy website links (WHO, CDC, Mayo Clinic, NHS, etc.).
// 3. Classify the information into one of: "Accurate", "Misleading", "Harmful".
// 4. Output JSON strictly in the following format:
// {
//   "answer": "string",
//   "sources": ["url1", "url2", "url3"],
//   "classification": "Accurate | Misleading | Harmful"
// }
// If unsure about the accuracy, lean toward "Misleading" and warn the user.
// Return ONLY the JSON with no extra commentary.
// `;

//   let attempts = 0;
//   const maxAttempts = 3;

//   while (attempts < maxAttempts) {
//     try {
//       const result = await model.generateContent(`${systemPrompt}\n\nUser question: ${question}`);
//       const text = result.response.text();
//       console.log("Raw Gemini output:", text);

//       let parsed;
//       try {
//         // Find first JSON object in the text
//         const jsonMatch = text.match(/\{[\s\S]*\}/);
//         if (jsonMatch) {
//           parsed = JSON.parse(jsonMatch[0]);
//         } else {
//           throw new Error("No JSON found in AI output");
//         }
//       } catch (err) {
//         console.error("JSON Parse Error:", err);
//         return res.status(500).json({ error: "Invalid AI response format" });
//       }

//       return res.json(parsed);

//     } catch (error) {
//       if (error.status === 503) {
//         attempts++;
//         const waitTime = 2000 * attempts;
//         console.warn(`Gemini overloaded. Retrying in ${waitTime / 1000}s...`);
//         await new Promise(r => setTimeout(r, waitTime));
//       } else {
//         console.error("Gemini API Error:", error);
//         return res.status(500).json({ error: "Something went wrong with Gemini API." });
//       }
//     }
//   }

//   res.status(503).json({
//     error: "Gemini AI is busy right now. Please try again later."
//   });
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
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
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in AI output");
        }
      } catch (err) {
        console.error("JSON Parse Error:", err);
        return res.status(500).json({ error: "Invalid AI response format" });
      }

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
