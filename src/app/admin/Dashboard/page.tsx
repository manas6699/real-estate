'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SHOW_ALL_USERS_API } from '@/config/api';
import Navbar from '@/components/AdminComponents/Navbar';

import Sidebar from '@/components/AdminComponents/Sidebar';
import UserList from '@/components/AdminComponents/UserList';
import Activity from '@/components/AdminComponents/Activity';

import Overview from '@/components/AdminComponents/Overview';
import UsersTable from '@/components/AdminComponents/UsersTable';
import { usePushNotifications } from '@/app/hooks/usePushNotifications';

type User = {
    _id: string;
    name: string;
    role: string;
    online: boolean;
    password: string;
    phone?: string;
    createdAt?: string;
};

type JWTPayload = {
    exp: number;
    [key: string]: unknown;
};

const Dashboard = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get<{ [key: string]: Omit<User, '_id'> }>(
                   SHOW_ALL_USERS_API,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data) {
                    const usersArray: User[] = Object.entries(res.data).map(
                        ([id, user]) => ({
                            _id: id,
                            ...user, // ✅ Now TS knows user is an object
                        })
                    );

                    setUsers(usersArray);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            let isTokenExpired = false;

            if (token) {
                try {
                    const decoded: JWTPayload = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // in seconds
                    if (decoded.exp < currentTime) {
                        isTokenExpired = true;
                    }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    isTokenExpired = true; // If decoding fails, treat as expired
                }
            }

            if (!token || isTokenExpired) {
                router.push('/login');
                return;
            }

  
        };

        fetchUsers();
    }, [router]);

    usePushNotifications(userId);

    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />

                <div className="flex flex-col md:flex-row flex-1 p-4 gap-4">
                    <div className="flex flex-col flex-1 gap-4">
                        <Overview />
                        <UserList/>
                        <UsersTable data={users} />
                    </div>
                    <Activity />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
