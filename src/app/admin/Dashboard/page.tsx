'use client';

import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/AdminComponents/Navbar';
import Sidebar from '@/components/AdminComponents/Sidebar';
import Overview from '@/components/AdminComponents/Overview';


type JWTPayload = {
    exp: number;
    [key: string]: unknown;
};

const Dashboard = () => {
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    console.log(userId)

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');

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
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                console.error('Token is missing or expired');
                alert('Session expired. Please log in again.');
                router.push('/login');
                return;
            }
        };

        fetchUsers();
    }, [router]);

    return (
        <div>
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col md:flex-row flex-1 gap-4 lg:ml-64 p-6">
                    <div className="flex flex-col flex-1 gap-4">
                        <Navbar />
                        <Overview />
                    </div>
                    {/* <Activity /> */}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
