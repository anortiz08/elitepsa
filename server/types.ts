import { User, InsertUser, Ticket, Article } from "@shared/schema";
import { Store } from "express-session";

export interface IStorage {
  sessionStore: Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTickets(userId?: number): Promise<Ticket[]>;
  createTicket(ticket: Omit<Ticket, "id">): Promise<Ticket>;
  updateTicket(id: number, update: Partial<Ticket>): Promise<Ticket>;
  getArticles(query?: string): Promise<Article[]>;
  createArticle(article: Omit<Article, "id">): Promise<Article>;
  updateUser(id: number, update: Partial<User>): Promise<User>;
}