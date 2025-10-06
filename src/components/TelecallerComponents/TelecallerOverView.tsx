'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_OLD_LEADS_FOR_TELECALLER, GET_LEAD_BY_ID, GET_SCHEDULES_BY_ID } from '@/config/api';
import ScheduleTracker from '@/components/TelecallerComponents/ScheduleTracker';

// type AssignLeadCount = {
//     newLeadCount: number;
// };

type Stats = {
    oldLeadCount: number;
    siteVisitFixed: number;
    siteVisitDone: number;
    followUp: number;
    booked: number;
    callPending: number;
    callBack: number;   // ✅ added here
};

type AssignsCountResponse = {
    success: boolean;
    count: number;
    data?: unknown[];
    message?: string;
};

type OldLeadsResponse = {
    success: boolean;
    total: number;
    message?: string;
};

type TelecallerOverViewProps = {
    newLeadCount: number;
    onTileClick: (filterType: string) => void;
    activeTile: string; // <-- from parent for styling
};

const TelecallerOverView = ({ newLeadCount, onTileClick, activeTile }: TelecallerOverViewProps) => {
    const [stats, setStats] = useState<Stats>({
        oldLeadCount: 0,
        siteVisitFixed: 0,
        siteVisitDone: 0,
        followUp: 0,
        booked: 0,
        callPending: 0,
        callBack: 0,   // ✅ initialize correctly
    });
    const [error, setError] = useState<string | null>(null);
    const [scheduleCallCount, setScheduleCallCount] = useState(0);

    useEffect(() => {
        let mounted = true;

        const safeSet = (updater: (prev: Stats) => Stats) => {
            if (mounted) setStats(updater);
        };
        const safeSetError = (msg: string) => {
            if (mounted) setError(msg);
        };

        const getUserIdFromLocalStorage = (): string | null => {
            try {
                const raw = localStorage.getItem('user');
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return parsed?._id ?? null;
            } catch {
                return null;
            }
        };

        const getCount = async (
            id: string,
            params: Record<string, string>
        ): Promise<number> => {
            const url = GET_LEAD_BY_ID(id);
            const { data } = await axios.get<AssignsCountResponse>(url, { params });
            if (!data?.success) return 0;
            return data.count ?? 0;
        };

        const fetchStats = async () => {
            try {
                const userId = getUserIdFromLocalStorage();
                if (!userId) {
                    safeSetError('User not found or missing _id in localStorage');
                    return;
                }

                // Old leads total
                const oldLeadRes = await axios.get<OldLeadsResponse>(
                    `${GET_OLD_LEADS_FOR_TELECALLER}?userId=${encodeURIComponent(userId)}`
                );
                const oldLeadCount = oldLeadRes.data?.success ? oldLeadRes.data.total : 0;

                // Parallel counts
                const [
                    siteVisitFixed,
                    siteVisitDone,
                    followUp,
                    booked,
                    callPending,
                    callBack,
                ] = await Promise.all([
                    getCount(userId, { lead_status: 'Site Visit Fixed' }),
                    getCount(userId, { lead_status: 'Site Visit Done' }),
                    getCount(userId, { lead_status: 'Under Follow Up' }),
                    getCount(userId, { lead_status: 'Booked' }),
                    getCount(userId, { status: 'assigned' }),
                    getCount(userId, { lead_status: 'Call Back' }),
                ]);

                safeSet(() => ({
                    oldLeadCount,
                    siteVisitFixed,
                    siteVisitDone,
                    followUp,
                    booked,
                    callPending,
                    callBack,   // ✅ correctly store callBack
                }));
            } catch (err) {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : (err as Error)?.message ?? 'Something went wrong';
                console.error('Error fetching stats:', err);
                safeSetError(msg);
            }
        };

        fetchStats();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const user = localStorage.getItem("user");
                if (!user) {
                    setError("User not found in localStorage.");
                    setScheduleCallCount(0);
                    return;
                }

                const { _id } = JSON.parse(user);
                if (!_id) {
                    setError("User ID is missing.");
                    return;
                }

                const res = await axios.get(GET_SCHEDULES_BY_ID(_id));

                if (Array.isArray(res.data)) {
                    setScheduleCallCount(res.data.length);
                } else {
                    setError("Unexpected response format.");
                }
            } catch {
                setError("Failed to fetch schedules.");
            }
        };

        fetchSchedules();
    }, []);



    return (
        <section>
            <h1 className="text-xl text-gray-700 font-bold mb-4">Overview</h1>

            {error && (
                <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                    <a href="/telecaller/OldReport">
                        <div className="text-gray-600">Old Leads</div>
                        <div className="text-2xl font-bold">{stats.oldLeadCount}</div>
                    </a>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'new' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('new')}
                >
                    <div className="text-gray-600">New Leads</div>
                    <div className="text-2xl font-bold">{newLeadCount}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'SiteVisitFixed' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('SiteVisitFixed')}
                >
                    <div className="text-gray-600">Site Visit Fixed</div>
                    <div className="text-2xl font-bold">{stats.siteVisitFixed}</div>
                </div>

                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'callPending' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('callPending')}
                >
                    <div className="text-gray-600">Call Pending</div>
                    <div className="text-2xl font-bold">{stats.callPending}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <a href="/telecaller/Calender">
                        <ScheduleTracker />
                    </a>
                </div>
            </section>

            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'SiteVisitDone' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('SiteVisitDone')}
                >
                    <div className="text-gray-600">Site Visit Done</div>
                    <div className="text-2xl font-bold">{stats.siteVisitDone}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'scheduleCall' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('scheduleCall')}
                >
                    <div className="text-gray-600">Schedule Calls</div>
                    <div className="text-2xl font-bold">{scheduleCallCount}</div>

                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'followUp' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('followUp')}
                >
                    <div className="text-gray-600">Follow Up</div>
                    <div className="text-2xl font-bold">{stats.followUp}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'booked' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('booked')}
                >
                    <div className="text-gray-600">Booked</div>
                    <div className="text-2xl font-bold">{stats.booked}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'callBack' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('callBack')}
                >
                    <div className="text-gray-600">Call Back</div>
                    <div className="text-2xl font-bold">{stats.callBack}</div>
                </div>
            </section>
        </section>
    );
};

export default TelecallerOverView;
