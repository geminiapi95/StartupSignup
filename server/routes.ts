import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { waitlistValidationSchema, adminLoginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import * as crypto from "crypto";

// Simple session management for admin
const SESSION_SECRET = process.env.SESSION_SECRET || "admin-secret-key";
const adminSessions: Record<string, { userId: number; expiresAt: number }> = {};

// Middleware to verify admin authentication
const verifyAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization?.split(" ")[1];
  
  if (!authToken || !adminSessions[authToken] || adminSessions[authToken].expiresAt < Date.now()) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
  
  req.body.adminUserId = adminSessions[authToken].userId;
  next();
};

// Helper to create admin session token
const createAdminSession = (userId: number): string => {
  const token = crypto.randomBytes(32).toString('hex');
  // Session expires in 24 hours
  adminSessions[token] = { 
    userId, 
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 
  };
  return token;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist registration endpoint
  app.post("/api/waitlist/register", async (req, res) => {
    try {
      // Validate request body
      const validatedData = waitlistValidationSchema.parse(req.body);
      
      try {
        // Check if email already exists in the waitlist
        const existingEntry = await storage.getWaitlistEntryByEmail(validatedData.email);
        
        if (existingEntry) {
          return res.status(409).json({
            success: false,
            message: "This email is already registered on our waitlist.",
          });
        }
        
        // Create waitlist entry
        const newEntry = await storage.createWaitlistEntry({
          fullName: validatedData.fullName,
          email: validatedData.email,
        });
        
        // Return success response with the created entry
        return res.status(201).json({
          success: true,
          message: "Successfully added to waitlist!",
          data: newEntry,
        });
      } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to register to the waitlist. Please try again later.",
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details,
        });
      }
      
      console.error("Unexpected error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  });

  // Get waitlist count
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      return res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      console.error("Error fetching waitlist count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch waitlist count.",
      });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      // Validate login data
      const validatedData = adminLoginSchema.parse(req.body);
      
      // Verify admin credentials
      const admin = await storage.verifyAdminUser(
        validatedData.username, 
        validatedData.password
      );
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      
      // Create admin session
      const token = createAdminSession(admin.id);
      
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: admin.id,
          username: admin.username,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details,
        });
      }
      
      console.error("Admin login error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during login. Please try again.",
      });
    }
  });
  
  // Get all waitlist entries (admin only)
  app.get("/api/admin/waitlist", verifyAdminAuth, async (req, res) => {
    try {
      const entries = await storage.getAllWaitlistEntries();
      return res.status(200).json({
        success: true,
        data: entries,
      });
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch waitlist entries.",
      });
    }
  });
  
  // Delete waitlist entry (admin only)
  app.delete("/api/admin/waitlist/:id", verifyAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid entry ID",
        });
      }
      
      await storage.deleteWaitlistEntry(id);
      
      return res.status(200).json({
        success: true,
        message: "Waitlist entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting waitlist entry:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete waitlist entry.",
      });
    }
  });

  // Create admin user (only use for initial setup)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      // Check if there are already any admin users
      const adminExists = await pool.query("SELECT COUNT(*) FROM users WHERE is_admin = true");
      const adminCount = Number(adminExists.rows[0].count);
      
      if (adminCount > 0) {
        return res.status(403).json({
          success: false,
          message: "Admin setup has already been completed",
        });
      }
      
      // Validate request data
      const { username, password } = req.body;
      
      if (!username || !password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Username and strong password (min 6 chars) are required",
        });
      }
      
      // Create admin user
      const admin = await storage.createUser({
        username,
        password,
        isAdmin: true,
      });
      
      return res.status(201).json({
        success: true,
        message: "Admin user created successfully",
        data: {
          id: admin.id,
          username: admin.username,
        },
      });
    } catch (error) {
      console.error("Admin setup error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to setup admin user.",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
