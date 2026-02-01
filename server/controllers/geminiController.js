import groq from "../configs/gemini.js";
import Resume from "../models/Resume.js";

/**
 * 1. Enhance Professional Summary
 */
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent)
      return res.status(400).json({ message: "Missing required fields" });

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Refine the text into 1-2 powerful sentences. Return ONLY the improved text.",
        },
        { role: "user", content: userContent },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiText = result.choices[0]?.message?.content || "";
    return res.status(200).json({ aiContent: aiText.trim() });
  } catch (error) {
    console.error("❌ Enhance Summary Error:", error.message);
    return res.status(500).json({ message: "AI Enhancement failed" });
  }
};

/**
 * 2. Enhance Job Description (FIXED)
 */
export const enhanceJobDesc = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent)
      return res.status(400).json({ message: "Missing content" });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume editor. Rewrite job descriptions to be action-oriented and professional. Return ONLY the improved text.",
        },
        { role: "user", content: userContent },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiText = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ aiContent: aiText.trim() });
  } catch (error) {
    console.error("❌ Enhance JD Error:", error.message);
    return res.status(500).json({ message: "AI Enhancement failed" });
  }
};

/**
 * 3. Upload and Parse Resume
 */
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText)
      return res.status(400).json({ message: "No resume text provided" });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional data extractor. Convert raw text into a clean JSON object.",
        },
        {
          role: "user",
          content: `Extract from: "${resumeText}"
          Return JSON:
          {
            "personalInfo": { "fullName": "string", "email": "string", "phone": "string", "linkedin": "string","location": "string" },
            "summary": "string",
            "skills": ["string"],
            "experience": [{ "company": "string", "role": "string", "desc": "string" }],
            "education": [{ "school": "string", "degree": "string" }]
          }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(chatCompletion.choices[0].message.content);

    const newResume = await Resume.create({
      userId,
      title: title || "Imported Resume",
      ...parsedData,
    });

    return res
      .status(201)
      .json({ message: "Success", resumeId: newResume._id });
  } catch (error) {
    console.error("❌ Extraction Error:", error.message);
    return res.status(500).json({ message: "Failed to parse resume" });
  }
};

/**
 * 4. Check ATS Score
 */ export const checkATSScore = async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;
    // ... validation ...

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a highly accurate ATS. Return strictly a JSON object.",
        },
        {
          role: "user",
          content: `JD: ${jobDescription}\nResume: ${cvText}
           Return JSON:
           {
             "score": number,
             "strengths": ["string"],
             "weaknesses": ["string"],
             "missingKeywords": ["string"],
             "suggestions": ["string"]
           }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const parsedAnalysis = JSON.parse(completion.choices[0].message.content);
    return res.status(200).json({ analysis: parsedAnalysis });
  } catch (error) {
    console.error("❌ ATS Error:", error.message);
    return res.status(500).json({ message: "AI Analysis failed" });
  }
};
