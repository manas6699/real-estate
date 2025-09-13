'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {SHOW_ALL_ASSIGNS_API} from '@/config/api'
import Navbar from '@/components/AdminComponents/Navbar';

import Sidebar from '@/components/AdminComponents/Sidebar';
// import Activity from '@/components/AdminComponents/Activity';
// import UserList from '@/components/AdminComponents/UserList';
import Overview from '@/components/AdminComponents/Overview';
import { usePushNotifications } from '@/app/hooks/usePushNotifications';
import AssignedTable from '@/components/AdminComponents/AssignedTable';

type HistoryEntry = {
    lead_id: string;
    assignee_name: string;
    updatedAt: string; // or Date
    status: string;
    remarks: string;
};

type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    history: HistoryEntry[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        comments: string,
        location: string,
        alternate_phone: string,
        client_budget: string,
        furnished_status: string,
        interested_project: string,
        lead_status: string,
        preferred_configuration: string,
        preferred_floor: string,
        property_status: string,
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
};

type JWTPayload = {
    exp: number;
    [key: string]: unknown;
};

const Dashboard = () => {
    const router = useRouter();
     const [assigns, setAssigns] = useState<Assign[]>([]);

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        const fetchAssigns = async () => {
            try {
                const res = await axios.get(SHOW_ALL_ASSIGNS_API);
                console.log('Assigns API Response:', res.data);
                if (res.data && res.data.success) {
                    setAssigns([...res.data.data].reverse());
                }
            } catch (err) {
                console.error('Error fetching assigns:', err);
            }
        };

        fetchAssigns();
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

    usePushNotifications(userId);

    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />

                <div className="flex flex-col md:flex-row flex-1 p-4 gap-4">
                    <div className="flex flex-col flex-1 gap-4">
                        <Overview />
                         <AssignedTable  data={assigns} />
                    </div>
                    {/* <Activity /> */}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
