import { users, type User, type InsertUser, waitlist, type Waitlist, type InsertWaitlist } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined>;
  getWaitlistCount(): Promise<number>;
  getAllWaitlistEntries(): Promise<Waitlist[]>;
  deleteWaitlistEntry(id: number): Promise<void>;
  verifyAdminUser(username: string, password: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist> {
    const [waitlistEntry] = await db
      .insert(waitlist)
      .values(entry)
      .returning();
    return waitlistEntry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return entry || undefined;
  }

  async getWaitlistCount(): Promise<number> {
    const entries = await db.select().from(waitlist);
    return entries.length;
  }
  
  async getAllWaitlistEntries(): Promise<Waitlist[]> {
    const entries = await db.select().from(waitlist).orderBy(waitlist.createdAt);
    return entries;
  }
  
  async deleteWaitlistEntry(id: number): Promise<void> {
    await db.delete(waitlist).where(eq(waitlist.id, id));
  }
  
  async verifyAdminUser(username: string, password: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    
    if (user && user.password === password && user.isAdmin) {
      return user;
    }
    
    return undefined;
  }
}

export const storage = new DatabaseStorage();
