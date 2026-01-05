'use client'
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
// import leadStatuses from '@/options/Leadstatus';
import { toast, ToastContainer } from 'react-toastify';
// import {subLeadStatuses} from '@/options/Subdispositions';
import { STATUS_MAPPING } from '@/options/StatusMapping'

import preferredConfigs from '@/options/PreferedConfig';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Navbar from '@/components/AdminComponents/Navbar'
import AssignedLeads from '@/components/TelecallerComponents/AssignedLeads';
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import TelecallerOverViewProcessed from '@/components/TelecallerComponents/TelecallerOverviewProcessed';
import {
    GET_LEAD_BY_ID,
    GET_ALL_LOCATIONS,
    GET_ALL_PROJECTS,
    WEB_SOCKET_URL,
} from '@/config/api';
// ✨ Using your specified loader path
import Loader from '@/components/AdminComponents/CreativeLoader';
import { WhatsMyRole } from '@/utils/WhatsMyRole';
import { FileWarning } from 'lucide-react';

type Location = { _id: string; locationName: string };
type Project = { _id: string; projectName: string };

type Assign = {
    // ... (your Assign type definition remains unchanged)
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    dumb_id: string,
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

    // ... (most state variables remain unchanged)
    const [totalNewLeadsCount, setTotalNewLeadsCount] = useState(0);
    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [leadStatus, setLeadStatus] = useState("");
    const [location, setLocation] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [phone, setPhone] = useState("");
    const [idx, setidx] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [configuration, setConfiguration] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeTile, setActiveTile] = useState("");
    const [uploadType, setUploadType] = useState("");
    const [subStatus, setSubStatus] = useState("");

    // ... (notification, socket, user, token states remain unchanged)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [autoassignedNotifications, setAutoAssignedNotifications] = useState<Notification[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [commentNot, setCommentNot] = useState<Notification[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socket, setSocket] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // ✨ CHANGED: Added separate loading state for the overview
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isOverviewLoading, setIsOverviewLoading] = useState(false);

    // ref to track if this is the first render
    const isMounted = useRef(false);

    // =========================================================
    // 🟢 CHANGE 1: RESTORE STATE ON MOUNT
    // =========================================================
    useEffect(() => {
        const restoreState = () => {
            const savedState = sessionStorage.getItem('telecaller_dashboard_state');

            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState);

                    // 1. Restore Filters
                    setLeadStatus(parsed.leadStatus || "");
                    setLocation(parsed.location || "");
                    setPhone(parsed.phone || "");
                    setidx(parsed.idx || "");
                    setName(parsed.name || "");
                    setStartDate(parsed.startDate || "");
                    setEndDate(parsed.endDate || "");
                    setConfiguration(parsed.configuration || "");
                    setProjectName(parsed.projectName || "");
                    setSubStatus(parsed.subStatus || "");
                    setActiveTile(parsed.activeTile || "");
                    setUploadType(parsed.uploadType || "");

                    // 2. Restore Data (Instant Load!)
                    if (parsed.assigns && parsed.assigns.length > 0) {
                        setAssigns(parsed.assigns);
                        setTotalNewLeadsCount(parsed.totalNewLeadsCount || 0);
                        // Disable page loader immediately because we have data
                        setIsPageLoading(false);
                    }
                } catch (e) {
                    console.error("Failed to restore state", e);
                    sessionStorage.removeItem('telecaller_dashboard_state');
                }
            }
        };

        restoreState();
        isMounted.current = true;
    }, []);


    // ✨ NEW: Logic to get filtered Sub-Dispositions based on selected leadStatus (Disposition)
    const getFilteredSubStatuses = useCallback(() => {
        if (!leadStatus) return [];

        // Filter keys where the value's disposition matches the selected leadStatus
        return Object.keys(STATUS_MAPPING).filter(
            (key) => STATUS_MAPPING[key].disposition === leadStatus
        );
    }, [leadStatus]);

    // ✨ NEW: Reset subStatus if it's no longer valid for the new leadStatus
    useEffect(() => {
        const validSubs = getFilteredSubStatuses();
        if (subStatus && !validSubs.includes(subStatus)) {
            setSubStatus("");
        }
    }, [leadStatus, getFilteredSubStatuses, subStatus]);
    // =========================================================
    // 🟢 CHANGE 2: SAVE STATE ON EVERY CHANGE
    // =========================================================
    useEffect(() => {
        // Don't save empty state if we are still loading initially
        if (isPageLoading && assigns.length === 0) return;

        const stateToSave = {
            leadStatus,
            location,
            phone,
            idx,
            name,
            startDate,
            endDate,
            configuration,
            projectName,
            activeTile,
            uploadType,
            subStatus,
            assigns, // We save the table data too!
            totalNewLeadsCount
        };

        sessionStorage.setItem('telecaller_dashboard_state', JSON.stringify(stateToSave));
    }, [
        leadStatus, subStatus, , location, phone, idx, name, startDate, endDate,
        configuration, projectName, activeTile, uploadType, assigns,
        totalNewLeadsCount, isPageLoading
    ]);

    /* token validation logic */
    function isTokenValid(token: string) {
        // ... (function unchanged)
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
        // ... (effect unchanged)
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (!storedToken || !isTokenValid(storedToken)) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
        setUserId(storedUserId);

        const newSocket = io(WEB_SOCKET_URL, {
            auth: { token: storedToken }
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    /* stored user logic */
    useEffect(() => {
        // ... (effect unchanged)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser._id);
        }
    }, []);

    // ✅ Fetch Locations & Projects
    useEffect(() => {
        // ... (effect unchanged)
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

    // =========================================================
    // 🟢 CHANGE 3: MODIFY INITIAL FETCH
    // =========================================================
    // We modify this to NOT show the loader if we already restored data
    const fetchAllLeadsForCount = useCallback(async (currentUploadType: string) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return 0;
        const user = JSON.parse(storedUser);
        const params: { upload_type?: string } = {};
        if (currentUploadType) params.upload_type = currentUploadType;

        try {
            const res = await axios.get(`${GET_LEAD_BY_ID(user._id)}?status=processed`, { params });
            if (res.data?.success) {
                setTotalNewLeadsCount(res.data.data.length);
            }
        } catch (err) { console.error(err); }
    }, []);

    // ✅ Initial Fetch Assigns (Now sets the total count and the initial assigns list)
    useEffect(() => {
        // ... (effect unchanged)
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        const initialFetch = async () => {
            // IF we already have data from SessionStorage, don't show full page loader
            // Just fetch in background to update
            if (assigns.length === 0) {
                setIsPageLoading(true);
            }
            try {
                await fetchAllLeadsForCount("");
                // Only fetch initial list if we don't have active filters
                // If we have filters (restored from storage), the 'fetchFiltered' effect will handle it
                if (!activeTile && !phone && !leadStatus) {
                    const res = await axios.get(GET_LEAD_BY_ID(user._id));
                    if (res.data?.success) {
                        setAssigns([...res.data.data].reverse());
                    }
                }
            } catch (err) {
                console.error("Error fetching initial assigns:", err);
                toast.error("Failed to load initial data.");
            } finally {
                setIsPageLoading(false);
            }
        }
        initialFetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // socket logic part 2
    useEffect(() => {
        // ... (effect unchanged, handles socket.io listeners)
        if (!socket || !userId || !token) return;

        if (Notification.permission === 'default' || Notification.permission === 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Notification permission granted.');
                } else {
                    console.log('❌ Notification permission denied.');
                }
            });
        }

        if (userId) {
            socket.emit('join-room', userId);
            console.log('📡 Emitted join-room with:', userId);
        }


        socket.on('lead-assigned', (data: Notification) => {
            console.log('📥 Lead assigned:', data);
            if (Notification.permission === 'granted') {
                new Notification(data.title, {
                    body: data.message,
                });
            }
            toast.info(
                <div>
                    <strong>{data.title}</strong>: {data.message} . Please refresh to view the latest leads.
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => {
                        toast.dismiss()
                        window.location.reload();
                    }}>Reload</button>
                </div>
            );
            setNotifications((prev) => [...prev, { title: data.title, message: data.message }]);
        });

        socket.on('lead-auto-assigned', (data: Notification) => {
            console.log('📥 Lead auto assigned:', data)
            if (Notification.permission === 'granted') {
                new Notification(data.title, {
                    body: data.message,
                });
            }
            toast.info(
                <div>
                    <strong>{data.title}</strong>: {data.message} . Please refresh to view the latest leads.
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => {
                        toast.dismiss()
                        window.location.reload();
                    }}>Reload</button>
                </div>
            );
            setAutoAssignedNotifications((prev) => [...prev, { title: data.title, message: data.message }]);
        });

        socket.on('comment', (data: Notification) => {
            console.log('📥 New comment received:', data);
            if (Notification.permission === 'granted') {
                new Notification(data.title, {
                    body: data.message,
                });
            }
            toast.info(
                <div>
                    <strong>{data.message}</strong>

                </div>
            );
            setCommentNot((prev) => [...prev, { title: data.title, message: data.message }]);
        });

        return () => {
            socket.off('lead-assigned');
            socket.off('lead-auto-assigned');
            socket.off('comment');
        };
    }, [userId, token, socket]);


    // Helper function to get today's date range
    const getTodayDateRange = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow (end of today)

        return {
            startDate: today.toISOString(),
            endDate: tomorrow.toISOString(),
        };
    };

    // Helper function to get yesterday's date range
    const getYesterdayDateRange = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Start of yesterday

        return {
            startDate: yesterday.toISOString(),
            endDate: today.toISOString(), // End = start of today
        };
    };

    // Helper function to format ISO date string to YYYY-MM-DD
    const formatIsoDate = (isoString: string): string => {
        return isoString.split('T')[0];
    };

    const buildCallPendingFilter = (activeTile: string) => {
        if (activeTile === 'callPending') {
            return { status: 'assigned' };
        }
        if (activeTile === 'scheduleCall') {
            return { status: 'processed' };
        }
        if (activeTile === 'todayProcessed') {
            const todayRange = getTodayDateRange();
            return {
                status: 'processed',
                startDate: todayRange.startDate,
                endDate: todayRange.endDate
            };
        }
        if (activeTile === 'yesterdayProcessed') {
            const yesterdayRange = getYesterdayDateRange();
            return {
                status: 'processed',
                startDate: yesterdayRange.startDate,
                endDate: yesterdayRange.endDate
            };
        }
        if(activeTile == 'newleadsyd'){
            const yesterdayRange = getYesterdayDateRange();
            return {
                startDate: yesterdayRange.startDate,
                endDate: yesterdayRange.endDate
            }
        }
        if (activeTile === 'inProgressToday') {
            const todayRange = getTodayDateRange();
            return {
                lead_status: 'IN Progress',
                schedule_date: formatIsoDate(todayRange.endDate)
            };
        } //
        
        if (activeTile === 'followupToday') {
            const todayRange = getTodayDateRange();
            return {
                lead_status: 'Follow Up',
                schedule_date: formatIsoDate(todayRange.endDate)
            }; // 
        }
        if (activeTile === 'svpushToday') {
            const todayRange = getTodayDateRange();
            return {
                lead_status: 'SV Push',
                startDate: todayRange.startDate,
                endDate: todayRange.endDate
            };
        } //
        if (activeTile === 'unqualifiedtoday') {
            const todayRange = getTodayDateRange();
            return {
                lead_status: 'Unqualified',
                startDate: todayRange.startDate,
                endDate: todayRange.endDate
            };
        } //
        if (activeTile === 'totaltoday') {
            const todayRange = getTodayDateRange();
            return {
                updatedStartDate: todayRange.startDate,
                updatedEndDate: todayRange.endDate
            };
        }

        if (activeTile === 'svpushYesterday') {
            const yesterdayRange = getYesterdayDateRange();
            return {
                lead_status: 'SV Push',
                startDate: yesterdayRange.startDate,
                endDate: yesterdayRange.endDate
            };
        }
        if (activeTile === 'svPushCount') {
            return {
                lead_status: 'SV Push'
            };
        }
        if (activeTile === 'fusv') {
            return {
                lead_status: 'SV Push',
                subdisposition:'SV Fixed'
            };
        }
        if (activeTile === 'svDonepermonth') {
            return {
                lead_status: 'SV Push',
                subdisposition:'Site Visit Done'
            };
        }
        if (activeTile === 'answered') {
            const todayRange = getTodayDateRange();
            return {
                lead_status: ['Follow Up', 'SV Push', 'Unqualified'],
                updatedStartDate: todayRange.startDate,
                updatedEndDate: todayRange.endDate
            };
        }
        if (activeTile === 'notanswered') {
            const todayRange = getTodayDateRange();
            return {
                lead_status: 'IN Progress',
                updatedStartDate: todayRange.startDate,
                updatedEndDate: todayRange.endDate
            };
        }
        if(activeTile === 'untouched'){
            // const todayRange = getTodayDateRange();
            return {
                status: ["assigned" , "auto-assigned"],
                // updatedStartDate: todayRange.startDate,
                // updatedEndDate: todayRange.endDate
            }
        }
        return {};
    };

    // ✅ Fetch Filtered Data
    const fetchFiltered = async () => {
        setIsTableLoading(true); // ✨ This function now *only* manages the table loader
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = {};
            // ... (rest of filter param logic is unchanged)
            const primaryFilter = buildCallPendingFilter(activeTile);
            Object.assign(params, primaryFilter);
            const isTopLevelStatusFilter = activeTile === 'callPending' || activeTile === 'scheduleCall' || activeTile === 'todayProcessed' || activeTile === 'yesterdayProcessed' || activeTile === 'inProgressToday' || activeTile === 'followupToday' || activeTile === 'svpushToday' || activeTile === 'svpushYesterday' || activeTile === 'svPushCount';
            const isLeadTypeFilter = ['hot', 'cold', 'warm', 'retry', 'junk'].includes(activeTile);
            if (!isTopLevelStatusFilter && leadStatus) {
                if (isLeadTypeFilter) {
                    params.lead_type = leadStatus;
                } else {
                    params.lead_status = leadStatus;
                }
            }

            if (phone) params.phone = phone;
            if (idx) params.dumb_id = idx;
            if (location) params.location = location;
            if (name) params.name = name;
            // Only add startDate/endDate if not already set by primaryFilter (e.g., todayProcessed)
            if (startDate && !params.startDate) params.startDate = startDate;
            if (subStatus) params.subdisposition = subStatus;
            if (projectName) params.source = projectName;
            if (endDate && !params.endDate) params.endDate = endDate;
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
            toast.error("Could not apply filters.");
        } finally {
            setIsTableLoading(false); // ✨ Stop table loading
        }
    };

    // ✅ Reset Filters Function (Must clear storage too!)
    const resetFilters = () => {
        sessionStorage.removeItem('telecaller_dashboard_state');
        window.location.reload();
    };

    // ✨ CHANGED: This effect now *only* fetches data for the OVERVIEW
    // when uploadType changes.
    useEffect(() => {
        if (isPageLoading) return; // Don't run on initial load

        const runOverviewFetch = async () => {
            setIsOverviewLoading(true); // ✨ Start overview loader
            try {
                await fetchAllLeadsForCount(uploadType);
            } catch (err) {
                console.error("Error fetching lead count:", err);
                toast.error("Could not update lead count.");
            } finally {
                setIsOverviewLoading(false); // ✨ Stop overview loader
            }
        };
        runOverviewFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadType, isPageLoading]); // Only depends on uploadType

    // ✨ CHANGED: This effect now *only* fetches data for the TABLE
    // when any filter changes.
    useEffect(() => {
        if (isPageLoading) return; // Don't run on initial load

        // fetchFiltered() handles its own isTableLoading state
        fetchFiltered();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTile,
        leadStatus,
        phone,
        idx,
        location,
        name,
        startDate,
        endDate,
        projectName,
        subStatus,
        configuration,
        uploadType, // Table *also* refetches when uploadType changes
        isPageLoading
    ]);

    const tileToStatusMap: Record<string, string> = {
        // ... (map unchanged)
        new: "",
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
        todayProcessed: 'processed',
    };

    const handleTileClick = (tile: string) => {
        if (activeTile === tile) {
            setActiveTile("");
            resetFilters();
            return;
        }

        setActiveTile(tile);

        // Top-level status filters handle their own filtering logic
        const topLevelFilters = ['callPending', 'scheduleCall', 'todayProcessed', 'yesterdayProcessed', 'inProgressToday', 'followupToday', 'svpushToday', 'svpushYesterday', 'svPushCount'];
        if (!topLevelFilters.includes(tile)) {
            const status = tileToStatusMap[tile] ?? null;
            setLeadStatus(status);
        } else {
            // Clear leadStatus for top-level filters since they use status/lead_status param instead
            setLeadStatus("");
        }
    };


    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                {isPageLoading ? (
                    <Loader />
                ) : (
                    <>
                        <h1 className="text-xl text-gray-700 font-bold mb-4">Processed Leads</h1>
                        <div className="flex items-center space-x-3  rounded-lg mb-4">
                            <div className="flex bg-gray-100 rounded-full p-1">
                                {/* ... (All, Data-Sheet, In House buttons are unchanged) ... */}
                                <button
                                    type="button"
                                    onClick={() => setUploadType("")}
                                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${uploadType === ""
                                        ? "bg-pink-500 text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadType("Bulk")}
                                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${uploadType === "Bulk"
                                        ? "bg-pink-500 text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    Data-Sheet
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadType("single")}
                                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${uploadType === "single"
                                        ? "bg-pink-500 text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    In House
                                </button>
                            </div>
                        </div>

                        {/* ✨ CHANGED: Added loader for the overview section */}
                        {isOverviewLoading ? (
                            <div className="py-10"> {/* Added padding for visual spacing */}
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {WhatsMyRole() === "telecaller" ? <>
                                    <TelecallerOverViewProcessed
                                        newLeadCount={totalNewLeadsCount}
                                        onTileClick={handleTileClick}
                                        activeTile={activeTile}
                                        uploadType={uploadType}
                                    />
                                </> : <>Inventory</>}

                            </>
                        )}
                        <p className='bg-amber-200 p-2 text-orange-600 text-xs rounded flex font-bold'>
                            <FileWarning size={15} />
                            Please Select Subdisposition filter after selecting Disposition filter
                        </p>
                        {/* Filters */}
                        <div className="grid grid-cols-1 mt-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg shadow items-end mb-6">
                            {/* ... (all your filter inputs remain unchanged) ... */}
                            <input
                                type="text"
                                placeholder="id"
                                value={idx}
                                onChange={(e) => setidx(e.target.value)}
                                className="border p-2 rounded text-xs"
                            />


                            <select
                                value={leadStatus}
                                onChange={(e) => setLeadStatus(e.target.value)}
                                className="border rounded p-2 text-xs"
                            >
                                <option value="">Select Disposition</option>
                                {/* Get unique disposition values from your JSON mapping */}
                                {Array.from(new Set(Object.values(STATUS_MAPPING).map(v => v.disposition))).map((disp) => (
                                    <option key={disp} value={disp}>{disp}</option>
                                ))}
                            </select>
                            <select
                                value={subStatus}
                                onChange={(e) => setSubStatus(e.target.value)}
                                className="border rounded p-2 text-xs"
                                disabled={!leadStatus} // Disable if no Disposition is selected
                            >
                                <option value="">Select Sub-Disposition</option>
                                {getFilteredSubStatuses().map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
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

                        {/* Assigned Leads Table Loader (Unchanged) */}
                        {isTableLoading ? (
                            <Loader />
                        ) : (
                            <AssignedLeads data={assigns} />
                        )}
                    </>
                )}
                <ToastContainer position="top-right" autoClose={3000} />
            </section>
        </>
    )
};

export default TelecallerDashboardPage;