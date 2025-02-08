import express from 'express';
import {connectDB} from './connect.js';
import authRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;


// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// MongoDB connection
connectDB("mongodb://localhost:27017/Mail_auth")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

  
// MIddleware
// allows us to parse JSON request bodies
app.use(express.json()); // allows us to parse incoming JSON requests from req.body
app.use(cookieParser()); // allows us to parse cookies
// app.use(express.urlencoded({ extended: false }));

// Routes

app.use("/api/auth",authRoutes);







app.listen(port, () => {
  console.log("Server is running on port ",port);
});
