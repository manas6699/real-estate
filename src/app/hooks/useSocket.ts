"use client";

import { WEB_SOCKET_URL } from "@/config/api";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Define the expected structure of the notification payload
interface NotificationData {
  title: string;
  message: string;
  leadId?: string;
}

// ✅ Add `onNotification` callback parameter
export const useSocket = (
  userId: string | null,
  onNotification: (data: NotificationData) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(WEB_SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("join-room", userId);

    socket.on("lead-assigned", (data: NotificationData) => {
      console.log("📩 Notification:", data);

      // ✅ Use browser Notification API correctly
      if (Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.message,
        });
      }

      onNotification(data); // Callback to update UI
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, onNotification]);

  return socketRef.current;
};
