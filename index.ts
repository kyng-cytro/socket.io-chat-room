import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const port = process.env.PORT;

io.on("connection", async (socket) => {
  const users = await io.fetchSockets();
  io.emit("joined", socket.id);
  io.emit("userCount", users.length);
  socket.on("message", (message) => {
    io.emit("message", { id: socket.id, text: message, time: new Date() });
  });

  socket.on("disconnect", async () => {
    const users = await io.fetchSockets();
    io.emit("userCount", users.length);
    io.emit("left", socket.id);
  });
});

app.use(express.static("public"));

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
