
'use client';

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SHOW_ALL_ASSIGNS_API } from '@/config/api';
import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import AssignCardTable from '@/components/AdminComponents/ModifiedAssignedTable';


type HistoryEntry = {
    lead_id: string;
    assignee_name: string;
    updatedAt: string; // or Date
    status: string;
    remarks: string;
};

type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    history: HistoryEntry[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        comments: string,
        location: string,
        alternate_phone: string,
        client_budget: string,
        furnished_status: string,
        interested_project: string,
        lead_status: string,
        lead_type: string,
        preferred_configuration: string,
        preferred_floor: string,
        property_status: string,
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
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
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <h1 className="text-2xl font-bold">Assigned Leads</h1>
                        <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                            <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                                {assigns.length}
                            </span>
                        </div>
                    </div>
                    {/* <AssignedTable  data={assigns} /> */}
                    <AssignCardTable data={assigns}/> 
                </div>
            
            </main>
        </div>
    )
}

export default AssignPage