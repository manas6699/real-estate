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
    yesterdayProcessedLeadsCount: number;
    inProgressToday: number;
    followupToday: number;
    totalProcessed: number;
    answered: number;
    svpushToday: number;
    svpushYesterday: number;
    svPushCount: number;
    followUpSvpush: number;
    svDonepermonth: number;
    unqualifiedToday: number;
    total: number;
    totalCallToday : number;
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
    activeTile: string;
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


const TelecallerOverView = ({ newLeadCount, onTileClick, activeTile, uploadType }: TelecallerOverViewProps) => {
    console.log(newLeadCount)
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
        todayProcessedLeadsCount: 0,
        yesterdayProcessedLeadsCount: 0,
        inProgressToday: 0,
        followupToday: 0,
        totalProcessed: 0,
        answered: 0,
        svpushToday: 0,
        svpushYesterday: 0,
        svPushCount: 0,
        followUpSvpush: 0,
        svDonepermonth: 0,
        unqualifiedToday: 0,
        total: 0,
        totalCallToday: 0,
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
            params: Record<string, string | string[] | number | undefined> // Changed this line
        ): Promise<number> => {
            // 2. Ensure finalParams uses the same flexible type
            const finalParams: Record<string, string | string[] | number | undefined> = { ...params };

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

        const formatIsoDate = (isoString: string): string => {
            return isoString.split('T')[0];
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
                    // startDate: todayRange.startDate,
                    // endDate: todayRange.endDate,
                    status: ['assigned' , "auto-assigned"]
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

                const yesterdayProcessedParams = {
                    startDate: yesterdayRange.startDate,
                    endDate: yesterdayRange.endDate,
                    status: 'processed'
                }

                const inProgressTodayParams = {
                    schedule_date: formatIsoDate(todayRange.endDate),
                    lead_status: 'IN Progress'
                }

                const followupTodayParams = {
                    schedule_date: formatIsoDate(todayRange.endDate),
                    lead_status: 'Follow Up'
                }
                const svpushTodayParams = {
                    updatedStartDate: todayRange.startDate,
                    updatedEndDate: todayRange.endDate,
                    lead_status: 'SV Push'
                }// 

                const svpushYesterdayParams = {
                    startDate: yesterdayRange.startDate,
                    endDate: yesterdayRange.endDate,
                    lead_status: 'SV Push'
                }

                const followUpSvpushParams = {
                    lead_status: 'Follow Up',
                    subdisposition: 'SV Fixed'
                }
                const unqualifiedTodayParams = {
                    updatedStartDate: todayRange.startDate,
                    updatedEndDate: todayRange.endDate,
                    lead_status: 'Unqualified'
                }
                const futdy = {
                    updatedStartDate: todayRange.startDate,
                    updatedEndDate: todayRange.endDate,
                    lead_status: 'Follow Up'
                }

                const totalCallTodayParams = {
                    updatedStartDate: todayRange.startDate,
                    updatedEndDate: todayRange.endDate,
                    status: 'processed'
                }

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
                    todayProcessedLeadsCount,
                    yesterdayProcessedLeadsCount,
                    inProgressToday,
                    followupToday,
                    svPushCount,
                    totalProcessed,
                    svpushToday,
                    svpushYesterday,
                    followUpSvpush,
                    svDonepermonth,
                    unqualifiedToday,
                    totalCallToday,
                    followupTodayProcessed,

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
                    getCount(userId, todayProcessedParams),
                    getCount(userId, yesterdayProcessedParams),
                    getCount(userId, inProgressTodayParams),
                    getCount(userId, followupTodayParams),
                    getCount(userId, { lead_status: 'SV Push' }),
                    getCount(userId, { status: 'processed' }),
                    getCount(userId, svpushTodayParams),
                    getCount(userId, svpushYesterdayParams),
                    getCount(userId, followUpSvpushParams),
                    getCount(userId, { subdisposition: 'Site Visit Done' }),
                    getCount(userId, unqualifiedTodayParams),
                    getCount(userId, totalCallTodayParams),
                    getCount(userId, futdy),
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
                    todayProcessedLeadsCount,
                    yesterdayProcessedLeadsCount,
                    inProgressToday,
                    followupToday,
                    answered: unqualifiedToday + followupTodayProcessed + svpushToday,
                    totalProcessed,
                    svpushToday,
                    svpushYesterday,
                    svPushCount,
                    followUpSvpush,
                    svDonepermonth,
                    unqualifiedToday,
                    total: unqualifiedToday + followupToday + svpushToday + inProgressToday,
                    totalCallToday,
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
                        ${activeTile === 'untouched' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('untouched')}
                >
                    <div className="text-gray-600">Untouched</div>
                    <div className="text-2xl font-bold">{stats.todayLeadsCount}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
    ${activeTile === 'todayProcessed' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('todayProcessed')}
                >
                    <div className="text-gray-600">Touched</div>
                    <div className="text-2xl font-bold">
                        {stats.todayProcessedLeadsCount}
                    </div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                        ${activeTile === 'newleadsyd' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('newleadsyd')}
                >
                    <div className="text-gray-600">New Leads YD</div>
                    <div className="text-2xl font-bold">{stats.yesterdayLeadsCount}</div>
                </div>

                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'inProgressToday' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('inProgressToday')}
                >
                    <div className="text-gray-600">In-Prog Today</div>
                    <div className="text-2xl font-bold">{stats.inProgressToday}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer justify-between
                    ${activeTile === 'followupToday' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('followupToday')}
                >
                    <div className="text-gray-600">FU Today</div>
                    <div className="text-2xl font-bold">{stats.followupToday}</div>
                </div>
                <div className=" bg-white rounded-lg shadow p-4">
                    {/* <a href="/telecaller/Calender"> */}
                    <ScheduleTracker />
                    {/* </a> */}
                </div>
            </section>

            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'totaltoday' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('totaltoday')}
                >
                    <div className="text-gray-600">Total Call</div>
                    <div className="text-2xl font-bold">{stats.totalCallToday}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'answered' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('answered')}
                >
                    <div className="text-gray-600">Answered</div>
                    <div className="text-2xl font-bold">{stats.answered}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'notanswered' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('notanswered')}
                >
                    <div className="text-gray-600">Not Answered</div>
                    <div className="text-2xl font-bold">{stats.totalCallToday - stats.answered}</div>

                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer`}
                >
                    <div className="text-gray-600">&nbsp;</div>
                    <div className="text-2xl font-bold">0</div>
                </div>
            </section>
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'svpushToday' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('svpushToday')}
                >
                    <div className="text-gray-600">SV Push Tdy</div>
                    <div className="text-2xl font-bold">{stats.svpushToday}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer
                        ${activeTile === 'fusv' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('fusv')}
                >
                    <div className="text-gray-600">FU SV Prospect</div>
                    <div className="text-2xl font-bold">{stats.followUpSvpush}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'svpushYesterday' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('svpushYesterday')}
                >
                    <div className="text-gray-600">SV Push YD</div>
                    <div className="text-2xl font-bold">{stats.svpushYesterday}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'svPushCount' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('svPushCount')}
                >
                    <div className="text-gray-600">SV Push MTD</div>
                    <div className="text-2xl font-bold">{stats.svPushCount}</div>

                </div>

                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer
                        ${activeTile === 'svDonepermonth' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('svDonepermonth')}
                >
                    <div className="text-gray-600">SV Done MTD</div>
                    <div className="text-2xl font-bold">{stats.svDonepermonth}</div>
                </div>
            </section>
            <section className="flex flex-col md:flex-row gap-4 mb-4">
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
                    ${activeTile === 'hot' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('hot')}
                >
                    <div className="text-gray-600">Hot </div>
                    <div className="text-2xl font-bold">{stats.hot}</div>
                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'bookedMTD' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('bookedMTD')}
                >
                    <div className="text-gray-600">Booked MTD</div>
                    <div className="text-2xl font-bold">{stats.booked}</div>

                </div>
                <div
                    className={`flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer 
                    ${activeTile === 'booked' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => onTileClick('booked')}
                >
                    <div className="text-gray-600">Booked YTD</div>
                    <div className="text-2xl font-bold">{stats.booked}</div>
                </div>
            </section>
        </section>
    );
};

export default TelecallerOverView;
