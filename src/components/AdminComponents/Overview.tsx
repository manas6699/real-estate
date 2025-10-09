'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_LEAD_COUNT, GET_FILTERED_DATA, SHOW_ALL_ASSIGNS_API } from '@/config/api';
import ScheduleTracker from '@/components/AdminComponents/ScheduleTracker';
import { ExternalLink } from 'lucide-react';
import AssignCardTable from './ModifiedAssignedTable';

/* -------------------------------------------------------------------------- */
/*                               🎨 COLOR PALETTE                              */
/* -------------------------------------------------------------------------- */
const COLOR_PALETTE = [
    { bg: 'bg-blue-50', text: 'text-blue-800', ring: 'ring-blue-500' },
    { bg: 'bg-indigo-50', text: 'text-indigo-800', ring: 'ring-indigo-500' },
    { bg: 'bg-green-50', text: 'text-green-800', ring: 'ring-green-500' },
    { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'ring-yellow-500' },
    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-800', ring: 'ring-fuchsia-500' },
    { bg: 'bg-sky-50', text: 'text-sky-800', ring: 'ring-sky-500' },
    { bg: 'bg-red-50', text: 'text-red-800', ring: 'ring-red-500' },
    { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'ring-orange-500' },
    { bg: 'bg-emerald-50', text: 'text-emerald-800', ring: 'ring-emerald-500' },
    { bg: 'bg-purple-50', text: 'text-purple-800', ring: 'ring-purple-500' },
    { bg: 'bg-teal-50', text: 'text-teal-800', ring: 'ring-teal-500' },
    { bg: 'bg-pink-50', text: 'text-pink-800', ring: 'ring-pink-500' },
    { bg: 'bg-slate-50', text: 'text-slate-800', ring: 'ring-slate-500' },
];

/* -------------------------------------------------------------------------- */
/*                                🧱 TYPE DEFINITIONS                          */
/* -------------------------------------------------------------------------- */
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
    updatedAt: string;
};

type Stats = Record<
    | 'totalCount'
    | 'leadCount'
    | 'assignCount'
    | 'callPending'
    | 'siteVisitFixed'
    | 'siteVisitDone'
    | 'hotLeads'
    | 'coldLeads'
    | 'warmLeads'
    | 'booked'
    | 'overdue'
    | 'callBack'
    | 'followUp'
    | 'reassigned',
    number
>;

/* -------------------------------------------------------------------------- */
/*                              🧩 INITIAL STATES                              */
/* -------------------------------------------------------------------------- */
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
    reassigned: 0,
};

/* -------------------------------------------------------------------------- */
/*                               🧠 MAIN COMPONENT           */
/* -------------------------------------------------------------------------- */
export default function Overview() {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('totalCount');
    

    /* ------------------------------ 📊 Fetch Stats ----------------------------- */
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(ALL_LEAD_COUNT);
                if (res.data.success) setStats((prev) => ({ ...prev, ...res.data.counts }));

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
                        if (r.data.success) setStats((prev) => ({ ...prev, [key]: r.data.count }));
                    })
                );
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    /* --------------------------- 🔍 Fetch Assigns Data -------------------------- */
    const fetchAssigns = async (filter: string = '') => {
        try {
            let url = SHOW_ALL_ASSIGNS_API;

            const filters: Record<string, string> = {
                assignCount: GET_FILTERED_DATA,
                hotLeads: `${GET_FILTERED_DATA}?lead_type=Hot`,
                coldLeads: `${GET_FILTERED_DATA}?lead_type=Cold`,
                warmLeads: `${GET_FILTERED_DATA}?lead_type=Warm`,
                callPending: `${GET_FILTERED_DATA}?status=assigned`,
                booked: `${GET_FILTERED_DATA}?lead_status=Booked`,
                siteVisitFixed: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed`,
                siteVisitDone: `${GET_FILTERED_DATA}?lead_status=Site Visit Done`,
                callBack: `${GET_FILTERED_DATA}?lead_status=Call Back`,
                followUp: `${GET_FILTERED_DATA}?lead_status=Under Follow Up`,
                reassigned: `${GET_FILTERED_DATA}?status=reassigned`,
            };

            url = filters[filter] || SHOW_ALL_ASSIGNS_API;

            setSelectedFilter(filter);

            const res = await axios.get(url);
            if (res.data.success) setAssigns([...res.data.data].reverse());
            else setAssigns([]);
        } catch (err) {
            console.error('Error fetching assigns:', err);
            setAssigns([]);
        }
    };

    /* -------------------------- 🚀 Load Assigns Initially ----------------------- */
    useEffect(() => {
        fetchAssigns('totalCount');
    }, []);

    /* -------------------------- 🧮 Lead Status Sections ------------------------- */
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
            { label: 'Reassign Leads', key: 'reassigned' },
        ],
    ];

    /* -------------------------------------------------------------------------- */
    /*                               🖼️ RENDER UI                                 */
    /* -------------------------------------------------------------------------- */
    let colorIndex = 0;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter overflow-x-hidden">
            {/* -------------------------- 🏷️ Page Header -------------------------- */}
            <h1 className="text-2xl text-gray-900 font-black mb-8 border-b-2 border-indigo-200 pb-2">
                Overview
            </h1>

            {/* ------------------------- 📦 Lead Status Cards ------------------------ */}
            {sections.map((group, i) => (
                <section
                    key={i}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 min-w-0"
                >
                    {group.map((item) => {
                        const { bg, text, ring } = COLOR_PALETTE[colorIndex++ % COLOR_PALETTE.length];
                        const isDisabled = item.key === 'leadCount';
                        const isSelected = selectedFilter === item.key;

                        return (
                            <div
                                key={item.key}
                                onClick={() => !isDisabled && fetchAssigns(item.key)}
                                className={`${bg} ${text} rounded-xl p-4 h-28 shadow-xl transition-all duration-300 
                  ${isDisabled ? 'cursor-not-allowed opacity-70' : `cursor-pointer hover:scale-[1.02] hover:shadow-2xl`}
                  ${isSelected ? `ring-4 ${ring} border-4 border-white` : 'border border-transparent'}`}
                            >
                                <div className="text-sm font-semibold text-gray-700">{item.label}</div>
                                <div className="text-lg font-extrabold mt-1">{stats[item.key as keyof Stats]}</div>
                            </div>
                        );
                    })}
                </section>
            ))}

            {/* -------------------------- 📅 Schedule Tracker -------------------------- */}
            <section className="flex flex-col md:flex-row gap-4 mb-8 min-w-0">
                <div className="flex-1 bg-white rounded-xl shadow-2xl p-6 flex items-center gap-6 border-l-8 border-red-500 hover:shadow-red-200 transition-all">
                    <div className="flex-1">
                        <ScheduleTracker />
                        <p className="text-lg text-red-500">Action required immediately</p>
                    </div>

                    <a href="/admin/Dashboard/overdue" aria-label="View overdue tasks">
                        <div className="p-3 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all">
                            <ExternalLink size={28} className="text-white" />
                        </div>
                    </a>
                </div>
            </section>

         
            {/* ------------------------------ 📋 Table -------------------------------- */}
            <div className="w-full overflow-x-auto">
                <AssignCardTable data={assigns} />
            </div>
        </div>
    );
}
