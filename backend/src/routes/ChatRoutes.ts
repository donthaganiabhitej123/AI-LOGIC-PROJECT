import { Router } from "express";
import { Server } from "socket.io";

import {
  sendChatMessage,
} from "../controllers/ChatController";

const createChatRouter = (
  io: Server
) => {
  const router = Router();

  // SEND CHAT MESSAGE
  router.post(
    "/message",
    (req, res) => {
      return sendChatMessage(
        io,
        req,
        res
      );
    }
  );

  return router;
};

export default createChatRouter;