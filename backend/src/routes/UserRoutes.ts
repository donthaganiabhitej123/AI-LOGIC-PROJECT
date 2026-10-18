
import { Router } from "express";
import { Server } from "socket.io";

import {
  createNewUser,
  deleteExistingUser,
  getAllUsers,
  getMyDetails,
  updateExistingUser,
} from "../controllers/UserController";

import { authenticateToken } from "../middleware/authenticateToken";
import { authorizeRole } from "../middleware/authorizeRole";

const createUserRouter = (io: Server) => {
  const router = Router();
  // Any authenticated user can view their own details
router.get(
  "/me",
  authenticateToken,
  getMyDetails
);

// Only admins can view all users
  router.get(
    "/",
    authenticateToken,
    authorizeRole("admin"),
    getAllUsers
  );

// Only admins can create users
  router.post(
    "/",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => createNewUser(io, req, res)
  );

// Only admins can update users
  router.put(
    "/:id",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => updateExistingUser(io, req, res)
  );

// Only admins can delete users
  router.delete(
    "/:id",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => deleteExistingUser(io, req, res)
  );

  return router;
};


export default createUserRouter;
