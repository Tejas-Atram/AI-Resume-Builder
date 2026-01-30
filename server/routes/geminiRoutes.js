import express from "express";
import {
  enhanceJobDesc,
  enhanceProfessionalSummary,
  uploadResume,
  checkATSScore, // Import the new function
} from "../controllers/geminiController.js";
import protect from "../Middlewares/authMiddleware.js";

const geminiRouter = express.Router();

// Apply protect middleware to all routes to ensure user data (userId) is available
geminiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
geminiRouter.post("/enhance-job-desc", protect, enhanceJobDesc);
geminiRouter.post("/upload-resume", protect, uploadResume);

// New route for the ATS Score Checker
geminiRouter.post("/check-ats", protect, checkATSScore);

export default geminiRouter;
