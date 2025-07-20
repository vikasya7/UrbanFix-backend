import { Router } from "express";
import { changePassword, createReport, getAllreports, getLoggedInUser, getMyReports, getSingleReport, handleContactForm, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router();

router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
console.log("✅ user.routes.js loaded");
try {
    router.get("/test", (req, res) => {
      console.log("Test route hit");
      res.send("Route is working");
    });
} catch (error) {
    console.log("message",error);
    
    
}

// secured routes
router.route("/me").get(verifyJWT,getLoggedInUser)

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").patch(verifyJWT,changePassword)
router.route("/report").post(verifyJWT,upload.array("reportImage"),createReport)
router.route("/all-reports").get(verifyJWT,getAllreports)
router.route("/my-reports").get(verifyJWT, getMyReports);
router.route("/single-report/:id").get(verifyJWT, getSingleReport);
router.route("/contact").post(handleContactForm)

export default router