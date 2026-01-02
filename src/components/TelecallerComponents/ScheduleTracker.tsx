'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GET_SCHEDULES_BY_ID } from '@/config/api';

interface Schedule {
    _id: string;
    title: string;
    end: string;
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

    // Fetch Logic
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

    // Tracker Logic
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

    return (
        <div className='flex flex-col'>
            <p className="text-gray-600 text-sm font-medium">Overdue Schedules</p>
            {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mt-1" />
            ) : (
                <div className="text-2xl font-bold">{overdueIds.length}</div>
            )}

            {/* STACKED TOAST CONTAINER */}
            <div className="fixed top-6 right-6 z-[9999] w-80 flex flex-col items-end">
                {activeToasts.length > 0 && (
                    <>
                        <button
                            onClick={() => setActiveToasts([])}
                            className="mb-4 text-[10px] uppercase tracking-wider bg-red-600 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-red-700 transition-all font-bold"
                        >
                            Clear All ({activeToasts.length})
                        </button>

                        <div className="relative w-full h-32">
                            {activeToasts.map((toast, index) => {
                                // Reverse index so index 0 is on top
                                const isTop = index === 0;
                                // Visual offset for the stack
                                const offset = index * 6;
                                const scale = 1 - index * 0.05;

                                return (
                                    <div
                                        key={toast.id}
                                        style={{
                                            zIndex: activeToasts.length - index,
                                            transform: `translateY(${offset}px) scale(${scale})`,
                                            opacity: index > 2 ? 0 : 1 - index * 0.2, // Fade out deeper items
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                        className={`absolute top-0 right-0 w-full bg-white border border-amber-200 shadow-xl rounded-lg p-4 flex justify-between items-start ${!isTop ? 'pointer-events-none' : 'pointer-events-auto'}`}
                                    >
                                        <div className="text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">URGENT</span>
                                                <span className="text-gray-400 text-[10px]">#{activeToasts.length - index}</span>
                                            </div>
                                            <p className="text-gray-900 font-semibold leading-tight mb-2">
                                                &quot;{toast.title}&quot; is overdue
                                            </p>
                                            <Link
                                                href="/telecaller/Calender"
                                                onClick={() => dismissToast(toast.id)}
                                                className="text-blue-600 font-bold hover:underline"
                                            >
                                                OPEN CALENDAR →
                                            </Link>
                                        </div>

                                        <button
                                            onClick={() => dismissToast(toast.id)}
                                            className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            ✕
                                        </button>
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