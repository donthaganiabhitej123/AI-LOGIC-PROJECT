import { Server } from "socket.io";

export const setupUserSocket = (
  io: Server
) => {
  io.on("connection", (socket) => {
    console.log(
      "Socket connected:",
      socket.id
    );

    // ==========================================
    // SOCKET DISCONNECT
    // ==========================================

    socket.on("disconnect", (reason) => {
      console.log(
        "Socket disconnected:",
        socket.id
      );

      console.log(
        "Disconnect reason:",
        reason
      );
    });
  });
};