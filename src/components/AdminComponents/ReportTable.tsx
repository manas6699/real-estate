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
        comments: string,
        location: string,
        alternate_phone: string,
        client_budget: string,
        furnished_status: string,
        interested_project: string,
        lead_status: string,
        preferred_configuration: string,
        preferred_floor: string,
        property_status: string,
        createdAt: string;
        updatedAt: string;
    };
};

interface Props {
    data: Assign[];
}

export default function ReportTable({ data }: Props) {

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
                <h1 className="text-2xl font-bold mb-4">View Report</h1>
                <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                    <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                        {data.length}
                    </span>
                </div>
            </div>

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
                                <span className="font-medium text-black">Remarks</span>
                                <span>{assign.remarks}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Assigned Date</span>
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
                                <span className="font-medium text-black">Current Status</span>
                                <span className="flex items-center space-x-1">
                                    <span className={`h-2 w-2 rounded-full ${assign.status === 'assigned' ? 'bg-yellow-500' : 'bg-purple-500'}`}></span>
                                    <span>{lead.lead_status ? lead.lead_status : assign.status}</span>
                                </span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Remarks</span>
                                <span className="flex items-center space-x-1">
                                    
                                    <span>{lead.comments}</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="bg-yellow-200 text-xs px-3 py-1 rounded-md text-blue-600 font-medium">
                                    {assign.status} by {assign.assignee_name}
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
