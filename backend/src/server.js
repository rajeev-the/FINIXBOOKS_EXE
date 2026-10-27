import http from "http";
import { initSocket } from "./socket/socket.js";

/**
 * Creates and starts the HTTP server with Socket.IO attached.
 * @param {import("express").Express} app - The Express application instance
 * @param {number|string} port - The port number to listen on
 * @returns {import("http").Server} The running HTTP server instance
 */
export const startServer = (app, port = 3001) => {
  try {
    const server = http.createServer(app);

    // Initialize Socket.IO
    initSocket(server);

    server.listen(port, "127.0.0.1", () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use by another process!`);
      } else {
        console.error("Failed to start the server:", error.message);
      }
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
};

export default startServer;
