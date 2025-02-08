///// Using Nodemailer

import { transporter, sender } from "./mailtrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplate.js";

export const sendverificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });
    console.log("Verification email sent successfully:", response.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendwelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to Our Platform!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
    console.log("Welcome email sent successfully:", response.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendResetPasswordEmail = async (email, resetPassUrl) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetPassUrl),
    });
    console.log("Password reset email sent successfully:", response.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

export const Resetsuccessemail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent successfully:", response.messageId);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
};






























////////////////////////////
//Using mailtrap 
////////////////////////////

// import { mailtrapClient, sender } from "./mailtrap.config.js";
// import { VERIFICATION_EMAIL_TEMPLATE,WELCOME_EMAIL_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE ,PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplate.js";


// export const sendverificationEmail = async (email, verificationToken) => {
//     const recipient = [{ email }];

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Verify Your Email",
//             html: VERIFICATION_EMAIL_TEMPLATE.replace("verificationCode", verificationToken),
//             category: "Email Verification"
//         })
//         console.log("Email sent successfully", response);


//     } catch (error) {
//         console.log("Error to sending verification email", error);
//         throw new Error(`Error to sending verification email:${error}`);

//     }
// }


// export const sendwelcomeEmail = async (email, name) => {
//     const recipient = [{ email }];

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Welcome to Our Platform!",
//             html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
//             category: "Welcome Email"
//         });
//         console.log("Welcome email sent successfully", response);
//     } catch (error) {
//         console.log("Error sending welcome email", error);
//         throw new Error(`Error sending welcome email: ${error}`);
//     }
// };


// export const sendResetPasswordEmail = async(email,resetpassurl)=>{

//     const recipient = [{ email }];
//     try{
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Reset Your password",
//             html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetpassurl),
//         })

//     }catch(error){
//         console.log("Error to sending reset password email", error);
//         throw new Error(`Error sending reset password email:${error}`);

//     }

// };

// export const Resetsuccessemail = async(email)=>{
//     const recipient  = [{ email}];
//     try{
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Reset Your password",
//             html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            
//         })

//     }catch(error){
//         console.log("Error to sending succesful message ", error);
//         throw new Error(`Error sending reset password email:${error}`);

//     }
// }
