'use client';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/SupervisorComponents/Sidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    SHOW_ALL_ASSIGNS_API,
} from '@/config/api';

import AssignType from '@/types/AssignType'
import ReportTable from '@/components/AdminComponents/ReportTable';


const ReportPage = () => {
    const [assigns, setAssigns] = useState<AssignType[]>([]);


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

    return (
        <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 lg:ml-64 p-6 overflow-x-hidden">
                <Navbar />
                {/* Header */}
                <div className="flex mt-4 mb-4">
                    <h1 className="text-2xl font-bold">View Report</h1>
                </div>
                <ReportTable data={assigns} />
            </div>
        </main>
    );
};

export default ReportPage;
