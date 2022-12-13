import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "../app.js";
export const getMessage = async (req, res) => {
  try {
    res.status(200).json({ message: "Hola" });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: "Something goes wrong" });
  }
};

export const chat = async (req, res) => {
  try {
    const server = http.createServer(app);
    const io = new SocketServer(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    let users = [];
    let id = 0;
    io.on("connection", (socket) => {
      console.log("socket conectado", socket.id);
      id = socket.id;

      io.emit("socket_conectado", `Nuevo socket conectado: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log("socket desconectado", socket.id);
        io.emit("socket desconectado: ", {
          texo: "Socket desconectado. ",
          id: socket.id,
        });
      });

      socket.on("chat:message", (data) => {
        io.emit("chat:message", data);
      });

      socket.on("chat:escribiendo", (user) => {
        socket.broadcast.emit("chat:escribiendo", user);
      });
    });
    return await res.status(200).json({ message: "Chat connected", id });
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: "Something goes wrong" });
  }
};
