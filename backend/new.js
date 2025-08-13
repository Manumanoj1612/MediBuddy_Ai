require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  
  const msg = "drinking 5liters of water causes?";

  const result = await model.generateContent(msg);

  console.log(result.response.text());
}

main();
