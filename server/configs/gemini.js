import axios from "axios";

const geminiAPI = {
  async generateContent(prompt) {
    const url = `${process.env.GEMINI_API_URL}/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    try {
      const response = await axios.post(url, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected Gemini API response structure:", JSON.stringify(response.data, null, 2));
        throw new Error("Invalid response structure from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API Error Details:");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message);
      }
      throw error;
    }
  }
};

export default geminiAPI;
