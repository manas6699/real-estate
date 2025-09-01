'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_LEAD_COUNT, GET_FILTERED_DATA } from '@/config/api';

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // ✅ Fetch grouped counts
                const res = await axios.get(ALL_LEAD_COUNT);
                if (res.data.success) {
                    setStats((prev) => ({ ...prev, ...res.data.counts }));
                }

                // ✅ Dynamic queries
                const queries = [
                    { key: 'callPending', url: `${GET_FILTERED_DATA}?status=assigned` },
                    { key: 'siteVisitFixed', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed` },
                    { key: 'siteVisitDone', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Done` },
                    { key: 'callBack', url: `${GET_FILTERED_DATA}?lead_status=Call Back` },
                    { key: 'followUp', url: `${GET_FILTERED_DATA}?lead_status=Follow-Up` },
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

    // ✅ Group UI cards into sections
    const sections = [
        [
            { label: 'Total Leads', key: 'totalCount' },
            { label: 'Old Leads', key: 'leadCount' },
            { label: 'New Lead', key: 'assignCount' },
            { label: 'Call Pending', key: 'callPending' },
            { label: 'Site Visit Fixed', key: 'siteVisitFixed' },
        ],
        [
            { label: 'Hot Leads', key: 'hotLeads' },
            { label: 'Cold Leads', key: 'coldLeads' },
            { label: 'Warm Leads', key: 'warmLeads' },
            { label: 'Booked', key: 'booked' },
            { label: 'Site Visit Done', key: 'siteVisitDone' },
        ],
        [
            { label: 'Overdue', key: 'overdue' },
            { label: 'Call Back', key: 'callBack' },
            { label: 'Follow Up', key: 'followUp' },
        ],
    ];

    return (
        <>
            <h1 className="text-2xl text-gray-700 font-bold mb-4">Overview</h1>

            {sections.map((group, i) => (
                <section key={i} className="flex flex-col md:flex-row gap-4 mb-4">
                    {group.map((item) => (
                        <div
                            key={item.key}
                            className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col"
                        >
                            <div className="text-gray-600">{item.label}</div>
                            <div className="text-2xl font-bold">{stats[item.key as keyof Stats]}</div>
                        </div>
                    ))}
                </section>
            ))}
        </>
    );
}
