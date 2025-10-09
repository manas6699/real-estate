'use client';

import axios from 'axios'
import AssignType from '@/types/AssignType'
import React, { useEffect, useState } from 'react'
import { SHOW_ALL_ASSIGNS_API } from '@/config/api';
import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'

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
        <div>
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-x-hidden lg:ml-64 p-6">
                    <Navbar />
                    {/* Header */}
                    <div className="flex">
                        <h1 className="text-2xl font-bold mb-4">View Report</h1>
                    </div>
                    <ReportTable data={assigns} />
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
