import express from 'express';
import {login, logout, signup,verifyEmail,forgotPassword,resetPassword,checkAuth} from '../controllers/usercontroller.js';
import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/check-auth",verifyToken,checkAuth)

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout);

//end point for login
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);// input the eamil and send a forgot password linl in email
router.post("/reser-password/:token", resetPassword);

export default router;