"use client";
import React, { useEffect, useState } from 'react';
import { Users, UserPlus } from "lucide-react";
import { GET_ALL_LEADS } from '../config/api';
import axios from 'axios';

type Lead = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    createdAt: string;
};

const LeadCards = () => {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const res = await axios.get(GET_ALL_LEADS,{
                    withCredentials: true
                });
                if (Array.isArray(res.data.leads)) {
                    setLeads(res.data.leads);
                } else {
                    throw new Error('Invalid data format from server.');
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                alert(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Something went wrong while fetching leads.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const today = new Date().toISOString().slice(0, 10);
    const todayLeads = leads.filter((lead) => lead.createdAt?.startsWith(today));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {/* Total Leads */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
                    <p className={`text-2xl font-bold ${loading ? 'animate-pulse bg-gray-200 rounded w-16 h-6' : 'text-gray-900'}`}>
                        {loading ? '' : leads.length}
                    </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="text-blue-600 w-6 h-6" />
                </div>
            </div>

            {/* Total Leads Today */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Leads Today</h3>
                    <p className={`text-2xl font-bold ${loading ? 'animate-pulse bg-gray-200 rounded w-16 h-6' : 'text-gray-900'}`}>
                        {loading ? '' : todayLeads.length}
                    </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                    <UserPlus className="text-green-600 w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default LeadCards;
