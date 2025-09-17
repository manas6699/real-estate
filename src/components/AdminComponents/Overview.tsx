'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_LEAD_COUNT, GET_FILTERED_DATA, SHOW_ALL_ASSIGNS_API } from '@/config/api';
import ScheduleTracker from '@/components/AdminComponents/ScheduleTracker';
// import AssignedTable from '@/components/AdminComponents/AssignedTable';
import { ExternalLink } from 'lucide-react';
import AssignCardTable from './ModifiedAssignedTable';

type HistoryEntry = {
    lead_id: string;
    assignee_name: string;
    updatedAt: string;
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
        comments: string;
        location: string;
        alternate_phone: string;
        client_budget: string;
        furnished_status: string;
        interested_project: string;
        lead_status: string;
        lead_type: string;
        preferred_configuration: string;
        preferred_floor: string;
        property_status: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
};

type Stats = {
    totalCount: number;
    leadCount: number;
    assignCount: number;
    callPending: number;
    siteVisitFixed: number;
    siteVisitDone: number;
    hotLeads: number;
    coldLeads: number;
    warmLeads: number;
    booked: number;
    overdue: number;
    callBack: number;
    followUp: number;
};

const initialStats: Stats = {
    totalCount: 0,
    leadCount: 0,
    assignCount: 0,
    callPending: 0,
    siteVisitFixed: 0,
    siteVisitDone: 0,
    hotLeads: 0,
    coldLeads: 0,
    warmLeads: 0,
    booked: 0,
    overdue: 0,
    callBack: 0,
    followUp: 0,
};

export default function Overview() {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>(''); // ✅ track selected filter

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(ALL_LEAD_COUNT);
                if (res.data.success) {
                    setStats((prev) => ({ ...prev, ...res.data.counts }));
                }

                const queries = [
                    { key: 'callPending', url: `${GET_FILTERED_DATA}?status=assigned` },
                    { key: 'siteVisitFixed', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed` },
                    { key: 'siteVisitDone', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Done` },
                    { key: 'callBack', url: `${GET_FILTERED_DATA}?lead_status=Call Back` },
                    { key: 'booked', url: `${GET_FILTERED_DATA}?lead_status=Booked` },
                    { key: 'followUp', url: `${GET_FILTERED_DATA}?lead_status=Follow-Up` },
                    { key: 'hotLeads', url: `${GET_FILTERED_DATA}?lead_type=Hot` },
                    { key: 'coldLeads', url: `${GET_FILTERED_DATA}?lead_type=Cold` },
                    { key: 'warmLeads', url: `${GET_FILTERED_DATA}?lead_type=Warm` },
                ];

                await Promise.all(
                    queries.map(async ({ key, url }) => {
                        const r = await axios.get(url);
                        if (r.data.success) {
                            setStats((prev) => ({ ...prev, [key]: r.data.count }));
                        }
                    })
                );
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Fetch assigns (with optional filters)
    const fetchAssigns = async (filter: string = '') => {
        try {
            let url = SHOW_ALL_ASSIGNS_API;

            // ✅ Apply filters dynamically
            if (filter === 'hotLeads') url = `${GET_FILTERED_DATA}?lead_type=Hot`;
            if (filter === 'coldLeads') url = `${GET_FILTERED_DATA}?lead_type=Cold`;
            if (filter === 'warmLeads') url = `${GET_FILTERED_DATA}?lead_type=Warm`;
            if (filter === 'callPending') url = `${GET_FILTERED_DATA}?status=assigned`;
            if (filter === 'booked') url = `${GET_FILTERED_DATA}?lead_status=Booked`;
            if (filter === 'siteVisitFixed') url = `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed`;
            if (filter === 'siteVisitDone') url = `${GET_FILTERED_DATA}?lead_status=Site Visit Done`;
            if (filter === 'callBack') url = `${GET_FILTERED_DATA}?lead_status=Call Back`;
            if (filter === 'followUp') url = `${GET_FILTERED_DATA}?lead_status=Follow-Up`;

            const res = await axios.get(url);
            if (res.data && res.data.success) {
                setAssigns([...res.data.data].reverse());
            }
        } catch (err) {
            console.error('Error fetching assigns:', err);
        }
    };

    // Load all assigns initially
    useEffect(() => {
        fetchAssigns();
    }, []);

    const sections = [
        [
            { label: 'Total Leads', key: 'totalCount' },
            { label: 'Old Leads', key: 'leadCount' },
            { label: 'New Lead', key: 'assignCount' },
            { label: 'Call Pending', key: 'callPending' },
            { label: 'Site Visit Fixed', key: 'siteVisitFixed' },
        ],
        [
            { label: 'Cold Leads', key: 'coldLeads' },
            { label: 'Hot Leads', key: 'hotLeads' },
            { label: 'Warm Leads', key: 'warmLeads' },
            { label: 'Booked', key: 'booked' },
            { label: 'Site Visit Done', key: 'siteVisitDone' },
        ],
        [
            { label: 'Call Back', key: 'callBack' },
            { label: 'Follow Up', key: 'followUp' },
        ],
    ];

    return (
        <>
            <h1 className="text-2xl text-gray-700 font-bold mb-4">Overview</h1>
            {sections.map((group, i) => (
                <section key={i} className="flex flex-col md:flex-row gap-4 mb-4">
                    {group.map((item) => {
                        const isDisabled =
                            item.key === 'totalCount' ||
                            item.key === 'leadCount' ||
                            item.key === 'assignCount';

                        return (
                            <div
                                key={item.key}
                                onClick={() => {
                                    if (!isDisabled) {
                                        setSelectedFilter(item.key);
                                        fetchAssigns(item.key); // ✅ fetch filtered data only if clickable
                                    }
                                }}
                                className={`flex-1 rounded-lg shadow p-4 flex flex-col transition 
                        ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'} 
                        ${!isDisabled && selectedFilter === item.key ? 'bg-orange-100 ring-2 ring-orange-500' : ''}`}
                            >
                                <div className="text-gray-600">{item.label}</div>
                                <div className="text-2xl font-bold">
                                    {stats[item.key as keyof Stats]}
                                </div>
                            </div>
                        );
                    })}
                </section>
            ))}


            <section className="flex md:flex-row gap-4 mb-4">
                <div className="rounded-lg shadow p-4 flex gap-6 items-center">
                    <ScheduleTracker />
                    <a href="/admin/Dashboard/overdue">

                        <ExternalLink size={30} className='text-blue-500 cursor-pointer' />
                    </a>
                </div>
            </section>
            {/* Header */}
            <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold">Leads</h1>
                <div className="rounded-full h-10 ml-2.5 w-10 border-amber-400 border-4">
                    <span className="text-lg font-extrabold flex items-center justify-center h-full">
                        {assigns.length}
                    </span>
                </div>
            </div>
            {/* <AssignedTable data={assigns} /> */}
            <AssignCardTable data={assigns}/> 
        </>
    );
}
