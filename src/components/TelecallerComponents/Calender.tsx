/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

// 👇 You'll use moment or date-fns for localizer.
// This uses date-fns:
import { dateFnsLocalizer } from 'react-big-calendar';

import { parse, startOfWeek, getDay } from 'date-fns';
import {enUS} from 'date-fns/locale/en-US';

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

    // Example: fetched from DB
    const [events, setEvents] = useState<Event[]>([
        {
            title: 'Call John Doe',
            start: new Date(2025, 6, 29, 10, 0),
            end: new Date(2025, 6, 29, 10, 30),
            leadId: '123456',
        },
        {
            title: 'Follow-up with Jane',
            start: new Date(2025, 6, 30, 14, 0),
            end: new Date(2025, 6, 30, 14, 30),
            leadId: '654321',
        },
    ]);

    const handleSelectEvent = (event: Event) => {
        // Example: Go to lead details page
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
