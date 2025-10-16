'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { GET_LEAD_DETAILS } from '@/config/api';
import { User, Phone, Mail, Building, Globe, Calendar, Clock } from 'lucide-react';

type LeadInfoCardProps = {
    lead: {
        name: string;
        email: string;
        phone: string;
        source: string;
        createdAt: string;
        projectSource: string;
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
                const response = await axios.get(`${GET_LEAD_DETAILS(leadId)}`);
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
        <div className="shadow-sm border-b border-amber-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {/* Name */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <User className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Name</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">{lead.name}</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Phone className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Phone</p>
                            <a
                                href={`tel:${lead.phone}`}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-1 block transition-colors"
                            >
                                {lead.phone}
                            </a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Mail className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Email</p>
                            <a
                                href={`mailto:${lead.email}`}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-1 block transition-colors break-all"
                            >
                                {lead.email}
                            </a>
                        </div>
                    </div>

                    {/* Project Name */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Building className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Project</p>
                            <p className="text-sm font-bold text-gray-900 mt-1 capitalize">{lead.source}</p>
                        </div>
                    </div>

                    {/* Project Source */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Globe className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Source</p>
                            <p className="text-sm font-bold text-gray-900 mt-1 capitalize">{lead.projectSource}</p>
                        </div>
                    </div>

                    {/* Assigned Date */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Calendar className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Date</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">{assignedDate}</p>
                        </div>
                    </div>

                    {/* Assigned Time */}
                    <div className="flex items-start gap-3 group">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Time</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">{assignedTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
