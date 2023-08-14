import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const port = process.env.PORT;

io.on("connection", (socket) => {
  io.emit("joined", socket.id);

  socket.on("message", (message) => {
    io.emit("message", { id: socket.id, text: message, time: new Date() });
  });

  socket.on("disconnect", () => {
    io.emit("left", socket.id);
  });
});

app.use(express.static("public"));

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
