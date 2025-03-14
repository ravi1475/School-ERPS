import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Shared login handler function to reduce code duplication
async function handleLogin(model, req, res) {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and password are required" 
      });
    }
    
    // Find user by email
    const user = await model.findUnique({
      where: { email }
    });
    
    // If no user found or wrong password
    if (!user) {
      // Don't reveal whether user exists or not for security
      return res.status(401).json({ 
        success: false, 
        error: "Invalid email or password" 
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid email or password" 
      });
    }
    
    // Check if user is inactive
    if (user.status === 'inactive') {
      return res.status(403).json({ 
        success: false, 
        error: "Account is inactive. Please contact administrator." 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role.toLowerCase() 
      }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '24h' }
    );
    
    // Update last login timestamp
    await model.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role.toLowerCase()
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Admin login
router.post('/adminLogin', async (req, res) => {
  return handleLogin(prisma.admin, req, res);
});

// School login
router.post('/schoolLogin', async (req, res) => {
  return handleLogin(prisma.school, req, res);
});

// Teacher login
router.post('/teacherLogin', async (req, res) => {
  return handleLogin(prisma.teacher, req, res);
});

// Export handler for direct route registration
router.handle = (role, req, res) => {
  switch (role) {
    case 'admin': return handleLogin(prisma.admin, req, res);
    case 'school': return handleLogin(prisma.school, req, res);
    case 'teacher': return handleLogin(prisma.teacher, req, res);
    default: return res.status(400).json({ success: false, error: "Invalid role" });
  }
};

export default router;