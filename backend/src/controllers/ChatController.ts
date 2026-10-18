import { Request, Response } from "express";
import { Server } from "socket.io";

interface ChatRequest {
  message: string;
  receiverSocketId?: string;
}

export const sendChatMessage = (
  io: Server,
  req: Request,
  res: Response
): void => {
  try {
    const {
      message,
      receiverSocketId,
    } = req.body as ChatRequest;

    // Validate message
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Message is required",
      });

      return;
    }

    const cleanMessage =
      message.trim();

    // ==========================================
    // SEND CHAT MESSAGE
    // ==========================================

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "chat-message",
        cleanMessage
      );

      // Backend response
      io.to(receiverSocketId).emit(
        "chat-response",
        "Message received successfully"
      );
    } else {
      io.emit(
        "chat-message",
        cleanMessage
      );

      io.emit(
        "chat-response",
        "How Can I Help You"
      );
    }

    // ==========================================
    // API RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      message:
        "Chat message sent successfully",
    });
  } catch (error) {
    console.error(
      "Chat message error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to send chat message",
    });
  }
};