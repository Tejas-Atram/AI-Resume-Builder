import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";

// Component Imports
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/Home/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorWheel from "../components/Home/ColorWheel";
import ProfessionalSummary from "../components/ProfessionalSummary";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm"; // Fixed casing

import api from "../configs/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "project", name: "Projects", icon: FolderIcon },
    { id: "skill", name: "Skill", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title || "Resume Builder";
      } else {
        navigate(`/view/${resumeId}`);
      }
    } catch (error) {
      console.error("Load Error:", error.message);
      navigate(`/view/${resumeId}`);
    }
  }, [resumeId, token, navigate]);

  useEffect(() => {
    if (token && resumeId) {
      loadExistingResume();
    }
  }, [loadExistingResume, token, resumeId]);

  const downloader = () => {
    window.print();
  };

  // Add this state at the top

  const saveChanges = async () => {
    if (isSaving) return; // Prevent double-clicks or double-calls

    try {
      setIsSaving(true);
      let updatedResumeData = structuredClone(resumeData);

      // Clean up image object from nested data to keep JSON payload light
      if (updatedResumeData.personal_info?.image instanceof Object) {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) formData.append("removeBackground", "yes");

      // Only append the file if it's a new upload (an object/File)
      if (resumeData.personal_info?.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
      }

      // INTERCEPTOR handles headers, so we keep this clean
      const { data } = await api.put("/api/resumes/update", formData);

      setResumeData(data.resume);
      toast.success(data.message || "Changes saved!", { id: "save-logic" });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save changes.", { id: "save-logic" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="resume-container max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{
                    width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                  }}
                />
              </div>

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-4">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData?.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorWheel
                    selectedColor={resumeData?.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    className="flex items-center gap-1 p-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    disabled={activeSectionIndex === 0}
                  >
                    <ChevronLeft className="size-4" /> Previous
                  </button>
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1),
                      )
                    }
                    className="flex items-center gap-1 p-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {activeSection?.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData?.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection?.id === "summary" && (
                  <ProfessionalSummary
                    data={resumeData?.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                    resumeData={resumeData}
                  />
                )}
                {activeSection?.id === "experience" && (
                  <ExperienceForm
                    data={resumeData?.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, experience: data }))
                    }
                  />
                )}
                {activeSection?.id === "education" && (
                  <EducationForm
                    data={resumeData?.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection?.id === "project" && (
                  <ProjectForm
                    data={resumeData?.projects}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, projects: data }))
                    }
                  />
                )}
                {activeSection?.id === "skill" && (
                  <SkillsForm
                    data={resumeData?.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>

              <button
                onClick={() =>
                  toast.promise(saveChanges(), {
                    loading: "Saving...",
                    success: "Changes Saved!",
                    error: "Error saving resume.",
                  })
                }
                className="no-print w-full bg-slate-800 text-white rounded-md px-6 py-2 mt-6 text-sm font-semibold hover:bg-slate-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7">
            <div className="flex justify-end mb-4">
              <button
                onClick={downloader}
                className=" no-print flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm"
              >
                <Download className="size-4" />
                Download PDF
              </button>
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData?.template}
              accentColor={resumeData?.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
