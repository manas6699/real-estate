'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { GET_FILTERED_DATA } from '@/config/api';
import ScheduleTracker from '@/components/AdminComponents/ScheduleTracker';
import AssignCardTable from './ModifiedAssignedTable';
import CreativeLoader from './CreativeLoader';
import {
    ExternalLink, Loader2, UserPlus, PhoneForwarded, CalendarCheck,
    Flame, Sun, RefreshCcw, CheckCircle2, CheckCheck, Clock, Activity, PackageOpen
} from 'lucide-react';

type Stats = Record<string, number>;

export default function Overview() {
    const [stats, setStats] = useState<Stats>({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [assigns, setAssigns] = useState<any[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('total');
    const [uploadType, setUploadType] = useState<string>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const getDates = () => {
        const now = new Date();
        const formatLocal = (date: Date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const tdy = new Date(now);
        const yd = new Date(now); yd.setDate(now.getDate() - 1);
        const tmrw = new Date(now); tmrw.setDate(now.getDate() + 1);
        const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const yStart = new Date(now.getFullYear(), 0, 1);

        return {
            today: formatLocal(tdy),
            yesterday: formatLocal(yd),
            tomorrow: formatLocal(tmrw),
            monthStart: formatLocal(mStart),
            yearStart: formatLocal(yStart)
        };
    };

    const fetchAssigns = useCallback(async (filter: string) => {
        setIsTableLoading(true);
        try {
            const { today, yesterday, tomorrow, monthStart, yearStart } = getDates();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let params: any = {};

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filterMap: any = {
                untouched: { status: ['assigned', 'auto-assigned'] },
                touched: { startDate: today, endDate: today, status: 'processed' },
                newLeadsYD: { startDate: yesterday, endDate: yesterday },
                inProgToday: { schedule_date: today, lead_status: 'IN Progress' },
                fuToday: { schedule_date: today, lead_status: 'Follow Up' },
                totalCall: { updatedStartDate: today, updatedEndDate: today, status: 'processed' },
                answered: { lead_status: ['SV Push', 'Unqualified', 'Follow Up'], updatedStartDate: today, updatedEndDate: today, status: 'processed' },
                notAnswered: { lead_status: 'IN Progress', updatedStartDate: today, updatedEndDate: today, status: 'processed' },
                svPushTdy: { updatedStartDate: today, updatedEndDate: tomorrow, lead_status: 'SV Push', subdisposition: 'SV Appointed Fixed' },
                fuSvFixed: { lead_status: 'Follow Up', subdisposition: 'SV Fixed', updatedStartDate: today, updatedEndDate: tomorrow },
                svPushYD: { updatedStartDate: yesterday, updatedEndDate: yesterday, lead_status: 'SV Push' },
                warm: { lead_type: 'Warm' },
                hot: { lead_type: 'Hot' },
                bookedMTD: { subdisposition: 'Booked With Us', startDate: monthStart },
                bookedYTD: { subdisposition: 'Booked With Us', startDate: yearStart },
                svPushMTD: { updatedStartDate: monthStart, updatedEndDate: tomorrow, lead_status: 'SV Push' },
                svDoneMTD: { startDate: monthStart, endDate: tomorrow, lead_status: 'SV Push', subdisposition: 'Site Visit Done' },
                total: {}
            };

            params = filterMap[filter] || {};
            if (uploadType !== 'all') params.upload_type = uploadType;

            const res = await axios.get(GET_FILTERED_DATA, { params });
            if (res.data.success) setAssigns([...res.data.data].reverse());
            setSelectedFilter(filter);
        } catch (err) {
            console.error(err);
        } finally {
            setIsTableLoading(false);
        }
    }, [uploadType]);

    const fetchStats = useCallback(async () => {
        try {
            const { today, yesterday, tomorrow, monthStart, yearStart } = getDates();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getC = async (p: any) => {
                const finalP = { ...p };
                // if (uploadType !== 'all') finalP.upload_type = uploadType;
                if (uploadType === 'single') {
                    finalP.upload_type = ['single', 'webhook'];
                } else if (uploadType !== 'all') {
                    finalP.upload_type = uploadType;
                }
                const r = await axios.get(GET_FILTERED_DATA, { params: finalP });
                return r.data.count || 0;
            };

            const results = await Promise.all([
                getC({ status: ['assigned', 'auto-assigned'] }),
                getC({ startDate: today, endDate: today, status: 'processed' }),
                getC({ startDate: yesterday, endDate: yesterday }),
                getC({ schedule_date: today, lead_status: 'IN Progress' }),
                getC({ schedule_date: today, lead_status: 'Follow Up' }),
                getC({ updatedStartDate: today, updatedEndDate: today, status: 'processed' }),
                getC({ updatedStartDate: today, updatedEndDate: tomorrow, lead_status: 'SV Push', subdisposition: 'SV Appointed Fixed' }), // sv push today
                getC({ lead_status: ['SV Push', 'Unqualified', 'Follow Up'], updatedStartDate: today, updatedEndDate: today, status: 'processed' }),
                getC({ lead_status: 'IN Progress', updatedStartDate: today, updatedEndDate: today, status: 'processed' }),
                getC({ updatedStartDate: yesterday, updatedEndDate: yesterday, lead_status: 'SV Push' }), // sv push yd
                getC({ lead_status: 'Follow Up', subdisposition: 'SV Fixed', updatedStartDate: today, updatedEndDate: tomorrow }),
                getC({ lead_type: 'Warm' }),
                getC({ lead_type: 'Hot' }),
                getC({ subdisposition: 'Booked With Us', startDate: monthStart }),
                getC({ subdisposition: 'Booked With Us', startDate: yearStart }),
                getC({ updatedStartDate: monthStart, updatedEndDate: tomorrow, lead_status: 'SV Push' }),
                getC({ startDate: monthStart, endDate: tomorrow, lead_status: 'SV Push', subdisposition: 'Site Visit Done' })
            ]);

            const [
                untouched, touched, ydLeads, inProg, fuTdy, totalTdy, svTdy, ans, nAns,
                svYD, fuSV, warm, hot, bookedMTD, bookedYTD, svPushMTD, svDoneMTD
            ] = results;

            setStats({
                untouched, touched, newLeadsYD: ydLeads, inProgToday: inProg, fuToday: fuTdy,
                totalCall: totalTdy, svPushTdy: svTdy, answered: ans, notAnswered: nAns,
                fuSvFixed: fuSV, svPushYD: svYD, warm, hot, bookedMTD, bookedYTD,
                svPushMTD, svDoneMTD
            });
        } catch (err) {
            console.error(err);
        }
    }, [uploadType]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchStats();
            await fetchAssigns('total');
            setIsLoading(false);
        };
        load();
    }, [uploadType, fetchStats, fetchAssigns]);

    if (isLoading) return <CreativeLoader />;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 p-2">
                    <Activity className="text-blue-600" /> Admin Dashboard
                </h1>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    {['all', 'single', 'Bulk'].map((t) => (
                        <button key={t} onClick={() => setUploadType(t)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${uploadType === t ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                <Card label="Untouched" val={stats.untouched} icon={UserPlus} color="blue" active={selectedFilter === 'untouched'} onClick={() => fetchAssigns('untouched')} />
                <Card label="Touched" val={stats.touched} icon={Activity} color="emerald" active={selectedFilter === 'touched'} onClick={() => fetchAssigns('touched')} />
                <Card label="New Leads YD" val={stats.newLeadsYD} icon={Clock} color="amber" active={selectedFilter === 'newLeadsYD'} onClick={() => fetchAssigns('newLeadsYD')} />
                <Card label="In-Prog Tdy" val={stats.inProgToday} icon={RefreshCcw} color="indigo" active={selectedFilter === 'inProgToday'} onClick={() => fetchAssigns('inProgToday')} />
                <Card label="FU Today" val={stats.fuToday} icon={CheckCheck} color="purple" active={selectedFilter === 'fuToday'} onClick={() => fetchAssigns('fuToday')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Card label="Total Calls" val={stats.totalCall} icon={PhoneForwarded} color="sky" active={selectedFilter === 'totalCall'} onClick={() => fetchAssigns('totalCall')} />
                <Card label="Answered" val={stats.answered} icon={CheckCircle2} color="emerald" active={selectedFilter === 'answered'} onClick={() => fetchAssigns('answered')} />
                <Card label="Not Answered" val={stats.notAnswered} icon={Clock} color="red" active={selectedFilter === 'notAnswered'} onClick={() => fetchAssigns('notAnswered')} />
                <Card label="SV Push Tdy" val={stats.svPushTdy} icon={Flame} color="orange" active={selectedFilter === 'svPushTdy'} onClick={() => fetchAssigns('svPushTdy')} />
                <Card label="FU SV Prospect" val={stats.fuSvFixed} icon={CalendarCheck} color="cyan" active={selectedFilter === 'fuSvFixed'} onClick={() => fetchAssigns('fuSvFixed')} />
                <Card label="SV Push YD" val={stats.svPushYD} icon={Clock} color="pink" active={selectedFilter === 'svPushYD'} onClick={() => fetchAssigns('svPushYD')} />
                <Card label="SV Push MTD" val={stats.svPushMTD} icon={Activity} color="indigo" active={selectedFilter === 'svPushMTD'} onClick={() => fetchAssigns('svPushMTD')} />
                <Card label="SV Done MTD" val={stats.svDoneMTD} icon={CheckCheck} color="emerald" active={selectedFilter === 'svDoneMTD'} onClick={() => fetchAssigns('svDoneMTD')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card label="Warm" val={stats.warm} icon={Sun} color="yellow" active={selectedFilter === 'warm'} onClick={() => fetchAssigns('warm')} />
                <Card label="Hot" val={stats.hot} icon={Flame} color="red" active={selectedFilter === 'hot'} onClick={() => fetchAssigns('hot')} />
                <Card label="Booked MTD" val={stats.bookedMTD} icon={CheckCircle2} color="emerald" active={selectedFilter === 'bookedMTD'} onClick={() => fetchAssigns('bookedMTD')} />
                <Card label="Booked YTD" val={stats.bookedYTD} icon={PackageOpen} color="blue" active={selectedFilter === 'bookedYTD'} onClick={() => fetchAssigns('bookedYTD')} />
            </div>

            <section className="flex flex-col md:flex-row gap-4 mb-4 min-w-0">
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex items-center justify-between gap-6 border-l-8 border-red-500 hover:shadow-xl transition-all">
                    <div className="flex-1">
                        <ScheduleTracker />
                        <p className="text-sm text-red-600 font-medium mt-1 uppercase tracking-tighter">Action required immediately</p>
                    </div>
                    <a href="/admin/Dashboard/overdue">
                        <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-orange-400 shadow-lg transform hover:scale-110 transition-all">
                            <ExternalLink size={24} className="text-white" />
                        </div>
                    </a>
                </div>
            </section>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {isTableLoading ? (
                    <div className="p-20 flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-600 mb-2" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Refreshing...</p>
                    </div>
                ) : (
                    <AssignCardTable data={assigns} />
                )}
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Card({ label, val, icon: Icon, color, onClick, active }: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const colors: any = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500',
        amber: 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500',
        purple: 'bg-purple-50 text-purple-700 border-purple-100 ring-purple-500',
        sky: 'bg-sky-50 text-sky-700 border-sky-100 ring-sky-500',
        orange: 'bg-orange-50 text-orange-700 border-orange-100 ring-orange-500',
        cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100 ring-cyan-500',
        pink: 'bg-pink-50 text-pink-700 border-pink-100 ring-pink-500',
        yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100 ring-yellow-500',
        red: 'bg-red-50 text-red-700 border-red-100 ring-red-500',
    };

    return (
        <div onClick={onClick} className={`${colors[color]} border p-4 rounded-xl shadow-sm cursor-pointer transition-all hover:scale-[1.03] flex flex-col justify-between h-28 ${active ? 'ring-2 ring-offset-2' : ''}`}>
            <div className="flex justify-between items-start p-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
                <Icon size={18} className="opacity-60" />
            </div>
            <span className="text-3xl font-black tracking-tighter">{val || 0}</span>
        </div>
    );
}