"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export type User = {
    _id: string;
    name: string;
    role: string;
    online: boolean;
};

type Props = {
    initialUsers: User[];
};

export default function UserList({ initialUsers }: Props) {
    const [users, setUsers] = useState<User[]>(initialUsers);

    useEffect(() => {
        const socket = io("http://localhost:8000", {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("Admin socket connected");
        });

        socket.on("update-online-status", ({ userId, online }) => {
            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId ? { ...user, online } : user
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">User Status</h2>
            <ul className="space-y-3">
                {users.map((user) => (
                    <li
                        key={user._id}
                        className="flex justify-between items-center p-4 border rounded-lg shadow"
                    >
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                        <span
                            className={`w-3 h-3 rounded-full ${user.online ? "bg-green-500" : "bg-gray-400"
                                }`}
                            title={user.online ? "Online" : "Offline"}
                        ></span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
