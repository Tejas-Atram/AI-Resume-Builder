import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

async function testGemini() {
  try {
    console.log("Testing Gemini API...");
    console.log("API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    console.log("Model:", process.env.GEMINI_MODEL);
    
    const result = await gemini.generateContent("Say hello in one sentence");
    const response = result.response.text();
    
    console.log("✅ Success!");
    console.log("Response:", response);
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("❌ Full Error:", error);
  }
}

testGemini();
