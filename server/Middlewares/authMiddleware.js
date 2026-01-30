import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  // 1. Get the header
  const authHeader = req.headers.authorization;
  
  // 2. Check if it exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 3. Extract the actual token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // 4. Use 401 for Auth errors, not 404
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default protect;
