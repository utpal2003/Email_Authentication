import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import { generateverificationCode } from "../utils/generateverificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendverificationEmail, sendwelcomeEmail, sendResetPasswordEmail,Resetsuccessemail } from "../mailtrap/email.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    //console.log('JWT_SECRET:', process.env.JWT_SECRET);


    try {
        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password with a salt of 12 rounds
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate a verification code for email verification
        const verificationToken = generateverificationCode();

        // Create a new user instance with hashed password and verification token
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours validity
        });

        // Save the user to the database
        await user.save();

        // Generate JWT token and set it as an HTTP-only cookie
        generateTokenAndSetCookie(res, user._id);
        // send a verification code as a OTP response
        await sendverificationEmail(user.email, verificationToken)


        // Send response excluding sensitive information (like password)
        // console.log("User registered successfully");
        res.status(201).json({
            message: "User registered successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude password in response
                // verificationToken: undefined, // Optional: Exclude verification token
                // verificationTokenExpiresAt: undefined, // Exclude expiration time
            }
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// verify email address
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid verification code" })
        }

        user.isverified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendwelcomeEmail(user.email, user.name);


        res.status(200).json({
            success: true, message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude password in response
            }
        })

    } catch (error) {

    }
}




export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid email or password" });
        }
        const ispassword = await bcrypt.compare(password, user.password);
        if (!ispassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastlogin = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: "User login succesfully",
            user: {

                ...user._doc,
                password: undefined, // Exclude password in response
            }
        })

    } catch (error) {
        res.status(400).json({
            success: fals
            , message: error.message
        })

    }
};



export const logout = async (req, res) => {

    ////////////////////////////////////    
    // export const logoutUser = (res) => {
    try {
        res.clearCookie("token"); // Clear the token cookie
        console.log("Logged out successfully");
        return res.status(200).json({ success: true, message: "Logout successfully" });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred during logout" });
    }
    // };    
    ////////////OR////////////////////////////////
    // try {
    //     // Clear the token cookie by setting its maxAge to 0
    //     res.cookie('token', '', {
    //         httpOnly: true, // Ensure it's still HTTP-only
    //         secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    //         sameSite: "strict", // CSRF protection
    //         expires: new Date(0), // Expire immediately
    //     });
    //     console.log("User logged out successfully");
    //     return res.status(200).json({ message: "Logged out successfully" });
    // } catch (error) {
    //     console.error("Error during logout:", error);
    //     return res.status(500).json({ message: "An error occurred during logout" });
    // }
};



export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "email does not exist" });
        }
        const ResetToken = crypto.randomBytes(20).toString("hex");
        const ResettokenExpire = Date.now() + 1 * 60 * 60 * 1000; // 60 minutes


        user.resetpasswordToken = ResetToken;
        user.resetpasswordTokenExpiresAt = ResettokenExpire;
        await user.save(); // Save the updated user

        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${ResetToken}`);

        res.status(200).json({ success: true, message: "Reset Password link successfully sent to your email" })


    } catch (error) {
        console.log("Error to Reset your password", error);
        res.status(400).json({ success: false, message: error.message });

    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetpasswordToken: token,
            resetpasswordTokenExpiresAt: { $gt: Date.now() }
        })
        if(!user){
            return res.status(400).json({success:false,message:"Invalid or Expire the reset link"})
        }
        // Update the password
        const hashedPassword = await bcrypt.hash(password,12);
        user.password = hashedPassword;
        user.resetpasswordToken = undefined;
        user.resetpasswordTokenExpiresAt = undefined;
        await user.save();

        await Resetsuccessemail(user.email);

        res.status(200).json({success: true,message:"Password reset successfully"})

    } catch (error) {
        console.log("Error to Reset your password", error);
        res.status(400).json({ success: false, message: error.message });

    }
}

export const checkAuth = async(req,res)=>{

    try{
        const user = await User.findOne(req.userId).select("-password")
        // .select("-password") state ment is used for not selecting the password   database
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
       res.status(200).json({success:true,user});


    }catch(error){
        console.error("Error in checkAuth middleware", error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}
