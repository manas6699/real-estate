'use client';

import React, { useState } from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import { History } from 'lucide-react';
import AssignType from '@/types/AssignType';

interface Props {
    data: AssignType[];
}

type HistoryEntry =
    | string
    | {
        lead_id?: string;
        assignee_name?: string;
        updatedAt?: string;
        status?: string;
        remarks?: string;
    };

export default function ReportTable({ data }: Props) {
    const [selectedHistory, setSelectedHistory] = useState<HistoryEntry[] | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const columns: ColumnDef<AssignType>[] = [
        { accessorKey: 'lead_details.name', header: 'Customer Name' },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const openSidebar = (history: HistoryEntry[] | undefined) => {
        if (history && history.length > 0) {
            setSelectedHistory(history);
        } else {
            setSelectedHistory([]);
        }
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedHistory(null);
    };

    return (
        <div className="rounded-xl">
            {/* Desktop Table */}
            <div className="hidden md:block relative rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-max border-collapse text-sm rounded-xl">
                        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            <tr>
                                {[
                                    'Assigned Date',
                                    'Time',
                                    'Customer Name',
                                    'Phone',
                                    'Email',
                                    'Project Name',
                                    'Lead Source',
                                    'Client Budget',
                                    'Configuration',
                                    'Admin Remark',
                                    'Disposition Statement',
                                    'Current Status',
                                    'Assignee',
                                    'Location',
                                    'Alternate Phone',
                                    'Furnished Status',
                                    'Interested Project',
                                    'Assign Mode',
                                    'View History',
                                ].map((head, i) => (
                                    <th
                                        key={i}
                                        className="px-4 py-3 whitespace-nowrap border-b bg-blue-100 border-gray-200"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => {
                                const lead = row.original.lead_details;
                                const assign = row.original;

                                return (
                                    <tr key={row.id} className="bg-yellow-300 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(assign.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(assign.createdAt).toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.name}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.phone}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.email || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.source || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.projectSource || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.client_budget || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.preferred_configuration || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{assign.remarks || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.comments || '---'}</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center space-x-1.5">
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full ${assign.status === 'assigned'
                                                        ? 'bg-red-500'
                                                        : 'bg-purple-500'
                                                        }`}
                                                ></span>
                                                <span className="truncate max-w-xs">
                                                    {lead.lead_status || assign.status}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-xs">
                                            {assign.status} → {assign.assignee_name}
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.location || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.alternate_phone || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.furnished_status || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{lead.interested_project || '---'}</td>
                                        <td className="px-4 py-3 truncate max-w-xs">{assign.assign_mode || '---'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => openSidebar(assign.history)}
                                                className="inline-flex items-center justify-center p-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                                                aria-label="View history"
                                            >
                                                <History size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {table.getRowModel().rows.map((row) => {
                    const lead = row.original.lead_details;
                    const assign = row.original;
                    return (
                        <div
                            key={row.id}
                            className="border border-gray-200 rounded-lg p-4 shadow-sm space-y-3 text-sm bg-white"
                        >
                            <p className="flex justify-between">
                                <span className="font-semibold text-gray-700">Customer:</span>
                                <span className="text-right">{lead.name}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold text-gray-700">Phone:</span>
                                <span className="text-right">{lead.phone}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold text-gray-700">Email:</span>
                                <span className="text-right">{lead.email || '---'}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold text-gray-700">Status:</span>
                                <span className="text-right">{assign.status} → {assign.assignee_name}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold text-gray-700">Remarks:</span>
                                <span className="text-right">{assign.remarks || '---'}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold text-gray-700">Date:</span>
                                <span className="text-right">
                                    {new Date(assign.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </p>
                            <button
                                onClick={() => openSidebar(assign.history)}
                                className="flex items-center justify-center w-full py-2 mt-2 text-blue-600 hover:text-blue-800 border border-blue-100 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                                <History className="mr-1.5" size={16} /> View History
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="fixed top-0 right-0 md:w-96 w-full h-full bg-white shadow-xl border-l transform transition-transform duration-300 ease-in-out z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Lead History</h2>
                        <button
                            onClick={closeSidebar}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
                        {selectedHistory && selectedHistory.length > 0 ? (
                            <ul className="space-y-3">
                                {selectedHistory.map((h, idx) => (
                                    <li key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">
                                        {typeof h === 'string' ? (
                                            <span>{h}</span>
                                        ) : (
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <strong className="font-medium text-gray-900">{h.assignee_name || 'Unknown'}</strong>
                                                    <span className="text-xs text-gray-500">
                                                        {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : 'Unknown date'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                        {h.status || 'N/A'}
                                                    </span>
                                                    {h.remarks && (
                                                        <span className="ml-2 text-xs text-gray-600 truncate">
                                                            Remarks: {h.remarks}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <History size={32} className="text-gray-300 mb-2" />
                                <p className="text-sm">No history available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Overlay when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:bg-opacity-0"
                    onClick={closeSidebar}
                ></div>
            )}

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}