'use client';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/SupervisorComponents/Sidebar'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
    GET_ALL_LOCATIONS,
    GET_ALL_TELECALLERS_API,
    GET_FILTERED_DATA,
    SHOW_ALL_ASSIGNS_API,
    GET_ALL_PROJECTS // ✅ make sure this endpoint exists
} from '@/config/api';

import AssignType from '@/types/AssignType'
import ReportTable from '@/components/AdminComponents/ReportTable';

import leadStatuses from '@/options/Leadstatus';
import preferredConfigs from '@/options/PreferedConfig';
import * as XLSX from 'xlsx';
import { FileSliders } from 'lucide-react';

type Location = {
    _id: string;
    locationName: string;
};

type Project = {
    _id: string;
    projectName: string;
};

const ReportPage = () => {
    const [assigns, setAssigns] = useState<AssignType[]>([]);

    // 🔹 Filter States
    const [leadStatus, setLeadStatus] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [configuration, setConfiguration] = useState("");
    const [selectedProject, setSelectedProject] = useState(""); // ✅ project filter
    const [projects, setProjects] = useState<Project[]>([]); // ✅ all projects
    const [user, setUser] = useState("");
    const [telecallers, setTelecallers] = useState<{ id: string; name: string }[]>([]);

    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const allColumns = [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "lead_status", label: "Lead Status" },
        { key: "location", label: "Location" },
        { key: "source", label: "Project" },
        { key: "preferred_configuration", label: "Configuration" },
        { key: "client_budget", label: "Budget" },
        { key: "assignee_name", label: "Telecaller" },
    ];

    // ✅ Default columns
    useEffect(() => {
        setSelectedColumns(["name", "phone", "lead_status"]);
    }, []);

    const handleColumnToggle = (col: string) => {
        setSelectedColumns(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        );
    };

    // ✅ Export only selected columns
    const exportToExcel = () => {
        if (assigns.length === 0 || selectedColumns.length === 0) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = assigns.map((assign: any) => {
            const row: Record<string, string> = {};

            selectedColumns.forEach((colKey) => {
                const col = allColumns.find((c) => c.key === colKey);

                if (!col) return; // skip unknown key

                // Check inside lead_details first, then fallback to assign
                row[col.label] =
                    assign.lead_details?.[colKey] ??
                    assign[colKey] ??
                    "";
            });

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "report.xlsx");
    };

    // 🔹 Fetch telecallers
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(GET_ALL_TELECALLERS_API);
                if (res.data.success) {
                    setTelecallers(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching telecallers:", error);
            }
        };
        fetchUsers();
    }, []);

    // 🔹 Fetch locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get(GET_ALL_LOCATIONS);
                setLocations(res.data.data || []);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
    }, []);

    // 🔹 Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(GET_ALL_PROJECTS);
                setProjects(res.data.data || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    // 🔹 Fetch assigns
    useEffect(() => {
        const fetchAssigns = async () => {
            try {
                const res = await axios.get(SHOW_ALL_ASSIGNS_API);
                if (res.data && res.data.success) {
                    setAssigns([...res.data.data].reverse());
                }
            } catch (err) {
                console.error('Error fetching assigns:', err);
            }
        };
        fetchAssigns();
    }, []);

    // ✅ Fetch Filtered Data
    const fetchFiltered = async () => {
        try {
            const params: Record<string, string> = {};
            if (leadStatus) params.lead_status = leadStatus;
            if (phone) params.phone = phone;
            if (selectedLocation) params.location = selectedLocation;
            if (name) params.name = name;
            if (startDate) params.startDate = startDate;
            if (selectedProject) params.source = selectedProject; // ✅ fixed
            if (endDate) params.endDate = endDate;
            if (configuration) params.preferred_configuration = configuration;
            if (user) params.assignee_name = user;

            const res = await axios.get(GET_FILTERED_DATA, { params });
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
        setSelectedLocation("");
        setName("");
        setStartDate("");
        setEndDate("");
        setSelectedProject(""); // ✅ reset project
        setConfiguration("");
        setUser("");
        fetchFiltered();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchFiltered();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadStatus, phone, name, startDate, selectedLocation, endDate, selectedProject, configuration, user]);

    return (
        <div>

            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 lg:ml-64 p-6 overflow-x-hidden">
                    <Navbar />
                    {/* Header */}
                    <div className="flex mt-4 mb-4">
                        <h1 className="text-2xl font-bold">View Report</h1>
                        <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                            <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                                {assigns.length}
                            </span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg shadow items-end mb-6">
                        <select
                            value={leadStatus}
                            onChange={(e) => setLeadStatus(e.target.value)}
                            className="border rounded p-2 text-xs"
                        >
                            <option value="">Disposition</option>
                            {leadStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        {/* ✅ Location Dropdown */}
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="border p-2 rounded text-xs"
                        >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                                <option key={loc._id} value={loc.locationName}>
                                    {loc.locationName}
                                </option>
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
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="border p-2 rounded text-xs"
                        >
                            <option value="">Select Project</option>
                            {projects.map((proj) => (
                                <option key={proj._id} value={proj.projectName}>
                                    {proj.projectName}
                                </option>
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
                                <option key={config} value={config}>
                                    {config}
                                </option>
                            ))}
                        </select>
                        <select
                            value={configuration}
                            onChange={(e) => setConfiguration(e.target.value)}
                            className="border p-2 rounded text-xs"
                        >
                            <option value="">Assign Mode</option>

                            <option key="Bulk" value="Bulk">
                                Bulk
                            </option>
                            <option key="Atomic" value="Atomic">
                                Atomic
                            </option>

                        </select>

                        <select
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="border rounded p-2 text-xs"
                        >
                            <option value="">Select User</option>
                            {telecallers.map((tc) => (
                                <option key={tc.id} value={tc.name}>
                                    {tc.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={resetFilters}
                            className="bg-red-500 text-white text-xs px-4 py-2 rounded cursor-pointer"
                        >
                            Reset Filter
                        </button>
                    </div>
                    {/* 🔹 Export Section */}
                    <div className="flex items-center space-x-2 mb-5">
                        <button
                            onClick={exportToExcel}
                            className="text border px-4 py-2 flex gap-2 rounded cursor-pointer  text-sm"
                        >
                            <FileSliders size={20} />
                            Export XLSX
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen((prev) => !prev);
                                }}
                                className="border  px-3 py-2 rounded text-sm cursor-pointer"
                            >
                                Select Columns
                            </button>
                            {open && (
                                <div
                                    className="absolute right-0 top-full mt-2 bg-white border shadow-lg rounded p-2 w-56 max-h-60 overflow-y-auto z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {allColumns.map((col) => (
                                        <label
                                            key={col.key}
                                            className="flex items-center space-x-2 text-sm mb-1"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.includes(col.key)}
                                                onChange={() => handleColumnToggle(col.key)}
                                            />
                                            <span>{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <ReportTable data={assigns} />
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
