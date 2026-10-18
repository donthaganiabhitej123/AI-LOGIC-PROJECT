import { Request, Response } from "express";
import { Server } from "socket.io";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../services/UserService";

// ==========================================
// GET USERS
// ==========================================

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ==========================================
// CREATE USER
// ==========================================

export const createNewUser = async (
  io: Server,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, age, password, role = "user" } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      age === undefined ||
      typeof password !== "string" ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Name, email, age and password are required",
      });
      return;
    }

    if (role !== "admin" && role !== "user") {
      res.status(400).json({
        success: false,
        message: "Role must be admin or user",
      });
      return;
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge) || numericAge <= 0) {
      res.status(400).json({
        success: false,
        message: "Age must be a valid positive number",
      });
      return;
    }

    const user = await createUser(
      name.trim(),
      email.trim(),
      numericAge,
      password,
      role
    );

    io.emit("user-message", "User created successfully");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

// ==========================================
// UPDATE USER
// ==========================================

export const updateExistingUser = async (
  io: Server,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, email, age, role } = req.body;
    console.log("UPDATE USER REQUEST:", req.body);
console.log("RECEIVED ROLE:", role);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
      return;
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      age === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Name, email and age are required",
      });
      return;
    }

    if (role !== "admin" && role !== "user") {
      res.status(400).json({
        success: false,
        message: "Role must be admin or user",
      });
      return;
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge) || numericAge <= 0) {
      res.status(400).json({
        success: false,
        message: "Age must be a valid positive number",
      });
      return;
    }

    const user = await updateUser(
      id,
      name.trim(),
      email.trim(),
      numericAge,
      role
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    io.emit("user-message", "User updated successfully");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteExistingUser = async (
  io: Server,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
      return;
    }

    const user = await deleteUser(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    io.emit("user-message", "User deleted successfully");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ==========================================
// GET LOGGED-IN USER DETAILS
// ==========================================

export const getMyDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get my details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your details",
    });
  }
};