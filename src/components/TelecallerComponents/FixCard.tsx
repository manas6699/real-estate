'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { GET_LEAD_BY_TELECALLER_ID } from '@/config/api';

type LeadInfoCardProps = {
    lead: {
        name: string;
        email: string;
        phone: string;
        source: string;
        createdAt: string;
    };
};

type leadIdtype = {
    leadId: string;
}

export default function FixCard({ leadId }: leadIdtype) {
    const [lead, setLead] = useState<LeadInfoCardProps['lead'] | null>(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(`${GET_LEAD_BY_TELECALLER_ID(leadId)}`);
                setLead(response.data.lead);
            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        fetchLead();
    }, [leadId]);

    if (!lead) {
        return <div>Loading...</div>;
    }

    const assignedDate = lead.createdAt
        ? new Date(lead.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }) : '';

    const assignedTime = lead.createdAt
        ? new Date(lead.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }) : '';

    return (
        <div className="bg-yellow-100 shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{lead.name}</p>
                </div>
               
                <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{lead.phone}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Source</p>
                    <p className="font-medium capitalize">{lead.source}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Assigned Date</p>
                    <p className="font-medium">{assignedDate}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Assigned Time</p>
                    <p className="font-medium">{assignedTime}</p>
                </div>
            </div>
        </div>
    );
}
