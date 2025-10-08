'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// ✅ User's original imports are preserved
import { ALL_LEAD_COUNT, GET_FILTERED_DATA, SHOW_ALL_ASSIGNS_API } from '@/config/api';
import ScheduleTracker from '@/components/AdminComponents/ScheduleTracker';
import { ExternalLink } from 'lucide-react';
import AssignCardTable from './ModifiedAssignedTable';

// --- COLOR PALETTE DEFINITION ---
// Diverse, high-contrast palette for visual distinction.
const COLOR_PALETTE = [
    { bg: 'bg-blue-50', text: 'text-blue-800', ring: 'ring-blue-500' },        // Total Leads
    { bg: 'bg-indigo-50', text: 'text-indigo-800', ring: 'ring-indigo-500' },  // Old Leads
    { bg: 'bg-green-50', text: 'text-green-800', ring: 'ring-green-500' },     // New Lead
    { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'ring-yellow-500' },  // Call Pending
    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-800', ring: 'ring-fuchsia-500' },// Site Visit Fixed

    { bg: 'bg-sky-50', text: 'text-sky-800', ring: 'ring-sky-500' },           // Cold Leads
    { bg: 'bg-red-50', text: 'text-red-800', ring: 'ring-red-500' },           // Hot Leads
    { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'ring-orange-500' },  // Warm Leads
    { bg: 'bg-emerald-50', text: 'text-emerald-800', ring: 'ring-emerald-500' },// Booked
    { bg: 'bg-purple-50', text: 'text-purple-800', ring: 'ring-purple-500' },  // Site Visit Done

    { bg: 'bg-teal-50', text: 'text-teal-800', ring: 'ring-teal-500' },        // Call Back
    { bg: 'bg-pink-50', text: 'text-pink-800', ring: 'ring-pink-500' },        // Follow Up
    { bg: 'bg-slate-50', text: 'text-slate-800', ring: 'ring-slate-500' },     // Reassign Leads
];

// --- TYPE DEFINITIONS (UPDATED to include 'reassigned') ---
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
        projectSource: string;
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
    reassigned: number; // ✅ Added this back for consistency
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
    reassigned: 0, // ✅ Added this back for consistency
};

