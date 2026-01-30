import React, { useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  XCircle,
  Trophy,
  Target,
  FileText,
} from "lucide-react";

const ATSResultsUI = ({ data }) => {
  const resultsRef = useRef(null);

  // Automatically scroll to results when data arrives
  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  if (!data) return null;

  const {
    score = 0,
    strengths = [],
    weaknesses = [],
    suggestions = [],
    missingKeywords = [],
  } = data;

  const getScoreColor = (val) => {
    if (val >= 80) return "text-green-600 border-green-200 bg-green-50";
    if (val >= 50) return "text-yellow-600 border-yellow-200 bg-yellow-50";
    return "text-red-600 border-red-200 bg-red-50";
  };

  return (
    <div
      ref={resultsRef}
      className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Header & Score Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase mb-2">
            Analysis Complete
          </div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500 shrink-0" />
            ATS Analysis Report
          </h2>
        </div>

        <div
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 shrink-0 transition-all duration-1000 ${getScoreColor(score)}`}
        >
          <span className="text-3xl font-black">{score}%</span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            Match
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li
                key={idx}
                className="p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Weaknesses */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-red-700">
            <XCircle className="w-5 h-5 shrink-0" />
            Missing Qualifications
          </h3>
          <ul className="space-y-2">
            {weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-100"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Keywords */}
      <section className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-semibold text-slate-700 mb-4">
          <Target className="w-5 h-5 shrink-0" />
          Missing Keywords to Add
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium shadow-sm hover:border-blue-300 transition-colors"
            >
              + {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* Suggestions */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 font-semibold text-amber-700">
          <Lightbulb className="w-5 h-5 shrink-0" />
          Optimization Tips
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {suggestions.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ATSResultsUI;
