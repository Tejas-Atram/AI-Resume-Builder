import groq from "../configs/gemini.js"; // This is your Groq instance
import Resume from "../models/Resume.js";

/**
 * 1. Enhance Professional Summary
 * Refines raw text into 1-2 powerful sentences.
 */
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Refine the text into 1-2 powerful sentences. Return ONLY the improved text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiText = result.choices[0]?.message?.content || "";
    return res.status(200).json({ aiContent: aiText.trim() });
  } catch (error) {
    console.error("❌ Enhance Summary Error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "AI Enhancement failed" });
    }
  }
};

/**
 * 2. Enhance Job Description
 * Rewrites job bullet points to be action-oriented.
 */
export const enhanceJobDesc = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing content to enhance" });
    }

    // ... inside uploadResume function ...
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional data extractor. Convert raw text into a clean JSON object. Do not include prose.",
        },
        {
          role: "user",
          content: `Extract from this text: "${resumeText}"
              Return strictly as JSON with these EXACT keys:
              {
                "personal_info": {
                   "full_name": "string",
                   "email": "string",
                   "phone": "string",
                   "location": "string",
                   "profession": "string"
                },
                "professional_summary": "string",
                "skills": ["string"],
                "experience": [{
                   "company": "string",
                   "position": "string",
                   "description": "string"
                }],
                "education": [{
                   "institution": "string",
                   "degree": "string",
                   "field": "string"
                }]
              }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    // ... rest of the code ...

    const aiText = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ aiContent: aiText.trim() });
  } catch (error) {
    console.error("❌ Enhance JD Error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "AI Enhancement failed" });
    }
  }
};

/**
 * 3. Upload and Parse Resume
 * Extracts raw PDF text into a structured database object.
 */
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "No resume text provided" });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional data extractor. Convert raw text into a clean JSON object. Do not include prose.",
        },
        {
          role: "user",
          content: `Extract from this text: "${resumeText}"
          Return strictly as JSON:
          {
            "personalInfo": { "fullName": "string", "email": "string", "phone": "string", "location": "string" },
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

    const aiContent = chatCompletion.choices[0]?.message?.content;
    const cleanJson = aiContent.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    const newResume = await Resume.create({
      userId,
      title: title || "Imported Resume",
      ...parsedData,
    });

    return res.status(201).json({
      message: "Resume processed successfully",
      resumeId: newResume._id,
    });
  } catch (error) {
    console.error("❌ Extraction Error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to parse resume text" });
    }
  }
};

/**
 * 4. Check ATS Score
 * Compares CV text against JD and returns a score + feedback.
 */
export const checkATSScore = async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;

    if (!jobDescription || !cvText) {
      return res.status(400).json({ message: "Missing JD or CV content" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a highly accurate ATS. Analyze the match and return strictly a JSON object.",
        },
        {
          role: "user",
          content: `JD: ${jobDescription}\nResume: ${cvText}
          Return strictly as JSON:
          {
            "score": number,
            "missingKeywords": ["string"],
            "strengths": ["string"],
            "weaknesses": ["string"],
            "suggestions": ["string"]
          }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const aiContent = completion.choices[0]?.message?.content;
    const cleanJson = aiContent.replace(/```json|```/g, "").trim();
    const parsedAnalysis = JSON.parse(cleanJson);

    return res.status(200).json({ analysis: parsedAnalysis });
  } catch (error) {
    console.error("❌ ATS Score Error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "AI Analysis failed" });
    }
  }
};
