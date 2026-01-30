import { Sparkles, LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api"; // This is your Axios instance
import toast from "react-hot-toast";

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    // 1. Basic Validation
    if (!token) return toast.error("Please login first");
    if (!data || data.trim().length === 0) {
      return toast.error("Please write a draft summary first.");
    }

    try {
      setIsGenerating(true);

      // 2. Make the API call to YOUR backend (not Groq directly)
      // Note: Your api.js interceptor should handle the token now
      const response = await api.post("/api/ai/enhance-pro-sum", {
        userContent: data, // Sending 'userContent' to match backend expectation
      });

      // 3. Update State with the result
      if (response.data.aiContent) {
        setResumeData((prev) => ({
          ...prev,
          professional_summary: response.data.aiContent,
        }));
        toast.success("Summary enhanced successfully!");
      }
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      toast.error("Failed to enhance summary");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Write a draft summary, then use AI to enhance it
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <LoaderCircle className="animate-spin size-4" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>AI-Enhance</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-3 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Write a professional summary about yourself... (e.g., 'Experienced software engineer with 5 years in full-stack development...')"
        />
        <p className="text-xs text-gray-500 text-center mt-2">
          Tip: Write a draft first, then click AI-Enhance to make it more
          impactful.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
