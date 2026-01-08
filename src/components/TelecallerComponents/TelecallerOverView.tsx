'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ScheduleTracker from '@/components/TelecallerComponents/ScheduleTracker';
import { GET_LEAD_BY_ID } from '@/config/api';

type Stats = {
    siteVisitFixed: number; siteVisitDone: number; followUp: number; booked: number;
    hot: number; cold: number; warm: number; retry: number; junk: number;
    callPending: number; callBack: number; yesterdayLeadsCount: number;
    todayLeadsCount: number; todayProcessedLeadsCount: number;
    yesterdayProcessedLeadsCount: number; inProgressToday: number;
    followupToday: number; totalProcessed: number; answered: number;
    svpushToday: number; svpushYesterday: number; svPushCount: number;
    followUpSvpush: number; svDonepermonth: number; unqualifiedToday: number;
    total: number; totalCallToday: number;
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

const getTodayDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return { startDate: today.toISOString(), endDate: tomorrow.toISOString() };
};

const TelecallerOverView = ({ newLeadCount, uploadType }: TelecallerOverViewProps) => {
    console.log(newLeadCount)
    const [stats, setStats] = useState<Stats>({
        siteVisitFixed: 0, siteVisitDone: 0, followUp: 0, booked: 0, hot: 0,
        cold: 0, warm: 0, retry: 0, junk: 0, callPending: 0, callBack: 0,
        todayLeadsCount: 0, yesterdayLeadsCount: 0, todayProcessedLeadsCount: 0,
        yesterdayProcessedLeadsCount: 0, inProgressToday: 0, followupToday: 0,
        totalProcessed: 0, answered: 0, svpushToday: 0, svpushYesterday: 0,
        svPushCount: 0, followUpSvpush: 0, svDonepermonth: 0, unqualifiedToday: 0,
        total: 0, totalCallToday: 0,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const safeSet = (updater: (prev: Stats) => Stats) => { if (mounted) setStats(updater); };
        const safeSetError = (msg: string) => { if (mounted) setError(msg); };

        const getUserIdFromLocalStorage = (): string | null => {
            try {
                const raw = localStorage.getItem('user');
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return parsed?._id ?? null;
            } catch { return null; }
        };

        // FIXED: Updated Record type to handle string arrays
        const getCount = async (id: string, params: Record<string, string | string[]>): Promise<number> => {
            const finalParams: Record<string, string | string[]> = { ...params };
            if (uploadType) finalParams.upload_type = uploadType;
            const url = GET_LEAD_BY_ID(id);
            const { data } = await axios.get<AssignsCountResponse>(url, { params: finalParams });
            return data?.success ? (data.count ?? 0) : 0;
        };

        const getYesterdayDateRange = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            return { startDate: yesterday.toISOString(), endDate: today.toISOString() };
        };

        const formatIsoDate = (isoString: string): string => isoString.split('T')[0];

        const fetchStats = async () => {
            try {
                const userId = getUserIdFromLocalStorage();
                if (!userId) { safeSetError('User not found'); return; }

                const todayRange = getTodayDateRange();
                const yesterdayRange = getYesterdayDateRange();

                const [
                    siteVisitFixed, siteVisitDone, followUp, booked, hot, cold, warm, retry, junk,
                    callPending, callBack, todayLeadsCount, yesterdayLeadsCount, todayProcessedLeadsCount,
                    yesterdayProcessedLeadsCount, inProgressToday, followupToday, svPushCount,
                    totalProcessed, svpushToday, svpushYesterday, followUpSvpush, svDonepermonth,
                    unqualifiedToday, totalCallToday, followupTodayProcessed
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
                    getCount(userId, { status: ['assigned', 'auto-assigned'] }), // Works now
                    getCount(userId, { startDate: yesterdayRange.startDate, endDate: yesterdayRange.endDate }),
                    getCount(userId, { startDate: todayRange.startDate, endDate: todayRange.endDate, status: 'processed' }),
                    getCount(userId, { startDate: yesterdayRange.startDate, endDate: yesterdayRange.endDate, status: 'processed' }),
                    getCount(userId, { schedule_date: formatIsoDate(todayRange.endDate), lead_status: 'IN Progress' }),
                    getCount(userId, { schedule_date: formatIsoDate(todayRange.endDate), lead_status: 'Follow Up' }),
                    getCount(userId, { lead_status: 'SV Push' }),
                    getCount(userId, { status: 'processed' }),
                    getCount(userId, { updatedStartDate: todayRange.startDate, updatedEndDate: todayRange.endDate, lead_status: 'SV Push' }),
                    getCount(userId, { startDate: yesterdayRange.startDate, endDate: yesterdayRange.endDate, lead_status: 'SV Push' }),
                    getCount(userId, { lead_status: 'Follow Up', subdisposition: 'SV Fixed' }),
                    getCount(userId, { subdisposition: 'Site Visit Done' }),
                    getCount(userId, { updatedStartDate: todayRange.startDate, updatedEndDate: todayRange.endDate, lead_status: 'Unqualified' }),
                    getCount(userId, { updatedStartDate: todayRange.startDate, updatedEndDate: todayRange.endDate, status: 'processed' }),
                    getCount(userId, { updatedStartDate: todayRange.startDate, updatedEndDate: todayRange.endDate, lead_status: 'Follow Up' }),
                ]);

                safeSet(() => ({
                    siteVisitFixed, siteVisitDone, followUp, booked, hot, cold, warm, retry, junk,
                    callPending, callBack, todayLeadsCount, yesterdayLeadsCount, todayProcessedLeadsCount,
                    yesterdayProcessedLeadsCount, inProgressToday, followupToday,
                    answered: unqualifiedToday + followupTodayProcessed + svpushToday,
                    totalProcessed, svpushToday, svpushYesterday, svPushCount, followUpSvpush,
                    svDonepermonth, unqualifiedToday,
                    total: unqualifiedToday + followupToday + svpushToday + inProgressToday,
                    totalCallToday,
                }));
            } catch (err) {
                console.error('Error fetching stats:', err);
                safeSetError('Failed to load stats');
            }
        };

        fetchStats();
        return () => { mounted = false; };
    }, [uploadType]);

    return (
        <section>
            {error && <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>}

            {/* Row 1 */}
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">Untouched</div>
                    <div className="text-2xl font-bold">{stats.todayLeadsCount}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">Touched</div>
                    <div className="text-2xl font-bold">{stats.todayProcessedLeadsCount}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">New Leads YD</div>
                    <div className="text-2xl font-bold">{stats.yesterdayLeadsCount}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">In-Prog Today</div>
                    <div className="text-2xl font-bold">{stats.inProgressToday}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">FU Today</div>
                    <div className="text-2xl font-bold">{stats.followupToday}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <ScheduleTracker />
                </div>
            </section>

            {/* Row 2 */}
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Total Call</div>
                    <div className="text-2xl font-bold">{stats.totalCallToday}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Answered</div>
                    <div className="text-2xl font-bold">{stats.answered}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Not Answered</div>
                    <div className="text-2xl font-bold">{stats.totalCallToday - stats.answered}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">&nbsp;</div>
                    <div className="text-2xl font-bold">0</div>
                </div>
            </section>

            {/* Row 3 */}
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">SV Push Tdy</div>
                    <div className="text-2xl font-bold">{stats.svpushToday}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">FU SV Prospect</div>
                    <div className="text-2xl font-bold">{stats.followUpSvpush}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">SV Push YD</div>
                    <div className="text-2xl font-bold">{stats.svpushYesterday}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">SV Push MTD</div>
                    <div className="text-2xl font-bold">{stats.svPushCount}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">SV Done MTD</div>
                    <div className="text-2xl font-bold">{stats.svDonepermonth}</div>
                </div>
            </section>

            {/* Row 4 */}
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">Warm</div>
                    <div className="text-2xl font-bold">{stats.warm}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div className="text-gray-600">Hot</div>
                    <div className="text-2xl font-bold">{stats.hot}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Booked MTD</div>
                    <div className="text-2xl font-bold">{stats.booked}</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Booked YTD</div>
                    <div className="text-2xl font-bold">{stats.booked}</div>
                </div>
            </section>
        </section>
    );
};

export default TelecallerOverView;