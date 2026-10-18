import { io } from "socket.io-client";

const socket = io(
  "http://localhost:5000",
  {
    withCredentials: true,
  }
);

// ==========================================
// SOCKET CONNECT
// ==========================================

socket.on("connect", () => {
  console.log(
    "Socket connected:",
    socket.id
  );
});

// ==========================================
// SOCKET CONNECTION ERROR
// ==========================================

socket.on(
  "connect_error",
  (error) => {
    console.error(
      "Socket connection error:",
      error.message
    );
  }
);

// ==========================================
// SOCKET DISCONNECT
// ==========================================

socket.on("disconnect", (reason) => {
  console.log(
    "Socket disconnected:",
    reason
  );
});

export default socket;