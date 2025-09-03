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
        lead_status: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
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

    // ✅ Only compute latestLeadId if data is not empty
    const latestLeadId =
        data.length > 0
            ? data.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt)
                    ? current
                    : latest
            )._id
            : null;

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
            {[...table.getRowModel().rows].reverse().map(row => {
                const lead = row.original.lead_details;
                const assign = row.original;

                // check if this row is the latest
                const isLatest = (assign._id === latestLeadId && assign.status === 'assigned');
                return (
                    <div
                        key={row.id}
                        className="bg-white rounded-2xl shadow p-6 flex flex-col space-y-4 transition relative"
                    >
                        {/* ✅ Add NEW Tag only for the latest */}
                        {isLatest && (
                            <span
                                className="absolute -left-4 top-0 animate-ping z-50 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                NEW
                            </span>
                        )}

                        {/* ✅ First row */}
                        <div className="flex flex-wrap justify-between gap-10">
                            <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Date & Time</span>
                                <span>
                                    {new Date(assign.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                    {' '}
                                    {new Date(assign.createdAt).toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                </span>
                            </div>
                            <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Project Name</span>
                                <span>{lead.source}</span>
                            </div>
                            <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Customer Name</span>
                                <span>{lead.name}</span>
                            </div>
                            <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Client Email</span>
                                <span>{lead.email}</span>
                            </div>
                            <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Phone</span>
                                <span>{lead.phone}</span>
                            </div>
                        </div>

                        {/* ✅ Second row */}
                        <div className="flex flex-wrap justify-between gap-4">
                            {/* <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Last Remark</span>
                                <span>{assign.remarks}</span>
                            </div> */}

                            <div className="flex flex-col text-sm text-gray-500">
                                <span className="font-medium text-black">Lead Source</span>
                                <span>{lead.source}</span>
                            </div>
                            {assign.lead_details.lead_status && assign.lead_details.lead_status.trim() !== "" ? (
                                <div className="flex flex-col text-sm text-gray-500">
                                    <span className="font-medium text-black">Disposition</span>
                                    <span>{assign.lead_details.lead_status}</span>
                                </div>
                            ) : null}
                            <div className="flex items-center">
                                <span className="bg-yellow-200 text-sm px-3 py-1 rounded-md text-blue-600 font-medium">
                                    {assign.status}
                                </span>
                            </div>

                            <button
                                className="px-2 rounded bg-orange-500 cursor-pointer"
                                onClick={() => router.push(`/telecaller/change/${assign.lead_id}`)}
                            >
                                <span className="text-sm text-white">Fill Details</span>
                            </button>

                            <button
                                className="px-2 rounded bg-orange-500 text-white cursor-pointer"
                                onClick={() => fetchLeadHistory(assign._id)} // or assign._id depending on API
                            >
                                View All History
                            </button>
                        </div>
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
                                    {history.map((item, idx) => {
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
