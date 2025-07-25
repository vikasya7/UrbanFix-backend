import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT= asyncHandler(async (req,res,next)=>{
   console.log("✅ verifyJWT middleware running...");
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

   console.log(token);
   
   
   if(!token){
    return res.status(401).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
   }
   try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;
    //console.log("✅ JWT verified, user attached to req");
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }


   
})

export {verifyJWT}