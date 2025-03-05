import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import express from 'express';
import fs from 'fs';

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Serve uploaded files statically
  app.use("/uploads", express.static("uploads"));

  app.get("/api/tickets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tickets = await storage.getTickets(
      req.user.isAgent ? undefined : req.user.id
    );
    res.json(tickets);
  });

  app.post("/api/tickets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const ticket = await storage.createTicket({
      ...req.body,
      userId: req.user.id,
      status: "open",
      createdAt: new Date(),
    });
    res.json(ticket);
  });

  app.patch("/api/tickets/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAgent) return res.sendStatus(401);
    const ticket = await storage.updateTicket(parseInt(req.params.id), req.body);
    res.json(ticket);
  });

  app.get("/api/articles", async (req, res) => {
    const query = req.query.q as string | undefined;
    const articles = await storage.getArticles(query);
    res.json(articles);
  });

  app.post("/api/articles", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAgent) return res.sendStatus(401);
    const article = await storage.createArticle({
      ...req.body,
      createdById: req.user.id,
      createdAt: new Date(),
    });
    res.json(article);
  });

  app.post("/api/user/profile-photo", upload.single("photo"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).send("No file uploaded");

    const photoUrl = `/uploads/${req.file.filename}`;
    const user = await storage.updateUser(req.user.id, { profilePhotoUrl: photoUrl });
    res.json(user);
  });

  app.patch("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = await storage.updateUser(req.user.id, req.body);
    res.json(user);
  });

  const httpServer = createServer(app);
  return httpServer;
}