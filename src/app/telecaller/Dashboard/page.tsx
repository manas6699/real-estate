'use client'
import axios from 'axios';
import { GET_LEAD_BY_ID } from '@/config/api';
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/AdminComponents/Navbar'


import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import AssignedLeads from '@/components/TelecallerComponents/AssignedLeads';

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
const TelecallerDashboardPage = () => {
    const [assigns, setAssigns] = useState<Assign[]>([]);

    useEffect(() => {
        const fetchAssigns = async () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                console.error('No user found in localStorage');
                return;
            }

            const user = JSON.parse(storedUser);
            const id = user._id;

            if (!id) {
                console.error('No _id found in user');
                return;
            }

            try {
                const res = await axios.get(GET_LEAD_BY_ID(id));
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
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>

                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <h1 className='text-xl text-gray-700 font-bold mb-4'>
                     Overview
                </h1>
                <section className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Leads</div>
                        <div className="text-2xl font-bold">8121</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Not Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                        <a href="/admin/Dashboard/ManageLeads">Call Pending
                            <div className="text-2xl font-bold">121</div>
                            <div className="text-green-500">↑ 8.5%</div>
                        </a>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Overdue</div>
                        <div className="text-2xl font-bold">11</div>
                        <div className="text-red-500">↓ 8.5%</div>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Leads</div>
                        <div className="text-2xl font-bold">8121</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Not Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Allotted</div>
                        <div className="text-2xl font-bold">521</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                        <a href="/admin/Dashboard/ManageLeads">Call Pending
                            <div className="text-2xl font-bold">121</div>
                            <div className="text-green-500">↑ 8.5%</div>
                        </a>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                        <div className="text-gray-600">Overdue</div>
                        <div className="text-2xl font-bold">11</div>
                        <div className="text-red-500">↓ 8.5%</div>
                    </div>
                </section>

               
                <AssignedLeads  data={assigns} />
                
            </section>
        </>
    )
}

export default TelecallerDashboardPage