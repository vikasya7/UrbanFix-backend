import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";

import { Report } from "../models/report.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { mailSend } from "../utils/mailSend.js";




const generateAccessAndRefreshToken= async (userId)=>{

    try {
        //console.log("Generating tokens for:", userId);
        const user=await User.findById(userId)
        //console.log("founded");
        
        const accessToken=user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();
       // console.log("token founded");
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})
        //console.log("generated access tken and refresh token");
        return {accessToken, refreshToken}
       
        
    } catch (error) {
        throw new ApiError(500,"error while generating tokens"+error.message)
        
    }
}

const registerUser= asyncHandler(async (req,res)=>{
    // get all the details from front-end
    
    // check if user already exist (username)
    //create user object--> create entry in db
     // remove password and refresh token field
     // ckeck for user creation
    // return response
    //console.log("REGISTER ROUTE HIT ✅"); 

 
    //console.log("Incoming request:", req.body);
    const{username, email,fullname,password}=req.body;

    //console.log("1st step");
    

    if( [username, email, fullname, password].some(field => field?.trim()==="")){
         throw new ApiError(400,"all fields are required")

     }
     //console.log("2nd step");
     
    const existingUser =await User.findOne({username})

     if(existingUser){
         throw new ApiError(400," user already exist")
     }
     //console.log("3rd step");
     let user;
     
  try {
    
         user= await User.create({
        fullname,
         username: username.toLowerCase(),
         email,
         password,

         })

  //console.log("✅ User created successfully");
} catch (error) {
    throw new ApiError(500,"user creation failed"+error.message)
    
    
}

     //console.log("hii after user creation");
     

     const createdUser= await User.findById(user._id).select(
         "-password -refreshToken"
     )
     if(!createdUser){
         throw new ApiError(500, "something went wrong while registering the user")
       }

     const options={
        httpOnly:true,
        secure:false
     }
     //console.log("Before token generation");
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    if(!accessToken || !refreshToken){
        throw new ApiError(400, "unable to create access token and refresh token")
    }
     //console.log("After token generation");
    return res
    .cookie("accessToken",accessToken,{
        ...options,
        maxAge:15*60*1000 // 15 minutes
    })
   .cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
    .status(201)
    .json(
        new ApiResponse(201,createdUser,"user registered successfully")
    )
})

// const registerUser = asyncHandler(async (req, res) => {
//   return res.json({ message: "Test passed", body: req.body });
// });


const loginUser= asyncHandler(async (req,res)=>{
    // take user details --> req.body
    // login with username or email
    // check password
    // access and refresh token
    // send cookies

    const {username, password}=req.body

    if(!username ){
        throw new ApiError(400,"username is required")

    }
    const user=await User.findOne({username})
    if(!user){
        throw new ApiError(400,"user does not exist")
    }
    //console.log("Entered password:", password);
    //console.log("Stored hash:", user.password);
    const isPasswordValid= await user.isPasswordCorrect(password)
     // console.log("password correct 1st");
      //console.log("bcrypt result:", isPasswordValid);
   
      if(!isPasswordValid){
      throw new ApiError(401,"Invalid user credentials")
     }
     //console.log("password correct");
     
    const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id);
   // console.log(accessToken);
    
    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )




    const options={
        httpOnly:true,
        secure:false
    }

    return res
    .cookie("accessToken",accessToken,{
        ...options,
        maxAge:15*60*1000 // 15 minutes
    })
   .cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
    .status(201)
    .json(
        new ApiResponse(201,loggedInUser,"user logged in successfully")
    )


    






})

const logoutUser=asyncHandler(async(req,res)=>{
    // clear the cookies 
    // reset the refresh token

    const options={
        httpOnly:true,
        secure:true
    }
     const user= await User.findById(req.user._id)
     if(!user){
        throw new ApiError(404,"user not found")
     }
     user.refreshToken=undefined;
     await user.save({validateBeforeSave:false})

     res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(
        new ApiResponse(
            200,{},"user logged out successfully"
        )
     )

     



})

