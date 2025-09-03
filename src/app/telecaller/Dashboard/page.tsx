
'use client'
import axios from 'axios';
import { GET_LEAD_BY_ID, GET_ALL_LOCATIONS, GET_ALL_PROJECTS, WEB_SOCKET_URL } from '@/config/api';
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/AdminComponents/Navbar'
import { jwtDecode } from 'jwt-decode';
import leadStatuses from '@/options/Leadstatus';
import preferredConfigs from '@/options/PreferedConfig';
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import AssignedLeads from '@/components/TelecallerComponents/AssignedLeads';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import TelecallerOverView from '@/components/TelecallerComponents/TelecallerOverView';

type Location = { _id: string; locationName: string };
type Project = { _id: string; projectName: string };

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
        lead_status: string;
        interested_project: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
};

const TelecallerDashboardPage = () => {
    type Notification = { title: string; message: string };


    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [leadStatus, setLeadStatus] = useState("");
    const [location, setLocation] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [configuration, setConfiguration] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [autoassignedNotifications, setAutoAssignedNotifications] = useState<Notification[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socket, setSocket] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // ✅ Fetch Locations & Projects
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get(GET_ALL_LOCATIONS);
                setLocations(res.data.data || []);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await axios.get(GET_ALL_PROJECTS);
                setProjects(res.data.data || []);
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };

        fetchLocations();
        fetchProjects();
    }, []);

    // socket logic
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

    // token validation logic
        function isTokenValid(token: string) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const decoded: any = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);
                return decoded.exp > currentTime;
            } catch {
                return false;
            }
        }

        // stored user logic
            useEffect(() => {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserId(parsedUser._id);
                }
            }, []);

    // ✅ Fetch Assigns
    useEffect(() => {
        const fetchAssigns = async () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const user = JSON.parse(storedUser);
            const id = user._id;

            try {
                const res = await axios.get(GET_LEAD_BY_ID(id));
                if (res.data && res.data.success) {
                    setAssigns([...res.data.data].reverse());
                }
            } catch (err) {
                console.error("Error fetching assigns:", err);
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
    
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // ✅ Fetch Filtered Data
    const fetchFiltered = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = {};
            if (leadStatus) params.lead_status = leadStatus;
            if (phone) params.phone = phone;
            if (location) params.location = location;
            if (name) params.name = name;
            if (startDate) params.startDate = startDate;
            if (projectName) params.source = projectName;
            if (endDate) params.endDate = endDate;
            if (configuration) params.preferred_configuration = configuration;

            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const user = JSON.parse(storedUser);
            const id = user._id;

            const res = await axios.get(GET_LEAD_BY_ID(id), { params });
            if (res.data && res.data.data) {
                setAssigns(res.data.data);
            }
        } catch (err) {
            console.error("❌ Error fetching filtered assigns:", err);
        }
    };

    const resetFilters = () => {
        setLeadStatus("");
        setPhone("");
        setLocation("");
        setName("");
        setStartDate("");
        setEndDate("");
        setProjectName("");
        setConfiguration("");
        fetchFiltered();
    };

    useEffect(() => {
        fetchFiltered();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadStatus, phone, name, startDate, location, endDate, projectName, configuration]);

    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <TelecallerOverView newLeadCount={assigns.length} />

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-9 gap-4 bg-gray-50 p-4 rounded-lg shadow items-end mb-6">
                    <select
                        value={leadStatus}
                        onChange={(e) => setLeadStatus(e.target.value)}
                        className="border rounded p-2 text-xs"
                    >
                        <option value="">Disposition</option>
                        {leadStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    {/* ✅ Location Dropdown */}
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                            <option key={loc._id} value={loc.locationName}>{loc.locationName}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border p-2 rounded text-xs"
                    />

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded text-xs"
                    />

                    {/* ✅ Project Dropdown */}
                    <select
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">Select Project</option>
                        {projects.map((proj) => (
                            <option key={proj._id} value={proj.projectName}>{proj.projectName}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded text-xs"
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded text-xs"
                    />

                    <select
                        value={configuration}
                        onChange={(e) => setConfiguration(e.target.value)}
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">Select Configuration</option>
                        {preferredConfigs.map((config) => (
                            <option key={config} value={config}>{config}</option>
                        ))}
                    </select>

                    <button
                        onClick={resetFilters}
                        className='bg-red-500 text-white text-xs px-4 py-2 rounded cursor-pointer'
                    >
                        Reset Filter
                    </button>
                </div>

                <AssignedLeads data={assigns} />
                <ToastContainer position="top-right" autoClose={3000} />
            </section>
        </>
    )
};

export default TelecallerDashboardPage;
