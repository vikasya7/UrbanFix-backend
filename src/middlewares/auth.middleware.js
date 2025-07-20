import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT= asyncHandler(async (req,res,next)=>{
   console.log("✅ verifyJWT middleware running...");
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

   console.log(token);
   
   
   if(!token){
    throw new ApiError(400,"unauthorized request")
   }
   const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user= await User.findById(decodedToken?._id).select("-password -refreshToken")

   req.user=user;
   console.log("verifyjwt ended");
   
   next()


   
})

export {verifyJWT}