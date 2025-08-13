
'use client';

import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { useRouter } from 'next/navigation';
import { dateFnsLocalizer } from 'react-big-calendar';
import { startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { GET_SCHEDULES_BY_ID } from '@/config/api';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
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
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (!user._id) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const res = await fetch(GET_SCHEDULES_BY_ID(user._id));
                if (!res.ok) throw new Error('Failed to fetch schedules');

                const data = await res.json();

                // Map API data to Calendar event format
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedEvents: Event[] = data.map((item: any) => ({
                    title: item.title || 'No Title',
                    start: new Date(item.start),
                    end: new Date(item.end),
                    leadId: item.lead_id
                }));

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
        <div className="p-4">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
}
