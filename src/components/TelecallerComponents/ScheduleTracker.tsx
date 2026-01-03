'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GET_SCHEDULES_BY_ID } from '@/config/api';

interface Schedule {
    _id: string;
    title: string;
    end: string;
    phone?: string; // Added for modal utility
}

interface CustomToast {
    id: string;
    title: string;
}

const ScheduleTracker = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [overdueIds, setOverdueIds] = useState<string[]>([]);
    const [activeToasts, setActiveToasts] = useState<CustomToast[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user?._id) return;
            const res = await fetch(GET_SCHEDULES_BY_ID(user._id));
            const data = await res.json();
            setSchedules(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchedules(); }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const newIds: string[] = [];
            const newToasts: CustomToast[] = [];

            schedules.forEach((s) => {
                if (new Date(s.end) < now && !overdueIds.includes(s._id)) {
                    newIds.push(s._id);
                    if (!activeToasts.find(t => t.id === s._id)) {
                        newToasts.push({ id: s._id, title: s.title });
                    }
                }
            });

            if (newIds.length > 0) setOverdueIds(prev => [...prev, ...newIds]);
            if (newToasts.length > 0) setActiveToasts(prev => [...newToasts, ...prev]);
        }, 5000);
        return () => clearInterval(interval);
    }, [schedules, overdueIds, activeToasts]);

    const dismissToast = (id: string) => setActiveToasts(prev => prev.filter(t => t.id !== id));

    // Filtered overdue list based on search
    const overdueLeads = schedules
        .filter(s => overdueIds.includes(s._id))
        .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className='flex flex-col'>
            {/* CLICKABLE CARD */}
            <div
                onClick={() => overdueIds.length > 0 && setIsModalOpen(true)}
                className={`cursor-pointer group flex flex-col justify-between h-full`}
            >
                <p className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">Overdue Schedules</p>
                {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mt-1" />
                ) : (
                    <div className={`text-2xl font-bold ${overdueIds.length > 0 ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}>
                        {overdueIds.length}
                    </div>
                )}
            </div>

            {/* MODAL OVERLAY */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="p-5 border-b bg-white sticky top-0 z-10">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">Overdue Leads</h3>
                                    <p className="text-xs text-gray-500">You have {overdueLeads.length} urgent follow-ups</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="text-xl">✕</span>
                                </button>
                            </div>

                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>

                        {/* List Content */}
                        <div className="overflow-y-auto flex-1 p-4 space-y-3 bg-gray-50/50">
                            {overdueLeads.length > 0 ? (
                                overdueLeads.map((lead) => (
                                    <div key={lead._id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{lead.title}</p>
                                                <p className="text-[10px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    Missed: {new Date(lead.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/telecaller/Calender`}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                →
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 text-sm">No matching overdue leads found.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t bg-white flex justify-between items-center">
                            <span className="text-xs text-gray-400">Showing {overdueLeads.length} items</span>
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STACKED TOAST CONTAINER */}
            <div className="fixed top-6 right-6 z-[9999] w-80 flex flex-col items-end pointer-events-none">
                {activeToasts.length > 0 && (
                    <>
                        <button
                            onClick={() => setActiveToasts([])}
                            className="mb-4 pointer-events-auto text-[10px] uppercase tracking-wider bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-all font-bold"
                        >
                            Dismiss All ({activeToasts.length})
                        </button>

                        <div className="relative w-full h-32">
                            {activeToasts.map((toast, index) => {
                                // REMOVED UNUSED isTop variable to fix warning
                                const offset = index * 8;
                                const scale = 1 - index * 0.05;

                                return (
                                    <div
                                        key={toast.id}
                                        style={{
                                            zIndex: activeToasts.length - index,
                                            transform: `translateY(${offset}px) scale(${scale})`,
                                            opacity: index > 2 ? 0 : 1 - index * 0.2,
                                            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}
                                        className="absolute top-0 right-0 w-full bg-white border border-amber-200 shadow-2xl rounded-2xl p-4 flex justify-between items-start pointer-events-auto"
                                    >
                                        <div className="text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                                <span className="text-amber-700 text-[10px] font-bold uppercase tracking-widest">Urgent Task</span>
                                            </div>
                                            <p className="text-gray-900 font-bold leading-tight mb-3">
                                                {toast.title}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    dismissToast(toast.id);
                                                }}
                                                className="text-white bg-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-700 transition-colors text-[10px]"
                                            >
                                                VIEW DETAILS
                                            </button>
                                        </div>
                                        <button onClick={() => dismissToast(toast.id)} className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">✕</button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ScheduleTracker;