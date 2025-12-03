'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { whoami } from '@/utils/whoami';
import { EDIT_BASIC_LEAD_DETAILS, GET_LEAD_DETAILS } from '@/config/api';
import { User, Phone, Mail, Building, Globe, Calendar, Clock, Pencil, X, Save, Loader2 } from 'lucide-react';

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

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(`${GET_LEAD_DETAILS(leadId)}`);
                setLead(response.data.lead);
            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        if (leadId) {
            fetchLead();
        }
    }, [leadId]);

    // Initialize form data when entering edit mode
    const handleEditClick = () => {
        if (lead) {
            setFormData({
                name: lead.name,
                email: lead.email
            });
            setIsEditing(true);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lead) return;
        const me = whoami();
        setIsUpdating(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                updated_by: me
            };

            const response = await axios.put(EDIT_BASIC_LEAD_DETAILS(leadId), payload);

            if (response.status === 200) {
                // Update local state to reflect changes immediately
                setLead(prev => prev ? { ...prev, name: formData.name, email: formData.email } : null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Failed to update lead details.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!lead) {
        return <div className="p-4 text-center text-gray-500">Loading details...</div>;
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
        <>
            <div className="shadow-sm border-b border-amber-100 relative bg-white">
                <div className="max-w-7xl mx-auto px-4 py-4">

                    {/* Header Row with Edit Button */}
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={handleEditClick}
                            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors bg-amber-50 px-3 py-1 rounded-full border border-amber-200"
                        >
                            <Pencil className="w-3 h-3" />
                            Edit Details
                        </button>
                    </div>

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

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                                <Pencil className="w-5 h-5" />
                                Edit Basic Details
                            </h3>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-shadow sm:text-sm"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-shadow sm:text-sm"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}