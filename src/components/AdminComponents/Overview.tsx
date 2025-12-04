'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
    ALL_LEAD_COUNT,
    GET_FILTERED_DATA,
    SHOW_ALL_ASSIGNS_API,
} from '@/config/api';
import ScheduleTracker from '@/components/AdminComponents/ScheduleTracker';
import AssignCardTable from './ModifiedAssignedTable';
import DayEndReport from '@/components/AdminComponents/DayEndReport';
import CreativeLoader from './CreativeLoader';
import {
    ExternalLink,
    Loader2,
    Users, // Icon for Total Leads
    UserPlus, // Icon for Today Leads
    PhoneOff, // Icon for Call Pending
    PhoneForwarded, // Icon for Today Calls
    CalendarCheck, // Icon for Site Visit Fixed
    PackageOpen, // Icon for Cold
    Flame, // Icon for Hot
    Sun, // Icon for Warm
    Trash2, // Icon for Junk
    RefreshCcw, // Icon for Retry
    CheckCircle2, // Icon for Booked
    Building, // Icon for Site Visit Done
    PhoneCall, // Icon for Call Back
    CheckCheck, // Icon for Follow Up
    Replace, // Icon for Reassigned
    Facebook, // Icon for Meta
    Landmark, // Icon for MagicBricks
    Home, // Icon for Housing
    Briefcase, // Icon for 99 Acers
    MoreHorizontal, // Icon for Others
} from 'lucide-react';

// --- (COLOR_PALETTE, Type Definitions - Stats, Assign, HistoryEntry - are the same) ---
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
    dumb_id: string;
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
    | 'unprocessedToday'
    | 'processedToday'
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
    meta: 0,
    leadToday: 0,
    callToday: 0,
    processedToday: 0, 
    unprocessedToday:0
};

