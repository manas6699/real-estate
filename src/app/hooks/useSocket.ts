"use client";

import { WEB_SOCKET_URL } from "@/config/api";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(WEB_SOCKET_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("user-online", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
