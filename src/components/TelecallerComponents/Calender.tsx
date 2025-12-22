'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import { enUS } from 'date-fns/locale/en-US';
import { GET_SCHEDULES_BY_ID } from '@/config/api';

const locales = {
    'en-US': enUS,
};

// Setup the localizer
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface Event {
    title: string;
    start: Date;
    end: Date;
    leadId: string;
}

export default function TelecallerCalendar() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const userString = localStorage.getItem('user');
                if (!userString) return;

                const user = JSON.parse(userString);
                if (!user._id) return;

                const res = await fetch(GET_SCHEDULES_BY_ID(user._id));
                if (!res.ok) throw new Error('Failed to fetch schedules');

                const data = await res.json();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedEvents: Event[] = data.map((item: any) => {
                    // Convert the UTC string from backend into a real Javascript Date object
                    // JS Date objects automatically adjust to the user's local timezone (IST)
                    const startDate = new Date(item.start);
                    const endDate = new Date(item.end);

                    return {
                        title: item.title || 'No Title',
                        start: startDate,
                        end: endDate,
                        leadId: item.lead_id
                    };
                });

                setEvents(mappedEvents);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, []);

    const handleSelectEvent = (event: Event) => {
        router.push(`/telecaller/lead/${event.leadId}`);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleSelectEvent}
                // Optional: Force the calendar to start the week on Monday
                culture='en-US'
            />
        </div>
    );
}