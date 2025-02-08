//Using Nodemailer

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your preferred service (e.g., Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export const sender = {
  email: process.env.EMAIL_USER, // Sender email address
  name: "From utpal group of india",
};



/////////////////////////////////////////////
//Using mailtrap
// import { MailtrapClient } from "mailtrap";
// import dotenv from "dotenv";
// dotenv.config();


// export const mailtrapClient = new MailtrapClient({endpoint:process.env.MAILTRAP_ENDPOINT,token:process.env.MAILTRAP_TOKEN});

// export const sender = {
//   email: "hello@demomailtrap.com",
//   name: "Utpal barman",
// };





