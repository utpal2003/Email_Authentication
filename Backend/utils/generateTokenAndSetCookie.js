import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Function to generate a JWT token and set it as an HTTP-only cookie
export const generateTokenAndSetCookie = (res, userid) => {
    try {
        // Ensure JWT_SECRET is defined in the environment variables
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Generate JWT token with a payload containing the user ID, signed with the secret
        const token = jwt.sign({ userid }, secret, { expiresIn: '7d' });

        // Set the token as a cookie in the response
        res.cookie('token', token, {
            httpOnly: true,                          // Prevents JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: "strict",                      // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days in milliseconds
        });

        console.log("Cookie has been set successfully");
        return token; // Return the token if needed elsewhere
    } catch (error) {
        console.error("Error generating token or setting cookie:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};
