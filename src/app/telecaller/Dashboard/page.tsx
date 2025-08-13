/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import axios from 'axios';
import { GET_LEAD_BY_ID, WEB_SOCKET_URL } from '@/config/api';
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/AdminComponents/Navbar'

import { jwtDecode } from 'jwt-decode';

import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import AssignedLeads from '@/components/TelecallerComponents/AssignedLeads';
// import { usePushNotifications } from '@/app/hooks/usePushNotifications';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// need to seperate out
import io from 'socket.io-client';


type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    history: string[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
};

const TelecallerDashboardPage = () => {
    const [assigns, setAssigns] = useState<Assign[]>([]);
    type Notification = { title: string; message: string };

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [autoassignedNotifications, setAutoAssignedNotifications] = useState<Notification[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId'); // optional, example
        if (!storedToken || !isTokenValid(storedToken)) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
        setUserId(storedUserId);

        // Create socket only here when token is ready
        const newSocket = io(WEB_SOCKET_URL, {
            transports: ["websocket"],
            auth: { token: storedToken }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);


    function isTokenValid(token: string) {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp > currentTime;
        } catch {
            return false;
        }
    }



    // const socket = io(WEB_SOCKET_URL, {
    //     transports: ['websocket'],
    //     auth: {
    //         token: token
    //     },
    //     autoConnect: isTokenValid(token) ? true : false
    // });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        const fetchAssigns = async () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                console.error('No user found in localStorage');
                return;
            }

            const user = JSON.parse(storedUser);
            const id = user._id;

            if (!id) {
                console.error('No _id found in user');
                return;
            }

            try {
                const res = await axios.get(GET_LEAD_BY_ID(id));
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


    // need to seperate out in a hook
    useEffect(() => {
        if (!socket || !userId || !token) return;
        // ✅ Request browser notification permission if needed
        if (Notification.permission === 'default' || Notification.permission === 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Notification permission granted.');
                } else {
                    console.log('❌ Notification permission denied.');
                }
            });
        }

        // ✅ Emit join-room once userId is available
        if (userId) {
            socket.emit('join-room', userId);
            console.log('📡 Emitted join-room with:', userId);
        }

        // ✅ Handle incoming notification
    
        socket.on('lead-assigned', (data: any) => {
            console.log('📥 Lead assigned:', data);

            // 🔔 Native Browser Notification
            if (Notification.permission === 'granted') {
                new Notification(data.title, {
                    body: data.message,
                });
            }

            // 🔥 React Toastify Notification
            toast.info(
                <div>
                    <strong>{data.title}</strong>: {data.message} . Please refresh to view the latest leads.
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => {
                        toast.dismiss()
                        window.location.reload();
                    }}>Reload</button>

                </div>
            );

            // ✅ Update state (optional)
            setNotifications((prev) => [...prev, { title: data.title, message: data.message }]);
        });

        socket.on('lead-auto-assigned', (data: any) => {
            console.log('📥 Lead auto assigned:', data)

            // 🔔 Native Browser Notification
            if (Notification.permission === 'granted') {
                new Notification(data.title, {
                    body: data.message,
                });
            }

            // 🔥 React Toastify Notification
            toast.info(
                <div>
                    <strong>{data.title}</strong>: {data.message} . Please refresh to view the latest leads.
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => {
                        toast.dismiss()
                        window.location.reload();
                    }}>Reload</button>

                </div>
            );

            // ✅ Update state (optional)
            setAutoAssignedNotifications((prev) => [...prev, { title: data.title, message: data.message }]);

        }
        );



        // ✅ Optional: Cleanup on unmount
        return () => {
            socket.off('lead-assigned');
            socket.off('lead-auto-assigned');
        };
    }, [userId, token, socket]);



    return (
        <>
            <TelecallerSidebar />

            <div className='lg:ml-64'>

                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <h1 className='text-xl text-gray-700 font-bold mb-4'>
                    Overview
                </h1>
                <section className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Leads</div>
                        <div className="text-2xl font-bold">8121</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Not Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                        <a href="/admin/Dashboard/ManageLeads">Call Pending
                            <div className="text-2xl font-bold">121</div>
                            <div className="text-green-500">↑ 8.5%</div>
                        </a>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Overdue</div>
                        <div className="text-2xl font-bold">11</div>
                        <div className="text-red-500">↓ 8.5%</div>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Leads</div>
                        <div className="text-2xl font-bold">8121</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Not Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                        <a href="/admin/Dashboard/ManageLeads">Call Pending
                            <div className="text-2xl font-bold">121</div>
                            <div className="text-green-500">↑ 8.5%</div>
                        </a>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Overdue</div>
                        <div className="text-2xl font-bold">11</div>
                        <div className="text-red-500">↓ 8.5%</div>
                    </div>
                </section>


                <AssignedLeads data={assigns} />
                <ToastContainer position="top-right" autoClose={3000} />
            </section>
        </>
    )
}

export default TelecallerDashboardPage