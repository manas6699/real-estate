
'use client';


import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GET_ALL_TELECALLERS_API, GET_FILTERED_DATA, SHOW_ALL_ASSIGNS_API } from '@/config/api';

import AssignType from '@/types/AssignType'
import ReportTable from '@/components/AdminComponents/ReportTable';

import leadStatuses from '@/options/Leadstatus';
import preferredConfigs from '@/options/PreferedConfig';

const ReportPage = () => {
    const [assigns, setAssigns] = useState<AssignType[]>([]);

        // 🔹 Filter States
        const [leadStatus, setLeadStatus] = useState("");
        const [location , setLocation] = useState("");
        const [phone, setPhone] = useState("");
        const[name , setName] = useState("")
        const [startDate, setStartDate] = useState("");
        const [endDate, setEndDate] = useState("");
        const [configuration , setConfiguration] = useState("");
        const [projectName , setProjectName] = useState("");
        const [user, setUser] = useState("");
        const [telecallers, setTelecallers] = useState<{ id: string; name: string }[]>([]);

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
            if(user) params.assignee_name = user;

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
        setLocation("");
        setName("");
        setStartDate("");
        setEndDate("");
        setProjectName("");
        setConfiguration("");
        setUser("");
        fetchFiltered(); // reload full list without filters
    };

        useEffect(() => {
            fetchFiltered();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [leadStatus, phone, name, startDate, location, endDate, projectName, configuration , user]);

    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />

                <div className="flex-1 p-4">
                {/* Header */}
                <div className='flex'>
                    <h1 className="text-2xl font-bold mb-4">View Report</h1>
                    <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                        <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                            {assigns.length}
                        </span>
                    </div>
                </div>
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

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2 rounded text-xs"
                    />

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
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border p-2 rounded text-xs"
                    />

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
                        className='bg-red-500 text-white text-xs px-4 py-2 rounded cursor-pointer'
                    >
                        Reset Filter
                    </button>
                </div>

                
                    
                    <ReportTable data={assigns} />
                </div>
            
            </main>
        </div>
    )
}

export default ReportPage