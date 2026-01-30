import React, { useEffect, useState, useCallback } from "react";
import {
  Edit2Icon,
  FilePenIcon,
  LoaderCircle,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import ATSResultsUI from "../components/ATSResultsUI";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Data States
  const [allResumes, setAllResumes] = useState([]);
  const [atsData, setAtsData] = useState(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null); // Changed name for clarity
  const [jobDescription, setJobDescription] = useState("");
  const [atsResumeFile, setAtsResumeFile] = useState(null);

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const loadAllResume = useCallback(async () => {
    try {
      const { data } = await api.get("/api/users/resumes");
      setAllResumes(data.resumes || []);
    } catch (error) {
      toast.error("Failed to load resumes");
    }
  }, []);

  useEffect(() => {
    if (token) loadAllResume();
  }, [token, loadAllResume]);

  // --- FIXED ATS LOGIC ---
  const handleCheckATS = async (event) => {
    event.preventDefault();

    if (!atsResumeFile || !jobDescription.trim()) {
      return toast.error("Please provide both CV and JD");
    }

    setIsLoading(true);
    try {
      const rawText = await pdfToText(atsResumeFile);

      // Clean the text: remove extra whitespace and hidden characters
      const cleanText = rawText.replace(/\s+/g, " ").trim();

      console.log("Cleaned Text Length:", cleanText.length);

      // Validation: We'll lower the check to 10 characters just to let it pass
      if (!cleanText || cleanText.length < 10) {
        throw new Error(
          "PDF text extraction failed. Please try a different PDF.",
        );
      }

      const { data } = await api.post("/api/ai/check-ats", {
        jobDescription: jobDescription.trim(),
        cvText: cleanText, // Sent cleaned text
      });

      if (data.analysis) {
        setAtsData(data.analysis);
        toast.success("Analysis Complete!");
        setShowATSModal(false);
      } else {
        toast.error("AI returned no results. Check your API key or prompt.");
      }
    } catch (error) {
      console.error("ATS Error:", error);
      toast.error(error.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };
  // --- FIXED UPLOAD RESUME ---
  const uploadResume = async (event) => {
    event.preventDefault();

    // 1. Check if title exists and file is selected
    if (!title.trim()) {
      return toast.error("Please provide a title for your resume");
    }
    if (!resumeFile) {
      return toast.error("Please select a PDF file to upload");
    }

    setIsLoading(true);
    try {
      // 2. Extract text from the PDF
      const extractedText = await pdfToText(resumeFile);

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error(
          "Could not read the PDF. Please ensure it's a text-based PDF.",
        );
      }

      // 3. Call Backend
      const { data } = await api.post("/api/ai/upload-resume", {
        title: title.trim(),
        resumeText: extractedText,
      });

      toast.success("Resume imported successfully!");
      setShowUploadResume(false); // Close modal
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();
    if (!title.trim()) return toast.error("Please enter a title");
    try {
      const { data } = await api.post("/api/resumes/create", {
        title: title.trim(),
      });
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error("Creation failed");
    }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/api/resumes/delete/${resumeId}`);
      setAllResumes(allResumes.filter((r) => r._id !== resumeId));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <FilePenIcon size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">ResumeAI</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="text-slate-500">
            Manage your resumes or use AI to audit your match score.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => setShowCreateResume(true)}
            className="flex-1 min-w-[200px] h-32 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
          >
            <PlusIcon className="text-slate-400 group-hover:text-indigo-600" />
            <span className="font-semibold text-slate-600 group-hover:text-indigo-600">
              Create New
            </span>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="flex-1 min-w-[200px] h-32 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-50/30 transition-all group"
          >
            <UploadCloudIcon className="text-slate-400 group-hover:text-purple-600" />
            <span className="font-semibold text-slate-600 group-hover:text-purple-600">
              Upload PDF
            </span>
          </button>

          <button
            onClick={() => {
              setAtsData(null);
              setShowATSModal(true);
            }}
            className="flex-1 min-w-[200px] h-32 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:bg-orange-50/30 transition-all group"
          >
            <LoaderCircle
              className={`text-slate-400 group-hover:text-orange-600 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="font-semibold text-slate-600 group-hover:text-orange-600">
              ATS Checker
            </span>
          </button>
        </div>

        {/* Resume Grid */}
        <h2 className="text-xl font-bold mb-6">Your Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {allResumes.map((res, i) => (
            <div
              key={res._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative group cursor-pointer"
              onClick={() => navigate(`/app/builder/${res._id}`)}
            >
              <FilePenIcon
                style={{ color: colors[i % colors.length] }}
                className="mb-4"
              />
              <h3 className="font-bold truncate">{res.title}</h3>
              <p className="text-xs text-slate-400">
                Updated {new Date(res.updatedAt).toLocaleDateString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteResume(res._id);
                }}
                className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-md"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* --- AI Analysis Result Section --- */}
        {atsData && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                Showing Analysis for your last scan
              </div>

              {/* RETRY / CLEAR BUTTON */}
              <button
                onClick={() => {
                  setAtsData(null); // This clears the result
                  setJobDescription(""); // Optional: clears the previous JD
                  setAtsResumeFile(null); // Optional: clears the previous file
                  toast.success("Ready for a new scan!");
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all shadow-md active:scale-95"
              >
                <PlusIcon size={18} />
                Retry New Analysis
              </button>
            </div>

            {/* The actual Results UI component */}
            <ATSResultsUI data={atsData} />

            <div className="flex justify-center mt-10 pb-10">
              <button
                onClick={() => setAtsData(null)}
                className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
              >
                Dismiss Results
              </button>
            </div>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Upload Modal */}
      {showUploadResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Import PDF</h2>
              <XIcon
                className="cursor-pointer"
                onClick={() => setShowUploadResume(false)}
              />
            </div>
            <form onSubmit={uploadResume} className="space-y-4">
              {/* Inside your Upload Modal */}
              <input
                className="w-full p-3 border rounded-xl"
                placeholder="Resume Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // MUST HAVE THIS
                required
              />

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])} // MUST HAVE THIS
                className="..."
              />
              <button
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:bg-slate-300"
              >
                {isLoading ? "Analyzing..." : "Import"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ATS Modal */}
      {showATSModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">ATS Audit</h2>
              <XIcon
                className="cursor-pointer"
                onClick={() => setShowATSModal(false)}
              />
            </div>
            <div className="space-y-4">
              <textarea
                className="w-full h-40 p-4 border rounded-xl resize-none"
                placeholder="Paste Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setAtsResumeFile(e.target.files[0])}
                className="w-full"
              />
              <button
                onClick={handleCheckATS}
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold disabled:bg-slate-300"
              >
                {isLoading ? "Running Scan..." : "Start Analysis"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateResume && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">New Resume</h2>
            <input
              className="w-full p-3 border rounded-xl mb-4"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateResume(false)}
                className="flex-1 py-3 text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={createResume}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
