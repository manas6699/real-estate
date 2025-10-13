'use client'
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import leadStatuses from '@/options/Leadstatus';
import { toast, ToastContainer } from 'react-toastify';

import preferredConfigs from '@/options/PreferedConfig';
import React, { useEffect, useState, useCallback } from 'react' // Import useCallback
import Navbar from '@/components/AdminComponents/Navbar'
import AssignedLeads from '@/components/TelecallerComponents/AssignedLeads';
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import TelecallerOverView from '@/components/TelecallerComponents/TelecallerOverView';
import { GET_LEAD_BY_ID, GET_ALL_LOCATIONS, GET_ALL_PROJECTS, WEB_SOCKET_URL } from '@/config/api';

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
        upload_type: string;
        lead_status: string;
        interested_project: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string
};

const TelecallerDashboardPage = () => {
    type Notification = { title: string; message: string };

    // New state for the total *unfiltered* new leads count
    const [totalNewLeadsCount, setTotalNewLeadsCount] = useState(0);
    // This state holds the *filtered* list for the AssignedLeads component
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
    const [activeTile, setActiveTile] = useState("");
    const [uploadType, setUploadType] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [autoassignedNotifications, setAutoAssignedNotifications] = useState<Notification[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socket, setSocket] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    /* token validation logic */
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

    /* socket logic */
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

    /* stored user logic */
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser._id);
        }
    }, []);

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

    // Function to fetch all leads (unfiltered) and set the total count
    const fetchAllLeadsForCount = useCallback(async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return 0;

        const user = JSON.parse(storedUser);
        const id = user._id;

        try {
            const res = await axios.get(GET_LEAD_BY_ID(id));
            if (res.data && res.data.success) {
                // Assuming 'new leads' are ALL leads assigned to the telecaller,
                // the total count is simply the total number of records returned.
                setTotalNewLeadsCount(res.data.data.length);
            }
        } catch (err) {
            console.error("Error fetching all assigns for count:", err);
            setTotalNewLeadsCount(0);
        }
    }, []);

    // ✅ Initial Fetch Assigns (Now sets the total count and the initial assigns list)
    useEffect(() => {
        // This effect will run ONCE on mount to get the initial list and count.
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const id = user._id;

        const initialFetch = async () => {
            await fetchAllLeadsForCount(); // Get the total count right away
            try {
                const res = await axios.get(GET_LEAD_BY_ID(id));
                if (res.data && res.data.success) {
                    setAssigns([...res.data.data].reverse());
                }
            } catch (err) {
                console.error("Error fetching initial assigns:", err);
            }
        }
        initialFetch();
    }, [fetchAllLeadsForCount]); // Dependency on useCallback

    // socket logic part 2
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


    const buildCallPendingFilter = (activeTile: string) => {
        // If 'callPending' tile is active, filter by top-level 'status: assigned'
        if (activeTile === 'callPending') {
            return { status: 'assigned' };
        }

        if (activeTile === 'scheduleCall') {
            return { status: 'processed' };
        }
        return {};
    };

    // ✅ Fetch Filtered Data
    const fetchFiltered = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = {};

            const primaryFilter = buildCallPendingFilter(activeTile);
            Object.assign(params, primaryFilter);
            const isTopLevelStatusFilter = activeTile === 'callPending' || activeTile === 'scheduleCall';
            const isLeadTypeFilter = ['hot', 'cold', 'warm', 'retry', 'junk'].includes(activeTile);
            if (!isTopLevelStatusFilter && leadStatus) {
                if (isLeadTypeFilter) {
                    params.lead_type = leadStatus; // leadStatus holds the value (e.g., "Hot")
                } else {
                    // Otherwise, apply the filter to the lead_status field.
                    params.lead_status = leadStatus;
                }
            }

            if (phone) params.phone = phone;
            if (location) params.location = location;
            if (name) params.name = name;
            if (startDate) params.startDate = startDate;
            if (projectName) params.source = projectName;
            if (endDate) params.endDate = endDate;
            if (configuration) params.preferred_configuration = configuration;
            if (uploadType) params.upload_type = uploadType;

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
        setUploadType("");
        // No need to manually call fetchFiltered here, the useEffect below handles it
        window.location.reload()
    };

    // This effect runs whenever a filter state changes and updates the 'assigns' list
    useEffect(() => {
        fetchFiltered();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadStatus, phone, name, startDate, uploadType, location, endDate, projectName, configuration]);

    const tileToStatusMap: Record<string, string> = {
        new: "", // empty status filter will show all leads (i.e., new leads)
        SiteVisitFixed: "Site Visit Fixed",
        SiteVisitDone: "Site Visit Done",
        followUp: "Under Follow Up",
        booked: "Booked",
        hot: "Hot",
        cold: "Cold",
        warm: "Warm",
        retry: "Retry",
        junk: "Junk",
        callPending: "assigned",
        scheduleCall: "processed",
        callBack: "Call Back",
    };

    const handleTileClick = (tile: string) => {
        // toggle if clicked same tile again
        if (activeTile === tile) {
            setActiveTile("");
            resetFilters();
            return;
        }

        setActiveTile(tile);

        // Update leadStatus filter based on tile
        const status = tileToStatusMap[tile];
        if (status !== undefined) {
            setLeadStatus(status);
        }
    };

    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                {/* ✅ Change: Pass the TOTAL UNFILTERED count here 
                    This number will not change when filters are applied.
                */}
                <TelecallerOverView
                    newLeadCount={totalNewLeadsCount}
                    onTileClick={handleTileClick}
                    activeTile={activeTile}
                />

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg shadow items-end mb-6">
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
                    {/* ... (Other filter inputs) ... */}
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">Location</option>
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


                    <select
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">Project</option>
                        {projects.map((proj) => (
                            <option key={proj._id} value={proj.projectName}>{proj.projectName}</option>
                        ))}
                    </select>
                    <select
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                        className="border p-2 rounded text-xs"
                    >
                        <option value="">Type</option>
                        <option value="Bulk">Data-Sheet</option>
                        <option value="single">In House</option>
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
                        <option value="">Configuration</option>
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

                {/* Assigned Leads Table: uses the currently filtered 'assigns' list */}
                <AssignedLeads data={assigns} />
                <ToastContainer position="top-right" autoClose={3000} />
            </section>
        </>
    )
};

export default TelecallerDashboardPage;