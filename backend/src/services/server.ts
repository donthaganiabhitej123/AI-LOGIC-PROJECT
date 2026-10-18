import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectRedis } from "../config/redis";
import sequelize from "../config/sequelize";

import AuthRoutes from "../routes/AuthRoutes";
import createChatRouter from "../routes/ChatRoutes";
import dashboardRoutes from "../routes/dashboardRoutes";
import createFileRouter from "../routes/FileRoutes";
import productRoutes from "../routes/productRoutes";
import sequelizeRoutes from "../routes/sequelizeRoutes";
import createUserRouter from "../routes/UserRoutes";

import { setupUserSocket } from "../socket/userSocket";

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
  "/api/auth",
  AuthRoutes
);

// ==========================================
// HTTP SERVER
// ==========================================

const httpServer =
  http.createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(
  httpServer,
  {
    cors: {
      origin:
        "http://localhost:3000",
      credentials: true,
    },
  }
);

// ==========================================
// USER ROUTES
// ==========================================

app.use(
  "/api/users",
  createUserRouter(io)
);

// ==========================================
// FILE ROUTES
// ==========================================

app.use(
  "/api/files",
  createFileRouter(io)
);

// ==========================================
// CHAT ROUTES
// ==========================================

app.use(
  "/api/chat",
  createChatRouter(io)
);
//

// ==========================================
// SOCKET CONNECTION
// ==========================================

setupUserSocket(io);

// productRoutes
   app.use(
  "/api/products",
  productRoutes
);
// dasboard routes


app.use(
  "/api/dashboard",
  dashboardRoutes
);

// ==========================================
// ROOT
// ==========================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Backend API is running",
    });
  }
);

//sequelize routes
app.use("/api/sequelize", sequelizeRoutes);



// ==========================================
// START SERVER
// ==========================================

const startServer = async (): Promise<void> => {
  try {
    await connectRedis();
     await sequelize.authenticate();
    console.log("Sequelize connected Successfully");
      
    console.log("Redis connected successfully");

    httpServer.listen(PORT, () => {
      console.log("================================");
      console.log(
        `Server running on http://localhost:${PORT}`
      );
      console.log("REST API + Socket.IO started");
      console.log("================================");
    });
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
      console.error("Sequelize connection failed:", error);
    process.exit(1);
  }

};

startServer();