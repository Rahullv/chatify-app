import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import cookie from "cookie";

export const socketAuthMiddleware = async (socket, next) => {
     try {
          // extract token from cookies using cookie parser
          const cookies = cookie.parse(socket.handshake.headers.cookie || "");
          let token = null;
          if (cookies.jwt) {
            try {
              token = decodeURIComponent(cookies.jwt);
            } catch (error) {
              if (error instanceof URIError) {
                console.log("Malformed token detected");
              } else {
                throw error;
              }
            }
          }

          if(!token) {
               console.log("Socket connection rejected: No token provided");
               return next(new Error("Unauthorized - No token provided"));
          }

          // verify the token 
          const decoded = jwt.verify(token, ENV.JWT_SECRET);

          const user = await User.findById(decoded.userId).select("-password");
          if(!user) {
               console.log("Socket connection rejected: User not found");
               return next(new Error("User not found"));
          }

          // attach user info to socket 
          socket.user = user;
          socket.userId = user._id.toString();

          console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
          next();

     } catch (error) {
          if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
               console.log("Socket connection rejected: Invalid token");
          } else {
               console.log("Error in Socket authentication: ", error.message);
          }
          return next(new Error("Unauthorized - Authentication failed"));
     }
};