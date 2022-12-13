import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import indexRoutes from "./routes/index.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors()); // CORS
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "../client/build")));

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Routes
// app.use("/", indexRoutes);
// app.use("/chat", chatRoutes);
io.on("connection", (socket) => {
  console.log("socket conectado", socket.id);
  io.emit("socket_conectado", "Nuevo socket conectado: " + socket.id + "<br>");

  socket.on("disconnect", () => {
    console.log("socket desconectado", socket.id);
    io.emit("socket_desconectado", {
      texto: "Socket desconectado.",
      id: socket.id,
    });
  });

  socket.on("chat:mensaje", (data) => {
    io.emit("chat:mensaje", data);
  });

  socket.on("chat:escribiendo", (usuario) => {
    socket.broadcast.emit("chat:escribiendo", usuario);
  });
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
});

// app.use((req, res, next) => {
//   res.status(404).json({ message: "Not found" });
// });

export default app;
