import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { waitlistValidationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);

  return httpServer;
}
