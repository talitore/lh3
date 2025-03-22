import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertEventSchema, insertRsvpSchema, insertAnnouncementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).send("Only admins can create events");
    }

    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({
        ...eventData,
        createdBy: req.user.id,
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // RSVPs
  app.post("/api/events/:eventId/rsvp", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Login required");
    }

    try {
      const rsvpData = insertRsvpSchema.parse({
        ...req.body,
        eventId: parseInt(req.params.eventId),
        userId: req.user.id,
      });
      const rsvp = await storage.createRSVP(rsvpData);
      res.status(201).json(rsvp);
    } catch (error) {
      res.status(400).json({ error: "Invalid RSVP data" });
    }
  });

  app.get("/api/events/:eventId/rsvps", async (req, res) => {
    const rsvps = await storage.getRSVPsByEvent(parseInt(req.params.eventId));
    res.json(rsvps);
  });

  // Announcements
  app.get("/api/announcements", async (req, res) => {
    const announcements = await storage.getAllAnnouncements();
    res.json(announcements);
  });

  app.post("/api/announcements", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).send("Only admins can create announcements");
    }

    try {
      const announcementData = insertAnnouncementSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Invalid announcement data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
