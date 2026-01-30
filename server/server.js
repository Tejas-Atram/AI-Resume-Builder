import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import geminiRouter from "./routes/geminiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//Database Connection
await connectDB();

// MiddleWare
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`); // ✅ Fixed: Added parentheses
  next();
});

app.get("/", (req, res) => res.send("Server is Live"));

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", geminiRouter); // ✅ Fixed: Back to /api/ai

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // ✅ Fixed: Added parentheses
});