export default function Overview() {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    // Fetch stats (LOGIC UNCHANGED)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Fetch main lead counts
                const res = await axios.get(ALL_LEAD_COUNT);
                if (res.data.success) {
                    setStats((prev) => ({ ...prev, ...res.data.counts }));
                }

                // 2. Fetch counts for specific statuses/types
                const queries = [
                    { key: 'callPending', url: `${GET_FILTERED_DATA}?status=assigned` },
                    { key: 'reassigned', url: `${GET_FILTERED_DATA}?status=reassigned` },
                    { key: 'siteVisitFixed', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed` },
                    { key: 'siteVisitDone', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Done` },
                    { key: 'callBack', url: `${GET_FILTERED_DATA}?lead_status=Call Back` },
                    { key: 'booked', url: `${GET_FILTERED_DATA}?lead_status=Booked` },
                    { key: 'followUp', url: `${GET_FILTERED_DATA}?lead_status=Under Follow Up` },
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

    // Fetch assigns (with optional filters) (LOGIC REFINED/UNCHANGED)
    const fetchAssigns = async (filter: string = '') => {
        try {
            let url = SHOW_ALL_ASSIGNS_API; // Default to showing all assigns

            // Use switch or if/else if for clean URL selection
            if (filter === '') {
                url = SHOW_ALL_ASSIGNS_API;
            } else if (filter === 'assignCount') {
                url = `${GET_FILTERED_DATA}`;
            } else if (filter === 'hotLeads') {
                url = `${GET_FILTERED_DATA}?lead_type=Hot`;
            } else if (filter === 'coldLeads') {
                url = `${GET_FILTERED_DATA}?lead_type=Cold`;
            } else if (filter === 'warmLeads') {
                url = `${GET_FILTERED_DATA}?lead_type=Warm`;
            } else if (filter === 'callPending') {
                url = `${GET_FILTERED_DATA}?status=assigned`;
            } else if (filter === 'booked') {
                url = `${GET_FILTERED_DATA}?lead_status=Booked`;
            } else if (filter === 'siteVisitFixed') {
                url = `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed`;
            } else if (filter === 'siteVisitDone') {
                url = `${GET_FILTERED_DATA}?lead_status=Site Visit Done`;
            } else if (filter === 'callBack') {
                url = `${GET_FILTERED_DATA}?lead_status=Call Back`;
            } else if (filter === 'followUp') {
                url = `${GET_FILTERED_DATA}?lead_status=Under Follow Up`;
            } else if (filter === 'reassigned') {
                url = `${GET_FILTERED_DATA}?status=reassigned`;
            }

            // Set filter state (This was missing in your click handler)
            setSelectedFilter(filter);

            const res = await axios.get(url);
            if (res.data && res.data.success) {
                setAssigns([...res.data.data].reverse());
            } else {
                setAssigns([]);
            }
        } catch (err) {
            console.error('Error fetching assigns:', err);
            setAssigns([]);
        }
    };

    // Load all assigns initially (LOGIC UNCHANGED)
    useEffect(() => {
        // We set 'totalCount' here to ensure the selection highlight works on load
        fetchAssigns('totalCount');
    }, []);

    const sections = [
        [
            { label: 'Total Leads', key: 'totalCount' as keyof Stats },
            { label: 'Old Leads', key: 'leadCount' as keyof Stats },
            { label: 'New Lead', key: 'assignCount' as keyof Stats },
            { label: 'Call Pending', key: 'callPending' as keyof Stats },
            { label: 'Site Visit Fixed', key: 'siteVisitFixed' as keyof Stats },
        ],
        [
            { label: 'Cold Leads', key: 'coldLeads' as keyof Stats },
            { label: 'Hot Leads', key: 'hotLeads' as keyof Stats },
            { label: 'Warm Leads', key: 'warmLeads' as keyof Stats },
            { label: 'Booked', key: 'booked' as keyof Stats },
            { label: 'Site Visit Done', key: 'siteVisitDone' as keyof Stats },
        ],
        [
            { label: 'Call Back', key: 'callBack' as keyof Stats },
            { label: 'Follow Up', key: 'followUp' as keyof Stats },
            { label: 'Reassign Leads', key: 'reassigned' as keyof Stats },
        ],
    ];

    let colorIndex = 0; // Index to cycle through the color palette

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter">
            {/* ENHANCED TITLE STYLE */}
            <h1 className="text-2xl text-gray-900 font-black mb-8 border-b-2 border-indigo-200 pb-2">
                Overview
            </h1>

            {/* Lead Status Cards */}
            {sections.map((group, i) => (
                <section key={i} className="flex flex-col lg:flex-row gap-4 mb-4">
                    {group.map((item) => {
                        // Reset colorIndex if it exceeds the palette length
                        if (colorIndex >= COLOR_PALETTE.length) colorIndex = 0;

                        const { bg, text, ring } = COLOR_PALETTE[colorIndex];
                        colorIndex++; // Increment index for the next tile

                        // Disable filtering only for 'Old Leads'
                        const isDisabled = item.key === 'leadCount';
                        // Added 'totalCount' to the list of clickable filters since it shows all leads
                        const isClickable = !isDisabled && item.key !== 'totalCount';
                        const isSelected = selectedFilter === item.key;

                        // UI UPDATE: Sharper shadow for a premium look
                        const defaultClasses = `${bg} ${text} shadow-xl rounded-xl p-4 flex flex-col justify-between h-28 transition duration-300 ease-in-out`;

                        const interactionClasses = !isClickable
                            ? 'cursor-not-allowed opacity-70 shadow-inner'
                            : `cursor-pointer hover:shadow-2xl hover:scale-[1.02] active:scale-[1.01] ring-opacity-70 hover:ring-4 ${ring}`;

                        const selectionClasses = isSelected
                            // UI UPDATE: Stronger selection highlight
                            ? `ring-4 ${ring} border-4 border-white font-bold transform scale-[1.01] z-10 relative`
                            : 'border border-transparent';

                        return (
                            <div
                                key={item.key}
                                onClick={() => {
                                    // Total Leads is always clickable, Old Leads is disabled
                                    if (item.key === 'totalCount' || isClickable) {
                                        fetchAssigns(item.key);
                                    }
                                }}
                                className={`flex-1 ${defaultClasses} ${interactionClasses} ${selectionClasses}`}
                            >
                                {/* UI UPDATE: Bolder, cleaner label */}
                                <div className={`text-sm font-semibold text-gray-700`}>{item.label}</div>
                                {/* UI UPDATE: Larger, more impactful metric */}
                                <div className="text-2xl font-extrabold leading-none mt-1">
                                    {stats[item.key]}
                                </div>
                            </div>
                        );
                    })}
                </section>
            ))}


            {/* Schedule and Overdue Section */}
            <section className="flex flex-col md:flex-row gap-4 mb-8">
                {/* UI UPDATE: More prominent overdue section */}
                <div className="flex-1 rounded-xl shadow-2xl p-6 flex gap-6 items-center bg-white border-l-8 border-red-500 hover:shadow-red-200 transition duration-300">
                    <div className="flex-1">
                        <ScheduleTracker />
                        
                        <p className="text-lg text-red-500">Action required immediately</p>
                    </div>
                    <a href="/admin/Dashboard/overdue" aria-label="View overdue tasks">
                        {/* UI UPDATE: Larger, more clickable button */}
                        <div className="p-3 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transition duration-300 transform hover:scale-105">
                            <ExternalLink size={28} className='text-white cursor-pointer' />
                        </div>
                    </a>
                </div>
            </section>

            {/* Leads Table Header */}
            <div className="flex items-center mb-6 pt-4 border-t border-gray-300">
                <h2 className="text-2xl font-black text-gray-800 mr-4">
                    Leads in View
                </h2>
                {/* UI UPDATE: Larger, more visible count badge */}
                <div className="rounded-full h-10 w-10 bg-amber-500 shadow-md flex items-center justify-center">
                    <span className="text-base font-extrabold text-white">
                        {assigns.length}
                    </span>
                </div>
                <span className="ml-4 text-lg text-gray-600 font-semibold">
                    &mdash; Currently showing
                    <span className="text-gray-900 font-extrabold ml-1">
                        {selectedFilter ? sections.flat().find(s => s.key === selectedFilter)?.label : 'All Leads'}
                    </span>
                </span>
            </div>

            {/* Leads Table */}
            <AssignCardTable data={assigns} />
        </div>
    );
}
