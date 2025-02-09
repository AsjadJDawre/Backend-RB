import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer"

// Function to send an email with the OTP
const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // SSL port
        secure: true, // Use SSL/TLS
        auth: {
          user: process.env.MAIL_ID, // Use environment variables for credentials
          pass: process.env.MAIL_PASS, // App-specific password
        },
      });
  
    const mailOptions = {
      from: "your-email@gmail.com", // Replace with your email
      to: email,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
          <h2 style="text-align: center; color: #4CAF50;">Password Reset OTP</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the following OTP to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; background: #f9f9f9; padding: 10px 20px; border-radius: 4px; border: 1px solid #ddd;">${otp}</span>
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,</p>
          <p>Refill-Buddy !</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Controller function to check if a user exists and generate OTP
const checkUserController = async (req, res) => {
  const { email } = req.body;

  console.log(email)
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.find({ email : email });
console.log("thi sis ",user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP (e.g., 6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.updateOne({ email }, { $set: { otp } });

    // Send OTP to the user's email
    console.log(`OTP sent to ${email}: ${otp}`);


    // Send the OTP via email
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "User exists. OTP sent to email." });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// Controller to reset the password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    console.log("Incoming request for password reset:", { email, otp, newPassword }); // Debug log
  
    try {
      // Step 1: Check if all required fields are provided
      if (!email || !otp || !newPassword) {
        console.log("Missing required fields:", { email, otp, newPassword }); // Debug log
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
      }
  
      // Step 2: Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`User not found for email: ${email}`); // Debug log
        return res.status(404).json({ message: "User not found" });
      }
  
    //   console.log("User found:", user); // Debug log
  
      // Step 3: Verify the OTP
      if (user.otp !== otp) {
        console.log(`Invalid OTP for user: ${email}. Provided OTP: ${otp}, Expected OTP: ${user.otp}`); // Debug log
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      console.log("OTP verified successfully"); // Debug log
  
      // Step 4: Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("New password hashed successfully"); // Debug log
  
      // Step 5: Update the password and clear the OTP
      const updateResult = await User.updateOne(
        { email }, // Filter: Find the user by email
        {
          $set: {
            password: hashedPassword, // Update the password
            otp: null,                // Clear the OTP
          },
        }
      );
      
    //   console.log("Password and OTP update result:", updateResult); // Debug log
  
      if (updateResult.nModified === 0) {
        console.log(`Failed to update the password for user: ${email}`); // Debug log
        return res.status(500).json({ message: "Failed to reset password" });
      }
  
      // Step 6: Respond to the client
      console.log("Password reset successfully for user:", email); // Debug log
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error); // Error log
      res.status(500).json({ message: "An error occurred while resetting the password" });
    }
  };

  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  console.log("i hit this route verify Otp ")
    try {
      // Step 1: Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Step 2: Verify the OTP
      if (user.otp === otp) {
        // OTP is valid
        return res.status(200).json({ message: "OTP verified successfully." });
      } else {
        // Invalid OTP
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ message: "An error occurred while verifying OTP." });
    }
  };
  



export {checkUserController,resetPassword,verifyOTP}