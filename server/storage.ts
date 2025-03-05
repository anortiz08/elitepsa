import { IStorage } from "./types";
import { User, InsertUser, Ticket, Article } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tickets: Map<number, Ticket>;
  private articles: Map<number, Article>;
  public sessionStore: session.Store;
  private currentId: { users: number; tickets: number; articles: number };

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.articles = new Map();
    this.currentId = { users: 1, tickets: 1, articles: 1 };
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });

    // Add sample knowledge base articles
    const sampleArticles = [
      {
        id: this.currentId.articles++,
        title: "Getting Started with Customer Support",
        content: `
          <h2>Welcome to Our Customer Support Portal</h2>
          <p>This guide will help you navigate our support system effectively:</p>
          <ul>
            <li>Create a ticket by clicking the "Submit Ticket" button on your dashboard</li>
            <li>Provide a clear title and detailed description of your issue</li>
            <li>Track your ticket status in real-time</li>
            <li>Receive email notifications about updates to your tickets</li>
          </ul>
          <p>Our support team is available 24/7 to assist you with any questions or concerns.</p>
        `,
        createdById: 1,
        createdAt: new Date(),
      },
      {
        id: this.currentId.articles++,
        title: "Common Account Issues & Solutions",
        content: `
          <h2>Troubleshooting Common Account Problems</h2>
          <h3>Password Reset</h3>
          <p>If you've forgotten your password:</p>
          <ol>
            <li>Click on the "Forgot Password" link on the login page</li>
            <li>Enter your registered email address</li>
            <li>Follow the instructions in the reset email</li>
          </ol>
          <h3>Account Security</h3>
          <p>To keep your account secure:</p>
          <ul>
            <li>Use a strong, unique password</li>
            <li>Regularly update your contact information</li>
            <li>Never share your login credentials</li>
          </ul>
        `,
        createdById: 1,
        createdAt: new Date(),
      },
      {
        id: this.currentId.articles++,
        title: "Best Practices for Submitting Support Tickets",
        content: `
          <h2>How to Submit Effective Support Tickets</h2>
          <p>Follow these guidelines to get faster resolution:</p>
          <ol>
            <li><strong>Be Specific</strong>: Clearly describe what you were doing when the issue occurred</li>
            <li><strong>Include Details</strong>: Provide any relevant error messages or screenshots</li>
            <li><strong>One Issue Per Ticket</strong>: Create separate tickets for different issues</li>
            <li><strong>Check Knowledge Base</strong>: Search for existing solutions before creating a ticket</li>
          </ol>
          <p>Including these details helps our support team assist you more efficiently.</p>
        `,
        createdById: 1,
        createdAt: new Date(),
      },
    ];

    sampleArticles.forEach(article => this.articles.set(article.id, article));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAgent: false,
      phoneNumber: insertUser.phoneNumber || null,
      profilePhotoUrl: null
    };
    this.users.set(id, user);
    return user;
  }

  async getTickets(userId?: number): Promise<Ticket[]> {
    const tickets = Array.from(this.tickets.values());
    return userId ? tickets.filter((t) => t.userId === userId) : tickets;
  }

  async createTicket(ticket: Omit<Ticket, "id">): Promise<Ticket> {
    const id = this.currentId.tickets++;
    const newTicket = { ...ticket, id };
    this.tickets.set(id, newTicket);
    return newTicket;
  }

  async updateTicket(id: number, update: Partial<Ticket>): Promise<Ticket> {
    const ticket = this.tickets.get(id);
    if (!ticket) throw new Error("Ticket not found");
    const updated = { ...ticket, ...update };
    this.tickets.set(id, updated);
    return updated;
  }

  async getArticles(query?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    if (query) {
      const lowerQuery = query.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerQuery) ||
          a.content.toLowerCase().includes(lowerQuery)
      );
    }
    return articles;
  }

  async createArticle(article: Omit<Article, "id">): Promise<Article> {
    const id = this.currentId.articles++;
    const newArticle = { ...article, id };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateUser(id: number, update: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...update };
    this.users.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();