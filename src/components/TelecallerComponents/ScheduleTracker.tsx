'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
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
            const now = new Date();
            const newOverdueIds: string[] = [];

            schedules.forEach((schedule) => {
                const endTime = new Date(schedule.end);

                // Check if time is passed AND we haven't already tracked this specific ID
                if (now > endTime && !overdueIds.includes(schedule._id)) {
                    newOverdueIds.push(schedule._id);
                    const toastId = schedule._id;

                    // Only trigger if toast isn't currently visible
                    if (!toast.isActive(toastId)) {
                        toast.info(
                            <section className='text-xs'>
                                ⏰ Schedule &quot;<b>{schedule.title}</b>&quot; has exceeded time!{" "}
                                <br />
                                <Link
                                    href="/telecaller/Calender"
                                    // Manually dismiss when clicking the link to ensure it closes on navigation
                                    onClick={() => toast.dismiss(toastId)}
                                    style={{
                                        textDecoration: "underline",
                                        color: "#ff4444",
                                        display: "inline-block"
                                    }}
                                >
                                    VIEW CALENDAR
                                </Link>
                            </section>,
                            {
                                toastId: toastId,
                                position: "top-right",
                                // autoClose: false,      // Stays open until clicked
                                closeOnClick: true,    // Dismisses when clicked
                                draggable: true,
                                pauseOnHover: true,
                            }
                        );
                    }
                }
            });

            // Update state only if we found new items to avoid re-renders
            if (newOverdueIds.length > 0) {
                setOverdueIds((prev) => [...prev, ...newOverdueIds]);
            }

        }, 5000); // Checked every 5 seconds

        return () => clearInterval(interval);
    }, [schedules, overdueIds]);

    return (
        <div className='flex flex-col'>
            <p className="text-gray-600">Missed Follow Up</p>

            {loading ? (
                <div className="flex items-center space-x-2 pt-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="text-2xl font-bold pt-2">{overdueIds.length}</div>
            )}

            {/* newestOnTop={true}: Makes the new toasts stack on top of old ones 
                closeOnClick: Ensures clicking dismisses them
            */}
            <ToastContainer
                position="top-right"
                newestOnTop={true}
                stacked={true}
            />
        </div>
    );
};

export default ScheduleTracker;