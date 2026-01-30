import Groq from "groq-sdk";
import "dotenv/config";

// We keep the variable name 'gemini' so your imports elsewhere don't break
const gemini = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default gemini;
