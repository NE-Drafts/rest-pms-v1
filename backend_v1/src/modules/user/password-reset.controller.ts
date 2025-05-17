import { Request, Response } from 'express';
import * as passwordResetService from './password-reset.service';

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    await passwordResetService.requestPasswordReset(email);
    
    // Always return success for security (even if email doesn't exist)
    res.json({ 
      success: true, 
      message: 'If your email is registered, you will receive a password reset OTP shortly' 
    });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

// Reset password with OTP
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const success = await passwordResetService.resetPassword(email, otp, newPassword);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Password has been reset successfully' 
      });
    } else {
      res.status(400).json({ error: 'Failed to reset password' });
    }
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to reset password' });
  }
}; 