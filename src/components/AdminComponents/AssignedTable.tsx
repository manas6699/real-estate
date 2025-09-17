'use client';

import React, { useState } from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import ReassignModal from '@/components/AdminComponents/ReassignModal'; // ✅ Import your modal

type HistoryEntry = {
    lead_id: string;
    assignee_name: string;
    updatedAt: string;
    status: string;
    remarks: string;
};

type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    history: HistoryEntry[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        comments: string;
        location: string;
        alternate_phone: string;
        client_budget: string;
        furnished_status: string;
        interested_project: string;
        lead_status: string;
        lead_type:string;
        preferred_configuration: string;
        preferred_floor: string;
        property_status: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
};

interface Props {
    data: Assign[];
}

export default function AssignCardTable({ data }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedAssign, setSelectedAssign] = useState<Assign | null>(null);

    // ✅ Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

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

    const openSidebar = (assign: Assign) => {
        setSelectedAssign(assign);
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedAssign(null);
    };

    // ✅ Modal handlers
    const openModal = (leadId: string) => {
        setSelectedLeadId(leadId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLeadId(null);
    };

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className='flex'>
                <h1 className="text-2xl font-bold mb-4">Assigned Leads</h1>
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
                                <span className="font-medium text-black">Lead Type</span>
                                <span>
                                    {lead.lead_type === 'Hot' ? '🔥' :
                                        lead.lead_type === 'Cold' ? '❄️' :
                                            lead.lead_type === 'Warm' ? '🌤️' : '🙇‍♂️••🚫'}

                                </span>
                            </div>
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
                                <span className="font-medium text-black">Current Status</span>
                                <span className="flex items-center space-x-1">
                                    <span className={`h-2 w-2 rounded-full ${assign.status === 'assigned' ? 'bg-yellow-500' : 'bg-purple-500'}`}></span>
                                    <span>{lead.lead_status ? lead.lead_status : assign.status}</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="bg-yellow-200 text-xs px-3 py-1 rounded-md text-blue-600 font-medium">
                                    {assign.status} to {assign.assignee_name}
                                </span>
                            </div>

                            {/* ✅ Reassign button */}
                            <button
                                className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                                onClick={() => openModal(assign.lead_id)}
                            >
                                Reassign
                            </button>

                            <button
                                className="p-2 rounded-full border"
                                onClick={() => openSidebar(assign)}
                            >
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

            {/* ✅ Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Lead History</h2>
                    <button onClick={closeSidebar} className="text-gray-500 hover:text-black">
                        ✕
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    {selectedAssign?.history && selectedAssign.history.length > 0 ? (
                        <ul className="space-y-2">
                            {selectedAssign.history.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-700 border-b pb-2">
                                    {typeof item === "string" ? (
                                        <div>{item}</div>
                                    ) : (
                                        <div>
                                            <strong>{item.assignee_name || "Unknown"}</strong> updated this lead on{" "}
                                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Unknown date"}{" "}
                                            with status: {item.status || "N/A"} {item.remarks && `Remarks: ${item.remarks}`}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No history available.</p>
                    )}
                </div>
            </div>

            {/* ✅ Assign Modal */}
            {isModalOpen && selectedLeadId && (
                <ReassignModal
                    onClose={closeModal}
                    leadId={selectedLeadId}
                />
            )}
        </div>
    );
}
