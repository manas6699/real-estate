
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
};

const AssignPage = () => {
    const [assigns, setAssigns] = useState<Assign[]>([]);

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
    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-4">
                    
                    <AssignedTable  data={assigns} />
                </div>
            
            </main>
        </div>
    )
}

export default AssignPage