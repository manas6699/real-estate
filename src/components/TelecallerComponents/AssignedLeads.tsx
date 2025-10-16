'use client'
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';


import { useState } from "react";
import axios from "axios";
import { GET_LEAD_HISTORY } from '@/config/api';
import { Activity, Building, CalendarDays, Edit3, History, Mail, MessageSquare, Phone, Upload, User } from 'lucide-react';


// types
type HistoryObject = {
    lead_id: string;
    assignee_name: string;
    updatedAt: string;
    status: string;
    remarks?: string;
};
type HistoryEntry = string | HistoryObject;

type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    history: string[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        upload_type: string;
        lead_status: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string
};

interface Props {
    data: Assign[];
}

export default function AssignedLeads({ data }: Props) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const router = useRouter();

    // Update fetchLeadHistory to accept a leadId
    const fetchLeadHistory = async (leadId: string) => {
        try {
            const res = await axios.get(GET_LEAD_HISTORY(leadId), {
                params: { t: Date.now() }, // cache-buster
                headers: { 'Cache-Control': 'no-cache' },
            });

            // prefer `res.data.data` if present; else fallback to `res.data`
            const payload = res?.data?.data ?? res?.data ?? [];
            const arr: HistoryEntry[] = Array.isArray(payload) ? payload : [payload];

            setHistory(arr.filter(Boolean));
            setShowHistory(true);
        } catch (err) {
            console.error('Failed to fetch history:', err);
            setHistory([]);
            setShowHistory(true); // still open modal to show message
        }
    };

    const columns: ColumnDef<Assign>[] = [
        {
            accessorKey: 'lead_details.name',
            header: 'Customer Name',
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className='flex'>
                <h1 className="text-2xl font-bold mb-4">Lead Count</h1>
                <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                    <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                        {data.length}
                    </span>
                </div>
            </div>

            {/* Cards */}
            {[...table.getRowModel().rows].map((row) => {
                const lead = row.original.lead_details;
                const assign = row.original;
                // const isLatest = (assign._id === latestLeadId && assign.status === 'assigned');
                const isLatest = (assign.status === 'assigned');

                return (
                    <div
                        key={row.id}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                        {/* NEW Badge with better positioning */}
                        {isLatest && (
                            <div className="absolute -top-0 -left-2 z-50">
                                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                    TAKE ACTION
                                </span>
                            </div>
                        )}

                        {/* Background subtle pattern for latest lead */}
                        {isLatest && (
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/20 pointer-events-none"></div>
                        )}

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10 mt-2">

                            {/* Column 1: Date & Project */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <CalendarDays className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(assign.updatedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(assign.createdAt).toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Building className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</p>
                                        <p className="text-sm font-medium text-gray-900">{lead.source}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Customer Info */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <User className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</p>
                                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <Phone className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {lead.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Contact & Details */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <Mail className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                                        <a
                                            href={`mailto:${lead.email}`}
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors break-all"
                                        >
                                            {lead.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <Upload className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Type</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {lead.upload_type === 'single' ? (
                                                <span className="text-green-600">In House</span>
                                            ) : (
                                                <span className="text-blue-600">Data Sheet</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4: Status & Disposition */}
                            <div className="space-y-4">
                                {assign.lead_details.lead_status && assign.lead_details.lead_status.trim() !== "" && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-yellow-50 rounded-lg">
                                            <MessageSquare className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disposition</p>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {assign.lead_details.lead_status}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Activity className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assign.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                            assign.status === 'processed' ? 'bg-green-100 text-green-800' :
                                                assign.status === 'transferred' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {assign.status.charAt(0).toUpperCase() + assign.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 5: Actions */}
                            <div className="flex flex-col gap-3 justify-center">
                                <button
                                    onClick={() => router.push(`/telecaller/change/${assign.lead_id}`)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Fill Details
                                </button>

                                <button
                                    onClick={() => fetchLeadHistory(assign._id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
                                >
                                    <History className="w-4 h-4" />
                                    View History
                                </button>
                            </div>
                        </div>

                        {/* Bottom border accent for latest lead */}
                        {isLatest && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                        )}
                    </div>
                );
            })}


            {showHistory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Lead History</h2>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {history.length > 0 ? (
                                <ul className="space-y-2">
                                    {[...history].reverse().map((item, idx) => {
                                        if (typeof item === 'string') {
                                            return (
                                                <li key={idx} className="text-sm text-gray-700 border-b pb-2 bg-gray-50 p-3 rounded">
                                                    {item}
                                                </li>
                                            );
                                        }
                                        const formatted = item.updatedAt
                                            ? new Date(item.updatedAt).toLocaleString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true,
                                            })
                                            : '—';

                                        return (
                                            <li key={idx} className="text-sm text-gray-700 border-b pb-2">
                                                <div>
                                                    <strong>{item.assignee_name}</strong> updated this lead on {formatted} with status:{' '}
                                                    <span className="font-semibold">{item.status}</span>
                                                </div>
                                                {item.remarks && (
                                                    <div className="mt-1 text-gray-600">
                                                        <span className="font-medium">Remarks:</span> {item.remarks}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No history available.</p>
                            )}
                        </div>


                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowHistory(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
