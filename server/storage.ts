import { users, events, rsvps, announcements } from "@shared/schema";
import type { User, InsertUser, Event, RSVP, Announcement } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event operations
  createEvent(event: Omit<Event, "id">): Promise<Event>;
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  
  // RSVP operations
  createRSVP(rsvp: Omit<RSVP, "id">): Promise<RSVP>;
  getRSVPsByEvent(eventId: number): Promise<RSVP[]>;
  getRSVPsByUser(userId: number): Promise<RSVP[]>;
  
  // Announcement operations
  createAnnouncement(announcement: Omit<Announcement, "id">): Promise<Announcement>;
  getAllAnnouncements(): Promise<Announcement[]>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private rsvps: Map<number, RSVP>;
  private announcements: Map<number, Announcement>;
  private currentIds: {
    users: number;
    events: number;
    rsvps: number;
    announcements: number;
  };
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.rsvps = new Map();
    this.announcements = new Map();
    this.currentIds = {
      users: 1,
      events: 1,
      rsvps: 1,
      announcements: 1,
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired entries every day
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const id = this.currentIds.events++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createRSVP(rsvp: Omit<RSVP, "id">): Promise<RSVP> {
    const id = this.currentIds.rsvps++;
    const newRSVP: RSVP = { ...rsvp, id };
    this.rsvps.set(id, newRSVP);
    return newRSVP;
  }

  async getRSVPsByEvent(eventId: number): Promise<RSVP[]> {
    return Array.from(this.rsvps.values()).filter(
      (rsvp) => rsvp.eventId === eventId,
    );
  }

  async getRSVPsByUser(userId: number): Promise<RSVP[]> {
    return Array.from(this.rsvps.values()).filter(
      (rsvp) => rsvp.userId === userId,
    );
  }

  async createAnnouncement(announcement: Omit<Announcement, "id">): Promise<Announcement> {
    const id = this.currentIds.announcements++;
    const newAnnouncement: Announcement = { ...announcement, id };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }
}

export const storage = new MemStorage();
