import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Completely passive auth middleware
export const authenticateToken = (req, res, next) => {
  console.log("Auth middleware bypassed");
  // No authentication needed, just continue
  next();
};

// Passive authorization that allows everything
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("Authorization bypassed");
    next();
  };
};