export default function Overview() {
    const [stats, setStats] = useState<Stats>(initialStats);
    const [assigns, setAssigns] = useState<Assign[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('totalCount');
    const [uploadType, setUploadType] = useState<string>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isTableLoading, setIsTableLoading] = useState(false);

    /* --------------------------- 🔍 Fetch Assigns Data -------------------------- */
    const fetchAssigns = useCallback(
        async (filter: string = '', uploadTypeParam: string = uploadType) => {
            if (!filter) setIsLoading(true); // Only for main initial fetch

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
            } finally {
                if (!filter) setIsLoading(false);
            }
        },
        [uploadType]
    );

    /* --------------------------- 📊 Fetch Stats Data --------------------------- */
    const fetchStats = useCallback(
        async (uploadTypeParam: string = uploadType) => {
            setIsLoading(true);
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
                    {
                        key: 'unprocessedToday', url: `${GET_FILTERED_DATA}?startDate=${formatDate(startOfDay)}&endDate=${formatDate(endOfDay)}&status=assigned`
                    },
                    {
                        key: 'processedToday', url: `${GET_FILTERED_DATA}?startDate=${formatDate(startOfDay)}&endDate=${formatDate(endOfDay)}&status=processed&status=reassigned`
                    },
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
            } finally {
                setIsLoading(false);
            }
        },
        [uploadType]
    );

    /* --------------------------- ⚙️ Auto Fetch --------------------------- */
    useEffect(() => {
        const fetchData = async () => {
            await fetchStats(uploadType);
            // We await fetchStats, which sets loading to true/false
            // Then we fetch the default table data.
            await fetchAssigns('assignCount', uploadType);
        }
        fetchData();
    }, [fetchStats, fetchAssigns, uploadType]); // Removed fetchAssigns to prevent potential loops if not memoized correctly

    // --- (Card Sections - NOW WITH ICONS!) ---
    const sections = [
        [
            { label: 'Total Leads', key: 'assignCount', icon: Users },
            { label: 'Today Leads', key: 'leadToday', icon: UserPlus },
            { label: 'Call Pending', key: 'callPending', icon: PhoneOff },
            { label: 'Today Calls', key: 'callToday', icon: PhoneForwarded },
            { label: 'Site Visit Fixed', key: 'siteVisitFixed', icon: CalendarCheck }
        ],
        [
            { label: 'Cold', key: 'coldLeads', icon: PackageOpen },
            { label: 'Warm', key: 'warmLeads', icon: Sun },
            { label: 'Hot', key: 'hotLeads', icon: Flame },
            { label: 'Junk', key: 'junkLeads', icon: Trash2 },
            { label: 'Retry', key: 'retryLeads', icon: RefreshCcw }
        ],
        [
            { label: 'Booked', key: 'booked', icon: CheckCircle2 },
            { label: 'Site Visit Done', key: 'siteVisitDone', icon: Building },
            { label: 'Call Back', key: 'callBack', icon: PhoneCall },
            { label: 'Follow Up', key: 'followUp', icon: CheckCheck },
            { label: 'Reassign Leads', key: 'reassigned', icon: Replace }
        ],
        [
            { label: 'Meta', key: 'meta', icon: Facebook },
            { label: 'MagicBricks', key: 'c', icon: Landmark },
            { label: 'Housing', key: 'k', icon: Home },
            { label: '99 Acers', key: 'x', icon: Briefcase },
            { label: 'Others', key: 'y', icon: MoreHorizontal }
        ],
    ];

    let colorIndex = 0;

    const handleCardClick = async (key: string) => {
        const realFilters = [
            'assignCount', 'leadToday', 'callPending', 'callToday', 'siteVisitFixed',
            'coldLeads', 'hotLeads', 'warmLeads', 'junkLeads', 'retryLeads',
            'booked', 'siteVisitDone', 'callBack', 'followUp', 'reassigned', 'meta'
        ];

        if (realFilters.includes(key)) {
            setIsTableLoading(true);
            try {
                await fetchAssigns(key);
            } finally {
                setIsTableLoading(false);
            }
        } else {
            setSelectedFilter(key);
            // Optionally clear the table if these cards aren't supposed to show data
            // setAssigns([]); 
        }
    };


    if (isLoading) {
        return (
            <CreativeLoader />
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter overflow-x-hidden">

            {/* --- Page Title --- */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">CRM Dashboard</h1>

            <DayEndReport />

            {/* --- 🔘 Upload Type Buttons (NOW RESPONSIVE) --- */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                {['all', 'single', 'Bulk'].map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setUploadType(type);
                            // useEffect handles the refetch
                        }}
                        className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer shadow-md
                        ${uploadType === type
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg'
                            }`}
                    >
                        {type === 'all'
                            ? 'All'
                            : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* --- 📦 Lead Status Cards (NOW RESPONSIVE & SEXY) --- */}
            {sections.map((group, i) => (
                <section
                    key={i}
                    // RESPONSIVE FIX: Changed grid-cols-2 to grid-cols-1
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4 min-w-0"
                >
                    {group.map((item) => {
                        const { bg, text, ring } =
                            COLOR_PALETTE[colorIndex++ % COLOR_PALETTE.length];
                        const isSelected = selectedFilter === item.key;
                        const Icon = item.icon; // Get the icon component
                        const cardClasses = `${bg} rounded-xl p-5 shadow-lg transition-all duration-300 cursor-pointer
                        flex flex-col justify-between h-32 // <-- Modern card layout
                        hover:scale-[1.03] hover:shadow-xl
                        ${isSelected ? `ring-4 ${ring} border-4 border-white` : 'border border-transparent'}`;
                        // --- Custom Rendering for Today Leads ---
                        if (item.key === 'leadToday') {
                            const totalToday = stats.leadToday || 0;
                            const processed = stats.processedToday || 0;
                            const unprocessed = stats.unprocessedToday || 0;
                            return (
                                <div
                                    key={item.key}
                                    onClick={() => handleCardClick(item.key)}
                                    className={cardClasses}
                                >
                                    {/* Header with Icon */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">{item.label} 
                                            </span>
                                        {/* <Icon className={`${text} w-5 h-5`} /> */}
                                        <span className='text-xl font-extrabold bg-purple-200 rounded-full px-2'>
                                            {totalToday}
                                        </span>
                                    </div>
                                    {/* Split Values */}
                                    <div className="flex justify-between items-end gap-2 pt-2">
                                        <div className="flex flex-col">
                                            <span className={`text-2xl font-extrabold text-emerald-600`}>
                                                {processed}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">Processed</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-2xl font-extrabold text-red-600`}>
                                                {unprocessed}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">Pending</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={item.key}
                                onClick={() => handleCardClick(item.key)}
                                className={`${bg} rounded-xl p-5 shadow-lg transition-all duration-300 cursor-pointer
                                flex flex-col justify-between h-32 // <-- Modern card layout
                                hover:scale-[1.03] hover:shadow-xl
                                ${isSelected ? `ring-4 ${ring} border-4 border-white` : 'border border-transparent'}`}
                            >
                                {/* Header with Icon */}
                                <div className="flex items-start justify-between">
                                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                                    <Icon className={`${text} w-5 h-5`} />
                                </div>
                                {/* Value */}
                                <div className={`text-3xl ${text} font-extrabold`}>
                                    {stats[item.key as keyof Stats] || 0}
                                </div>
                            </div>
                        );
                    })}
                </section>
            ))}

            {/* --- 📅 Schedule Tracker --- */}
            <section className="flex flex-col md:flex-row gap-4 mb-8 min-w-0">
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex items-center justify-between gap-6 border-l-8 border-red-500 hover:shadow-xl hover:shadow-red-100 transition-all">
                    <div className="flex-1">
                        <ScheduleTracker />
                        <p className="text-lg text-red-600 font-medium">
                            Action required immediately
                        </p>
                    </div>
                    <a href="/admin/Dashboard/overdue" aria-label="View overdue tasks">
                        <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-orange-400 shadow-lg hover:shadow-red-300/50 transform hover:scale-110 transition-all">
                            <ExternalLink size={28} className="text-white" />
                        </div>
                    </a>
                </div>
            </section>

            {/* --- 📋 Assign Table (Improved Loading State) --- */}
            <div className="w-full overflow-x-auto">
                {isTableLoading ? (
                    <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-lg">
                        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                        <p className="mt-4 text-lg font-semibold text-gray-700">Loading Assigned Leads...</p>
                        <p className="text-sm text-gray-500">Just a moment, we&apos;re fetching the data.</p>
                    </div>
                ) : (
                    <AssignCardTable data={assigns} />
                )}
            </div>
        </div>
    );
}