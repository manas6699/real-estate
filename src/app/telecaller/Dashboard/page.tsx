/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
};

const TelecallerDashboardPage = () => {
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

    // ✅ Fetch Filtered Data
    const fetchFiltered = async () => {
        try {
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
