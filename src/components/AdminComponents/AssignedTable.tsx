'use client';

import React from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';

type Assign = {
    _id: string;
    lead_id: string;
    telecaller_id: string;
    telecaller_name: string;
    status: string;
    remarks: string;
    history: string[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
};

interface Props {
    data: Assign[];
}

export default function AssignCardTable({ data }: Props) {
    const columns: ColumnDef<Assign>[] = [
        {
            accessorKey: 'lead_details.name',
            header: 'Customer Name',
        },
        // 👇 You won’t use columns in the UI but still define them for table row model
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {table.getRowModel().rows.map(row => {
                const lead = row.original.lead_details;
                const assign = row.original;

                return (
                    <div
                        key={row.id}
                        className="bg-white rounded-2xl shadow p-6 flex flex-col space-y-4"
                    >
                        {/* ✅ First row */}
                        <div className="flex flex-wrap  gap-10 ">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Project Name</span>
                                <span>{lead.source}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Customer Name</span>
                                <span>{lead.name}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Time</span>
                                <span>
                                    {new Date(lead.createdAt).toLocaleDateString('en-GB', {
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
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Client Budget</span>
                                <span>60 Lacks</span>
                            </div>
                        </div>

                        {/* ✅ Second row */}
                        <div className="flex flex-wrap justify-between gap-4 items-center">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Client Email</span>
                                <span>{lead.email}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Client Preference</span>
                                <span>2 BHK</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Lead Source</span>
                                <span>{lead.source}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Current Status</span>
                                <span className="flex items-center space-x-1">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span>Site Visit Fixed</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="bg-yellow-200 text-xs px-3 py-1 rounded-md text-blue-600 font-medium">
                                    Assigned to {assign.telecaller_name}
                                </span>
                            </div>
                            <button className="p-2 rounded-full border">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

    );
}
