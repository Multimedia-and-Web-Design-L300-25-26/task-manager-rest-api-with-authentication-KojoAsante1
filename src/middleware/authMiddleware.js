import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and 4. Attach to req.user
    req.user = await User.findById(decoded.id).select("-password");
    
    // 5. Call next()
    next();
  } catch (error) {
    // 6. If invalid -> return 401
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;