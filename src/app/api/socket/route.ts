import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { createServer } from "http";

let io: Server | null = null;

export async function GET() {
  if (!io) {
    const httpServer = createServer();
    io = new Server(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id);

      socket.on("sendMessage", (message) => {
        io?.emit("messageReceived", message);
      });

      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });
    });
  }

  return NextResponse.json({ status: "Socket.io server running" });
}