const changePassword=asyncHandler(async(req,res)=>{
    const{oldPassword, newPassword}=req.body
    if([oldPassword,newPassword].some(field=>field?.trim()==="")){
         throw new ApiError(400,"All fields are required");

    }
    const user=await User.findById(req.user._id);
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
         throw new ApiError(400,"invalid old password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(201)
    .json(
        new ApiResponse(201,{},"Password changed successfully")
    )
})


const createReport=asyncHandler(async(req,res)=>{
    //console.log("hi create reprt");
    
    const {description,location,title}=req.body
     //console.log("👉 Data received:", req.body);

    if([description,location,title].some(field=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }

    const reportImageLocalPath = req.files?.[0]?.path;
    //console.log("path: ",reportImageLocalPath);
    if(!reportImageLocalPath){
        throw new ApiError(400,"report Image path not found")
    }
   
    
    const cloudinaryReportImage=await uploadOnCloudinary(reportImageLocalPath);
    //console.log("url cloudinary",cloudinaryReportImage);
    
    if(!cloudinaryReportImage){
        throw new ApiError(400,"error while uploading error image")
    }
   
//     console.log("🧾 Creating report with:", {
//   reportImage: cloudinaryReportImage.url,
//   title,
//   description,
//   location,
//   owner: req.user?._id
// });
    const newReport= await Report.create({
        reportImage :cloudinaryReportImage.url,
        description,
        location,
        title,
        owner:req.user?._id

    })

    await mailSend({
        to:req.user.email,
        subject:"Report Registration Successfully",
        html: `
           <h2>Hi ${req.user.fullname},</h2>
      <p>Your report has been successfully submitted.</p>
     <p><strong>Location:</strong> ${location}</p>
     <p><strong>Description:</strong> ${description}</p>
     <p>You can track the status of your report from your dashboard.</p>
     <br/>
     <p>Thanks,<br/>City UrbanFixTeam</p>
        `
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, newReport,"Report registered successfully")
    )

    
})

const getAllreports=asyncHandler(async(req,res)=>{
     const reports = await Report.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "All reports fetched"));
})


const getLoggedInUser = asyncHandler(async (req, res) => {
    console.log("started");
    
  const user = await User.findById(req.user?._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User authenticated"));
});


const getSingleReport = asyncHandler(async (req, res) => {

  const { id } = req.params;

  console.log(id);
  

  const report = await Report.findById(id);

  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  return res.status(200).json(new ApiResponse(200, report, "Report fetched successfully"));
});


const getMyReports = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const reports = await Report.find({ owner: userId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "User reports fetched"));
});
const handleContactForm = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // 1. Validate input
  if ([firstName, lastName, email, phone, message].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Attempt sending emails
  try {
    // Send to admin
    await mailSend({
      to: "vikasyaa19@gmail.com",
      subject: `New Contact Inquiry: ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    // Confirmation to user
    await mailSend({
      to: email,
      subject: "Thanks for contacting UrbanFix!",
      html: `
        <h2>Hi ${firstName},</h2>
        <p>Thanks for reaching out to UrbanFix! We’ve received your message and will get back to you shortly.</p>
        <p><strong>Your Message:</strong><br/>${message}</p>
        <br/>
        <p>Best,<br/>UrbanFix Support Team</p>
      `,
    });
  } catch (err) {
    // If email sending fails
    console.error("Email sending failed:", err);
    throw new ApiError(500, "Something went wrong while sending emails. Please try again later.");
  }

  // 3. Respond success
 return res.status(200).json(new ApiResponse(200,null, "sended successfully"));
});











export {registerUser, 
    loginUser,
    logoutUser,
    createReport,
    changePassword,
    getAllreports,
    getLoggedInUser,
    getSingleReport,
    getMyReports,
    handleContactForm
}