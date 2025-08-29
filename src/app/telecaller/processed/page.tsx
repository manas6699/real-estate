'use client'
import axios from 'axios';
import { GET_LEAD_BY_TELECALLER_ID, WEB_SOCKET_URL } from '@/config/api';
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/AdminComponents/Navbar'



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
    createdAt: string;
};

const TelecallerDashboardPage = () => {
    const [assigns, setAssigns] = useState<Assign[]>([]);

    type Notification = { title: string; message: string };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [userId, setUserId] = useState<string | null>(null);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId'); // optional, example

        setToken(storedToken);
        setUserId(storedUserId);

    }, []);


    const socket = io(WEB_SOCKET_URL, {
        transports: ['websocket'],
        auth: {
            token: token
        }
    });

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
                const res = await axios.get(`${GET_LEAD_BY_TELECALLER_ID(id)}?status=processed`);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        // ✅ Optional: Cleanup on unmount
        return () => {
            socket.off('lead-assigned');
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
                    Processed Leads
                </h1>
              
                <AssignedLeads data={assigns} />
                <ToastContainer position="top-right" autoClose={3000} />
            </section>
        </>
    )
}

export default TelecallerDashboardPage