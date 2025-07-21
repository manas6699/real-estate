
'use client';

import AssignedTable from '@/components/AdminComponents/AssignedTable'
// import LeadTable from '@/components/AdminComponents/LeadTable'
import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SHOW_ALL_ASSIGNS_API } from '@/config/api';

type Assign = {
    _id: string;
    lead_id: string;
    telecaller_id: string;
    telecaller_name: string;
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

const AssignPage = () => {
    const [assigns, setAssigns] = useState<Assign[]>([]);

    useEffect(() => {
        const fetchAssigns = async () => {
            try {
                const res = await axios.get(SHOW_ALL_ASSIGNS_API);
                console.log('Assigns API Response:', res.data);
                if (res.data && res.data.success) {
                    setAssigns(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching assigns:', err);
            }
        };

        fetchAssigns();
    }, []);
    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-4">
                    <div className="flex">

                        <h1 className="text-2xl font-bold mb-4">Assigned Leads</h1>
                        <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                            <text className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                                <span className="text-center">
                                    10
                                </span>
                            </text>
                        </div>
                    </div>
                    <AssignedTable  data={assigns} />
                </div>
            </main>
        </div>
    )
}

export default AssignPage