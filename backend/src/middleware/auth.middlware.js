import jwt, { decode } from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, resp, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token)
      return resp
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      return resp.status(401).json({
        message: "Unauthorized - Invalid or expired token",
      });
    }
    if (!decoded)
      return resp.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return resp.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};
