'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GET_SCHEDULES_BY_ID } from '@/config/api';

interface Schedule {
    _id: string;
    title: string;
    start: string;
    end: string;
}

const ScheduleTracker = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [overdueIds, setOverdueIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSchedules = async () => {
        try {
            setLoading(true);

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user._id) {
                console.error('❌ User ID not found in localStorage');
                setLoading(false);
                return;
            }

            const res = await fetch(GET_SCHEDULES_BY_ID(user._id));
            if (!res.ok) throw new Error('❌ Failed to fetch schedules');

            const data = await res.json();
            setSchedules(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(true); // show loading while checking

            const now = new Date();
            const newOverdueIds: string[] = [];

            schedules.forEach((schedule) => {
                const endTime = new Date(schedule.end);
                if (now > endTime && !overdueIds.includes(schedule._id)) {
                    newOverdueIds.push(schedule._id);
                    const toastId = schedule._id;

                    if (!toast.isActive(toastId)) {
                        toast.error(`⏰ Schedule "${schedule.title}" has exceeded time!`, {
                            toastId,
                            autoClose: false,
                            closeOnClick: true,
                            draggable: true,
                        });
                    }
                }
            });

            if (newOverdueIds.length > 0) {
                setOverdueIds((prev) => [...prev, ...newOverdueIds]);
            }

            setLoading(false); // hide loading once done
        }, 10000);

        return () => clearInterval(interval);
    }, [schedules, overdueIds]);

    return (
        <div>
            <div className="text-gray-600">Overdue</div>

            {loading ? (
                <div className="flex items-center space-x-2">
                    {/* Spinner */}
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-sm">Checking schedules...</span>
                </div>
            ) : (
                <div className="text-2xl font-bold">{overdueIds.length}</div>
            )}

            <ToastContainer position="top-right" />
        </div>
    );
};

export default ScheduleTracker;
