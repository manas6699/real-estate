'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
    ALL_LEAD_COUNT,
    GET_FILTERED_DATA,
    SHOW_ALL_ASSIGNS_API,
} from '@/config/api';
import ScheduleTracker from '@/components/AdminComponents/ScheduleTracker';
import { ExternalLink } from 'lucide-react';
import AssignCardTable from './ModifiedAssignedTable';
import DayEndReport from '@/components/AdminComponents/DayEndReport';

const COLOR_PALETTE = [
    { bg: 'bg-rose-50', text: 'text-rose-800', ring: 'ring-rose-500' },
    { bg: 'bg-amber-50', text: 'text-amber-800', ring: 'ring-amber-500' },
    { bg: 'bg-lime-50', text: 'text-lime-800', ring: 'ring-lime-500' },
    { bg: 'bg-cyan-50', text: 'text-cyan-800', ring: 'ring-cyan-500' },
    { bg: 'bg-violet-50', text: 'text-violet-800', ring: 'ring-violet-500' },
    { bg: 'bg-emerald-50', text: 'text-emerald-800', ring: 'ring-emerald-500' },
    { bg: 'bg-indigo-50', text: 'text-indigo-800', ring: 'ring-indigo-500' },
    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-800', ring: 'ring-fuchsia-500' },
    { bg: 'bg-teal-50', text: 'text-teal-800', ring: 'ring-teal-500' },
    { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'ring-orange-500' },
    { bg: 'bg-sky-50', text: 'text-sky-800', ring: 'ring-sky-500' },
    { bg: 'bg-purple-50', text: 'text-purple-800', ring: 'ring-purple-500' },
    { bg: 'bg-pink-50', text: 'text-pink-800', ring: 'ring-pink-500' },
    { bg: 'bg-pink-50', text: 'text-pink-800', ring: 'ring-pink-500' },
    { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'ring-yellow-500' },
    { bg: 'bg-blue-50', text: 'text-blue-800', ring: 'ring-blue-500' },
];

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
        upload_type: string;
        upload_by: string;
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
    | 'junkLeads'
    | 'retryLeads'
    | 'booked'
    | 'overdue'
    | 'callBack'
    | 'followUp'
    | 'reassigned'
    | 'meta'
    | 'leadToday'
    | 'callToday',
    number
>;

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
    junkLeads: 0,
    retryLeads: 0,
    booked: 0,
    overdue: 0,
    callBack: 0,
    followUp: 0,
    reassigned: 0,
    meta:0,
    leadToday: 0,
    callToday: 0
};

