import { Request, Response } from "express";
import { Server } from "socket.io";

import {
  getFileById,
  getFiles,
  saveFile,
} from "../services/FileService";

// ==========================================
// UPLOAD FILE
// ==========================================

export const uploadFile = async (
  io: Server,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required",
      });

      return;
    }

    const file = req.file;

    const savedFile =
      await saveFile(
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer
      );

    // Backend notification
    io.emit(
      "user-message",
      "File uploaded successfully"
    );

    res.status(201).json({
      success: true,
      message:
        "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error(
      "File upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to upload file",
    });
  }
};

// ==========================================
// GET ALL FILES
// ==========================================

export const getAllFiles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = await getFiles();

    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(
      "Get files error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch files",
    });
  }
};

// ==========================================
// DOWNLOAD FILE
// ==========================================

export const downloadFile = async (
  io: Server,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(
      req.params.id
    );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Valid file ID is required",
      });

      return;
    }

    const file =
      await getFileById(id);

    if (!file) {
      res.status(404).json({
        success: false,
        message:
          "File not found",
      });

      return;
    }

    res.setHeader(
      "Content-Type",
      file.file_type ||
        "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.file_name}"`
    );

    res.setHeader(
      "Content-Length",
      file.file_size
    );

    res.send(
      file.file_data
    );

    // Backend notification
    io.emit(
      "user-message",
      "File downloaded successfully"
    );
  } catch (error) {
    console.error(
      "File download error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to download file",
    });
  }
};