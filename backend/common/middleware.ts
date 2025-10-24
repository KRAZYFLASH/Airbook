import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { PrismaClient } from "@prisma/client";
import "./types/auth.types"; // Import global type extensions

const prisma = new PrismaClient();

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

// Error response helper
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any
) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

// Success response helper
export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;

      // Get user from database using userId from token
      const userId = decoded.userId || decoded.id; // Support both old and new token formats
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid token. User not found.",
        });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          message: "Account is deactivated.",
        });
        return;
      }

      // Add user to request with new structure
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: decoded.permissions || [], // Get permissions from token
      };

      next();
    } catch (tokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      // No token, continue without user info
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      const userId = decoded.userId || decoded.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          permissions: decoded.permissions || [],
        };
      }
    } catch (tokenError) {
      // Invalid token, continue without user info
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

// Admin only middleware
export const adminOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
    return;
  }

  next();
};
