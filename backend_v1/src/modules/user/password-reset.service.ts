import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Request password reset - generate OTP and send email
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return true even if user doesn't exist for security reasons
      return true;
    }

    // Generate OTP token
    const resetToken = generateOTP();
    
    // Set token expiry (1 hour from now)
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Hash the token before saving
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    try {
      // Send email with reset token - catch errors to prevent request failure
      const transporter = createTransporter();
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@parkingapp.com",
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${resetToken}. It will expire in 1 hour.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2>Password Reset</h2>
            <p>You requested a password reset for your Parking Management account.</p>
            <p style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">
              ${resetToken}
            </p>
            <p>This OTP will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email or contact support.</p>
          </div>
        `,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
      console.log("Email sending failed, but OTP was generated:", errorMessage);
      console.log("OTP for debugging purposes (remove in production):", resetToken);
    }

    return true;
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
};

// Verify OTP and reset password
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<boolean> => {
  try {
    // Hash the provided OTP for comparison
    const hashedToken = crypto.createHash("sha256").update(otp).digest("hex");

    // Find user with this email and token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),  // Token must not be expired
        },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return true;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}; 