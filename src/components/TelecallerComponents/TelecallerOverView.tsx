'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ScheduleTracker from '@/components/TelecallerComponents/ScheduleTracker';
import { GET_LEAD_BY_ID, GET_SCHEDULES_BY_ID } from '@/config/api';

// type AssignLeadCount = {
//     newLeadCount: number;
// };

type Stats = {
    siteVisitFixed: number;
    siteVisitDone: number;
    followUp: number;
    booked: number;
    hot: number,
    cold: number,
    warm: number,
    retry: number,
    junk: number,
    callPending: number;
    callBack: number;  
    yesterdayLeadsCount: number;
    todayLeadsCount: number;
    todayProcessedLeadsCount: number;
};

type AssignsCountResponse = {
    success: boolean;
    count: number;
    data?: unknown[];
    message?: string;
};

type TelecallerOverViewProps = {
    newLeadCount: number;
    onTileClick: (filterType: string) => void;
    activeTile: string; // <-- from parent for styling
    uploadType: string
};

// Function to get the start and end of the current day in ISO format
const getTodayDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow (end of today)

    return {
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
    };
};


const TelecallerOverView = ({ newLeadCount, onTileClick, activeTile , uploadType }: TelecallerOverViewProps) => {
    const [stats, setStats] = useState<Stats>({
        siteVisitFixed: 0,
        siteVisitDone: 0,
        followUp: 0,
        booked: 0,
        hot: 0,
        cold: 0,
        warm: 0,
        retry: 0,
        junk: 0,
        callPending: 0,
        callBack: 0,   // ✅ initialize correctly
        todayLeadsCount: 0,
        yesterdayLeadsCount: 0,
        todayProcessedLeadsCount: 0
    });
    const [error, setError] = useState<string | null>(null);
    const [scheduleCallCount, setScheduleCallCount] = useState(0);
    console.log(scheduleCallCount)
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
            // Add upload_type to params if it's set
            const finalParams = { ...params };
            if (uploadType) {
                finalParams.upload_type = uploadType;
            }
            const url = GET_LEAD_BY_ID(id);
            const { data } = await axios.get<AssignsCountResponse>(url, { params: finalParams });
            if (!data?.success) return 0;
            return data.count ?? 0;
        };


        const getYesterdayDateRange = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // start of today

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1); // start of yesterday

            return {
                startDate: yesterday.toISOString(),
                endDate: today.toISOString(), // end = start of today
            };
        };

        const fetchStats = async () => {
            try {
                const userId = getUserIdFromLocalStorage();
                if (!userId) {
                    safeSetError('User not found or missing _id in localStorage');
                    return;
                }

                // ✅ Prepare the date range for today's leads
                const todayRange = getTodayDateRange();
                const todayLeadsParams = {
                    startDate: todayRange.startDate,
                    endDate: todayRange.endDate,
                    status:'assigned'
                };

                const yesterdayRange = getYesterdayDateRange();

                const yesterdayLeadsParams = {
                    startDate: yesterdayRange.startDate,
                    endDate: yesterdayRange.endDate,
                };

                const todayProcessedParams = {
                    startDate: todayRange.startDate,
                    endDate: todayRange.endDate,
                    status: 'processed'
                };

                // if(uploadType){
                //     todayLeadsParams.upload_type = uploadType;
                // }

                // Parallel counts
                const [
                    siteVisitFixed,
                    siteVisitDone,
                    followUp,
                    booked,
                    hot,
                    cold,
                    warm,
                    retry,
                    junk,
                    callPending,
                    callBack,
                    todayLeadsCount,
                    yesterdayLeadsCount,
                    todayProcessedLeadsCount 
                ] = await Promise.all([
                    getCount(userId, { lead_status: 'Site Visit Fixed' }),
                    getCount(userId, { lead_status: 'Site Visit Done' }),
                    getCount(userId, { lead_status: 'Under Follow Up' }),
                    getCount(userId, { lead_status: 'Booked' }),
                    getCount(userId, { lead_type: 'Hot' }),
                    getCount(userId, { lead_type: 'Cold' }),
                    getCount(userId, { lead_type: 'Warm' }),
                    getCount(userId, { lead_type: 'Retry' }),
                    getCount(userId, { lead_type: 'Junk' }),
                    getCount(userId, { status: 'assigned' }),
                    getCount(userId, { lead_status: 'Call Back' }),
                    getCount(userId, todayLeadsParams),
                    getCount(userId, yesterdayLeadsParams),
                    getCount(userId, todayProcessedParams)

                ]);

                safeSet(() => ({
                    siteVisitFixed,
                    siteVisitDone,
                    followUp,
                    booked,
                    hot,
                    cold,
                    warm,
                    retry,
                    junk,
                    callPending,
                    callBack,
                    todayLeadsCount,
                    yesterdayLeadsCount,
                    todayProcessedLeadsCount 
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
    }, [uploadType]);

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
    }, [uploadType]);



    return (
        <section>
           

            {error && (
                <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'new' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('new')}
                >
                    <div className="text-gray-600">All Leads</div>
                    <div className="text-2xl font-bold">{newLeadCount}</div>
                </div>
                <div
                    className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-not-allowed justify-between"
                >
                    <div className="text-gray-600">Today Leads</div>
                    <div className="text-2xl font-bold">{stats.todayLeadsCount}</div>
                </div>
                <div
                    className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between"
                >
                    <div className="text-gray-600">Yesterday new Leads</div>
                    <div className="text-2xl font-bold">{stats.yesterdayLeadsCount}</div>
                </div>


                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'callPending' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('callPending')}
                >
                    <div className="text-gray-600"> New Leads (Pending)</div>
                    <div className="text-2xl font-bold">{stats.callPending}</div>
                </div>
                <div className=" bg-white rounded-lg shadow p-4">
                    {/* <a href="/telecaller/Calender"> */}
                        <ScheduleTracker />
                    {/* </a> */}
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
    ${activeTile === 'todayProcessed' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('todayProcessed')}
                >
                    <div className="text-gray-600">Today Processed Leads</div>
                    <div className="text-2xl font-bold">
                        {stats.todayProcessedLeadsCount}
                    </div>
                </div>

                {/* <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'hot' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('hot')}
                >
                    <div className="text-gray-600">Hot </div>
                    <div className="text-2xl font-bold">{stats.hot}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'cold' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('cold')}
                >
                    <div className="text-gray-600">Cold </div>
                    <div className="text-2xl font-bold">{stats.cold}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'warm' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('warm')}
                >
                    <div className="text-gray-600">Warm </div>
                    <div className="text-2xl font-bold">{stats.warm}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'retry' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('retry')}
                >
                    <div className="text-gray-600">Retry </div>
                    <div className="text-2xl font-bold">{stats.retry}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'junk' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('junk')}
                >
                    <div className="text-gray-600">Junk</div>
                    <div className="text-2xl font-bold">{stats.junk}</div>
                </div> */}
            </section>

            {/* <section className="flex flex-col md:flex-row gap-4 mb-4">
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
            </section> */}
        </section>
    );
};

export default TelecallerOverView;
