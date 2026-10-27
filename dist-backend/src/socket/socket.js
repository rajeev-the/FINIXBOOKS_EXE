import { Server } from "socket.io";

let io = null;

/**
 * Initializes the Socket.IO server with the provided HTTP server.
 * @param {import("http").Server} httpServer
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Allow clients to join a specific company room
    socket.on("join:company", (companyId) => {
      if (companyId) {
        socket.join(`company:${companyId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room company:${companyId}`);
      }
    });

    socket.on("leave:company", (companyId) => {
      if (companyId) {
        socket.leave(`company:${companyId}`);
        console.log(`[Socket.IO] Socket ${socket.id} left room company:${companyId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket.IO] Client disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
};

/**
 * Returns the current Socket.IO instance.
 */
export const getIO = () => {
  return io;
};

/**
 * Emits a structured sync event to all clients or a specific company room.
 * @param {string} event - Event name (e.g., 'sync:log', 'sync:progress', 'sync:complete', 'sync:error')
 * @param {object} payload - Event data payload
 * @param {string} [companyId] - Optional company ID to emit only to the company's room
 */
export const emitSyncEvent = (event, payload, companyId = null) => {
  if (!io) return;

  const data = {
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (companyId) {
    io.to(`company:${companyId}`).emit(event, data);
  }
  // Also emit globally for any general listener
  io.emit(event, data);
};

/**
 * Helper to emit log messages.
 * @param {string} message - Human readable log message
 * @param {object} [meta] - Additional metadata (type, step, count, status, companyId)
 */
export const emitSyncLog = (message, meta = {}) => {
  const { companyId, ...rest } = meta;
  emitSyncEvent(
    "sync:log",
    {
      message,
      level: meta.status === "error" ? "error" : "info",
      ...rest,
    },
    companyId
  );
};

export default {
  initSocket,
  getIO,
  emitSyncEvent,
  emitSyncLog,
};
