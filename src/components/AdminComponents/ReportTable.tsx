'use client';

import React from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';

import AssignType from '@/types/AssignType'

interface Props {
    data: AssignType[];
}

export default function ReportTable({ data }: Props) {

    const columns: ColumnDef<AssignType>[] = [
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
            {/* Cards */}
            {table.getRowModel().rows.map(row => {
                const lead = row.original.lead_details;
                const assign = row.original;

                return (
                    <div
                        key={row.id}
                        className="bg-white rounded-2xl shadow p-6 flex flex-col space-y-4"
                    >
                        {/* ✅ First row */}
                        <div className="flex flex-wrap justify-between gap-10">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Project Name</span>
                                <span>{lead.source}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Customer Name</span>
                                <span>{lead.name}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Admin Remark</span>
                                <span>{assign.remarks}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Assigned Date</span>
                                <span>
                                    {new Date(assign.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Phone</span>
                                <span>{lead.phone}</span>
                            </div>
                        </div>

                        {/* ✅ Second row */}
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Client Email</span>
                                <span>{lead.email}</span>
                            </div>

                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Lead Source</span>
                                <span>{lead.source}</span>
                            </div>

                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Disposition Statement</span>
                                <span>{lead.comments || '------'}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Current Status</span>
                                <span className="flex items-center space-x-1">
                                    <span className={`h-2 w-2 rounded-full ${assign.status === 'assigned' ? 'bg-red-500' : 'bg-purple-500'}`}></span>
                                    <span>{lead.lead_status ? lead.lead_status : assign.status}</span>
                                </span>
                            </div>
                            
                            <div className="flex items-center">
                                <span className="bg-yellow-200 text-xs px-3 py-1 rounded-md text-blue-600 font-medium">
                                    {assign.status} to {assign.assignee_name}
                                </span>
                            </div>

                        </div>

                        {/* ✅ Third row */}
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Location</span>
                                <span>{lead.location || "-----"}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Alternate Phone</span>
                                <span>{lead.alternate_phone || "-----"}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Client Budget</span>
                                <span>{lead.client_budget || "-----"}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Furnished Status</span>
                                <span>{lead.furnished_status || "-----"}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Interested Project</span>
                                <span>{lead.interested_project || "-----"}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
