// components/AdminComponents/ScheduleTracker.tsx (or wherever it's located)
'use client';

import { useEffect, useState, useCallback } from 'react';
import { GET_ALL_SCHEDULES } from '@/config/api';

interface Schedule {
    _id: string;
    title: string;
    start: string;
    end: string;
}

// 1. Define Props to accept the assigneeId
interface ScheduleTrackerProps {
    assigneeId: string;
}

const ScheduleTracker2: React.FC<ScheduleTrackerProps> = ({ assigneeId }) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 2. Use useCallback to ensure fetchSchedules is stable across renders
    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);

            // Construct URL with assignee_id filter
            const params = new URLSearchParams();
            if (assigneeId) {
                // Assuming the API expects the assignee ID as a query parameter named 'assignee_id'
                params.append('assignee_id', assigneeId);
            }

            const url = `${GET_ALL_SCHEDULES}?${params.toString()}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('❌ Failed to fetch schedules');

            const data = await res.json();
            setSchedules(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    }, [assigneeId]); // Depend on assigneeId so it re-fetches when the filter changes

    useEffect(() => {
        fetchSchedules();

        // Optional: refresh every 100s to keep count updated
        const interval = setInterval(fetchSchedules, 100000);
        return () => clearInterval(interval);
    }, [fetchSchedules]); // Depend on fetchSchedules (which depends on assigneeId)

    // Calculate overdue schedules dynamically (no change here)
    const overdueCount = schedules.filter((schedule) => {
        const now = new Date();
        const endTime = new Date(schedule.end);
        return now > endTime;
    }).length;

    return (
        <div>
            <div className="text-gray-600">Overdue Schedules</div>

            {loading ? (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="text-2xl font-bold text-red-700">{overdueCount}</div>
            )}
        </div>
    );
};

export default ScheduleTracker2;