import express from "express";
import {
  enhanceJobDesc,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/geminiController.js";
import protect from "../Middlewares/authMiddleware.js";

const geminiRouter = express.Router();

geminiRouter.post("/enhance-pro-sum", enhanceProfessionalSummary);
geminiRouter.post("/enhance-job-desc", enhanceJobDesc);
geminiRouter.post("/upload-resume", protect, uploadResume);

export default geminiRouter;