export default function Overview() {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('totalCount');
    const [uploadType, setUploadType] = useState<string>('all');

    /* --------------------------- 🔍 Fetch Assigns Data -------------------------- */
    const fetchAssigns = useCallback(
        async (filter: string = '', uploadTypeParam: string = uploadType) => {
            try {
                let url = SHOW_ALL_ASSIGNS_API;

                const today = new Date();
                const startOfDay = new Date(today.setHours(23, 59, 59, 999));
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));
                const formatDate = (date: Date) => date.toISOString().split('T')[0];

                const filters: Record<string, string> = {
                    assignCount: GET_FILTERED_DATA,
                    hotLeads: `${GET_FILTERED_DATA}?lead_type=Hot`,
                    coldLeads: `${GET_FILTERED_DATA}?lead_type=Cold`,
                    warmLeads: `${GET_FILTERED_DATA}?lead_type=Warm`,
                    junkLeads: `${GET_FILTERED_DATA}?lead_type=Junk`,
                    retryLeads: `${GET_FILTERED_DATA}?lead_type=Retry`,
                    callPending: `${GET_FILTERED_DATA}?status=assigned`,
                    booked: `${GET_FILTERED_DATA}?lead_status=Booked`,
                    siteVisitFixed: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed`,
                    siteVisitDone: `${GET_FILTERED_DATA}?lead_status=Site Visit Done`,
                    callBack: `${GET_FILTERED_DATA}?lead_status=Call Back`,
                    followUp: `${GET_FILTERED_DATA}?lead_status=Under Follow Up`,
                    reassigned: `${GET_FILTERED_DATA}?status=reassigned`,
                    meta: `${GET_FILTERED_DATA}?projectSource=Meta-Mmr`,
                    leadToday: `${GET_FILTERED_DATA}?startDate=${formatDate(startOfDay)}&endDate=${formatDate(endOfDay)}`,
                    callToday: `${GET_FILTERED_DATA}?updatedStartDate=${formatDate(startOfDay)}&updatedEndDate=${formatDate(endOfDay)}`,
                };

                url = filters[filter] || SHOW_ALL_ASSIGNS_API;

                if (uploadTypeParam !== 'all') {
                    const connector = url.includes('?') ? '&' : '?';
                    url = `${url}${connector}upload_type=${uploadTypeParam}`;
                }

                setSelectedFilter(filter);
                const res = await axios.get(url);
                if (res.data.success) setAssigns([...res.data.data].reverse());
                else setAssigns([]);
            } catch (err) {
                console.error('Error fetching assigns:', err);
                setAssigns([]);
            }
        },
        [uploadType]
    );

    /* --------------------------- 📊 Fetch Stats Data --------------------------- */
    const fetchStats = useCallback(
        async (uploadTypeParam: string = uploadType) => {
            try {
                const uploadQuery =
                    uploadTypeParam !== 'all' ? `?upload_type=${uploadTypeParam}` : '';

                const res = await axios.get(`${ALL_LEAD_COUNT}${uploadQuery}`);
                if (res.data.success)
                    setStats((prev) => ({ ...prev, ...res.data.counts }));

                const today = new Date();
                const startOfDay = new Date(today.setHours(23, 59, 59, 999));
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));
                const formatDate = (date: Date) => date.toISOString().split('T')[0];

                const queries = [
                    { key: 'assignCount', url: `${GET_FILTERED_DATA}` },
                    { key: 'leadToday', url: `${GET_FILTERED_DATA}?startDate=${formatDate(startOfDay)}&endDate=${formatDate(endOfDay)}` },
                    { key: 'callToday', url: `${GET_FILTERED_DATA}?updatedStartDate=${formatDate(startOfDay)}&updatedEndDate=${formatDate(endOfDay)}` },
                    { key: 'callPending', url: `${GET_FILTERED_DATA}?status=assigned` },
                    { key: 'reassigned', url: `${GET_FILTERED_DATA}?status=reassigned` },
                    { key: 'siteVisitFixed', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed` },
                    { key: 'siteVisitDone', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Done` },
                    { key: 'callBack', url: `${GET_FILTERED_DATA}?lead_status=Call Back` },
                    { key: 'booked', url: `${GET_FILTERED_DATA}?lead_status=Booked` },
                    { key: 'followUp', url: `${GET_FILTERED_DATA}?lead_status=Under Follow Up` },
                    { key: 'hotLeads', url: `${GET_FILTERED_DATA}?lead_type=Hot` },
                    { key: 'meta', url: `${GET_FILTERED_DATA}?projectSource=Meta-Mmr` },
                    { key: 'coldLeads', url: `${GET_FILTERED_DATA}?lead_type=Cold` },
                    { key: 'warmLeads', url: `${GET_FILTERED_DATA}?lead_type=Warm` },
                    { key: 'retryLeads', url: `${GET_FILTERED_DATA}?lead_type=Retry` },
                    { key: 'junkLeads', url: `${GET_FILTERED_DATA}?lead_type=Junk` },
                ];

                await Promise.all(
                    queries.map(async ({ key, url }) => {
                        const connector = url.includes('?') ? '&' : '?';
                        const fullUrl =
                            uploadTypeParam !== 'all'
                                ? `${url}${connector}upload_type=${uploadTypeParam}`
                                : url;
                        const r = await axios.get(fullUrl);
                        if (r.data.success)
                            setStats((prev) => ({ ...prev, [key]: r.data.count }));
                    })
                );
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        },
        [uploadType]
    );

    /* --------------------------- ⚙️ Auto Fetch --------------------------- */
    useEffect(() => {
        fetchStats(uploadType);
        fetchAssigns('totalCount', uploadType);
    }, [fetchAssigns, fetchStats, uploadType]);

    /* --------------------------- 🧩 Card Sections --------------------------- */
    const sections = [
        [
            { label: 'Total Leads', key: 'assignCount' },
            { label: 'Today Leads', key: 'leadToday' },
            { label: 'Call Pending', key: 'callPending' },
            { label: 'Today Calls', key: 'callToday' },
            { label: 'Site Visit Fixed', key: 'siteVisitFixed' }
        ],
        [
            { label: 'Cold', key: 'coldLeads' },
            { label: 'Hot', key: 'hotLeads' },
            { label: 'Warm', key: 'warmLeads' },
            { label: 'Junk', key: 'junkLeads' },
            { label: 'Retry', key: 'retryLeads' }
        ],
        [
            { label: 'Booked', key: 'booked' },
            { label: 'Site Visit Done', key: 'siteVisitDone' },
            { label: 'Call Back', key: 'callBack' },
            { label: 'Follow Up', key: 'followUp' },
            { label: 'Reassign Leads', key: 'reassigned' }
        ],
        [
            { label: ' Meta', key: 'meta' },
            { label: ' Magickbricks', key: 'c' },
            { label: ' Housing', key: 'k' },
            { label: ' 99 Acers', key: 'x' },
            { label: ' Others', key: 'y' }
        ],
    ];

    let colorIndex = 0;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter overflow-x-hidden">
         
            <DayEndReport />

            {/* ------------------- 🔘 Upload Type Buttons ------------------- */}
            <div className="flex items-center space-x-3 rounded-lg mb-4">
                <div className="flex bg-white shadow-2xl rounded-full p-1">
                    {['all', 'single', 'Bulk'].map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setUploadType(type);
                                fetchAssigns(selectedFilter, type);
                                fetchStats(type);
                            }}
                            className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${uploadType === type
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {type === 'all'
                                ? 'All'
                                : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* ------------------------- 📦 Lead Status Cards ------------------------ */}
            {sections.map((group, i) => (
                <section
                    key={i}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 min-w-0"
                >
                    {group.map((item) => {
                        const { bg, text, ring } =
                            COLOR_PALETTE[colorIndex++ % COLOR_PALETTE.length];
                        const isSelected = selectedFilter === item.key;

                        return (
                            <div
                                key={item.key}
                                onClick={() => fetchAssigns(item.key)}
                                className={`${bg} ${text} rounded-xl p-4 h-28 shadow-xl transition-all duration-300 cursor-pointer
                  hover:scale-[1.02] hover:shadow-2xl
                  ${isSelected ? `ring-4 ${ring} border-4 border-white` : 'border border-transparent'}`}
                            >
                                <div className="text-sm font-semibold text-gray-700">
                                    {item.label}
                                </div>
                                <div className="text-lg font-extrabold mt-1">
                                    {stats[item.key as keyof Stats]}
                                </div>
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
                        <p className="text-lg text-red-500">
                            Action required immediately
                        </p>
                    </div>

                    <a href="/admin/Dashboard/overdue" aria-label="View overdue tasks">
                        <div className="p-3 rounded-full bg-red-500 shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all">
                            <ExternalLink size={28} className="text-white" />
                        </div>
                    </a>
                </div>
            </section>

            <div className="w-full overflow-x-auto">
                <AssignCardTable data={assigns} />
            </div>
        </div>
    );
}
