import React from "react";
import {
  BriefcaseBusiness,
  Globe,
  Linkedin, // Standardized naming (lowercase 'i')
  Mail,
  Phone,
  User,
} from "lucide-react";

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  // Handles updating individual fields within the personalInfo object
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    {
      key: "location",
      label: "Location",
      icon: BriefcaseBusiness,
      type: "text",
    },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
        <p className="text-sm text-gray-600">
          Provide your contact details to help recruiters reach you.
        </p>
      </div>

      {/* Profile Image Section */}
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer group">
          {data.image ? (
            <img
              src={
                typeof data.image === "string"
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              alt="user-image"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-blue-400 transition-all"
            />
          ) : (
            <div className="w-20 h-20 bg-slate-100 rounded-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 group-hover:border-blue-400 group-hover:text-blue-500 transition-all">
              <User size={24} />
              <span className="text-[10px] font-medium mt-1">Upload</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>

        {/* AI Background Removal Toggle */}
        {data.image && typeof data.image === "object" && (
          <div className="flex flex-col gap-1 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="font-medium text-gray-700">AI Background Removal</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground((prev) => !prev)}
                checked={removeBackground}
              />
              <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        )}
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className="size-4 text-slate-500" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                value={data[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                required={field.required}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
