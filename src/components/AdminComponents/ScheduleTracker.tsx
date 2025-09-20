'use client';

import { useEffect, useState } from 'react';
import { GET_ALL_SCHEDULES } from '@/config/api';

interface Schedule {
    _id: string;
    title: string;
    start: string;
    end: string;
}

const ScheduleTracker = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSchedules = async () => {
        try {
            setLoading(true);

            const res = await fetch(GET_ALL_SCHEDULES);
            if (!res.ok) throw new Error('❌ Failed to fetch schedules');

            const data = await res.json();
            // ✅ API gives { success: true, data: [...] }
            setSchedules(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();

        // ✅ Optional: refresh every 100s to keep count updated
        const interval = setInterval(fetchSchedules, 100000);
        return () => clearInterval(interval);
    }, []);

    // ✅ Calculate overdue schedules dynamically
    const overdueCount = schedules.filter((schedule) => {
        const now = new Date();
        const endTime = new Date(schedule.end);
        return now > endTime;
    }).length;

    return (
        <div>
            <div className="text-gray-600">Overdue</div>

            {loading ? (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                    {/* <span className="text-gray-500 text-sm">Checking schedules...</span> */}
                </div>
            ) : (
                <div className="text-2xl font-bold">{overdueCount}</div>
            )}
        </div>
    );
};

export default ScheduleTracker;
