'use client';

import React, { useState } from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    flexRender, // ✅ Import this
} from '@tanstack/react-table';
import ReassignModal from '@/components/AdminComponents/ReassignModal';

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
    history: (HistoryEntry | string)[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        projectSource: string;
        comments: string;
        location: string;
        alternate_phone: string;
        client_budget: string;
        furnished_status: string;
        interested_project: string;
        lead_status: string;
        lead_type: string;
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
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

    const columns: ColumnDef<Assign>[] = [
        {
            header: 'Assigned Date & Time',
            accessorFn: row => row.createdAt,
            id: 'assignedDateTime',
            cell: ({ getValue }) => {
                const date = new Date(getValue() as string);

                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });

                const formattedTime = date.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });

                return `${formattedDate} ${formattedTime}`;
            },
        },
        {
            header: 'Customer Name',
            accessorFn: row => row.lead_details.name,
            id: 'customerName',
        },
        {
            header: 'Phone Number',
            accessorFn: row => row.lead_details.phone,
            id: 'phone',
        },
        {
            header: 'Email',
            accessorFn: row => row.lead_details.email,
            id: 'email',
        },
        {
            header: 'Project Name',
            accessorFn: row => row.lead_details.source,
            id: 'projectName',
        },



    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const toggleExpand = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
            {/* Table */}
            <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                <th className="px-4 py-2"></th>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => {
                            const assign = row.original;
                            const lead = assign.lead_details;
                            const isExpanded = expandedRow === assign._id;

                            return (
                                <React.Fragment key={row.id}>
                                    {/* Main Row */}
                                    <tr className="border-b bg-yellow-50">
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => toggleExpand(assign._id)}
                                                className="p-2 rounded border text-blue-600 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {isExpanded ? '➖' : '➕'}
                                            </button>
                                        </td>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-4 py-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2">
                                            <button
                                                className="px-2 py-1 text-xs bg-orange-500 text-white rounded"
                                                onClick={() => openModal(assign.lead_id)}
                                            >
                                                Reassign
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Row */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={columns.length + 2} className="px-6 py-4">
                                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                            <div>
                                                <strong>Lead Source:</strong> {lead.projectSource || '—'}
                                            </div>
                                                    <div>
                                                        <strong>Lead Type:</strong>{' '}
                                                        {lead.lead_type === 'Hot'
                                                            ? '🔥'
                                                            : lead.lead_type === 'Cold'
                                                                ? '❄️'
                                                                : lead.lead_type === 'Warm'
                                                                    ? '🌤️'
                                                                    : '🙇‍♂️••🚫'}
                                                    </div>
                                                    <div>
                                                        <strong>Remarks:</strong> {assign.remarks || '—'}
                                                    </div>
                                                    <div>
                                                        <strong>Status:</strong> {assign.status}
                                                    </div>
                                                    <div>
                                                        <strong>Assignee:</strong> {assign.assignee_name}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <strong>History:</strong>
                                                        {assign.history?.length ? (
                                                            <ul className="list-disc list-inside">
                                                                {assign.history.map((h, idx) => (
                                                                    <li key={idx} className="text-sm text-gray-700">
                                                                        {typeof h === 'string' ? (
                                                                            <span className="italic text-gray-500">{h}</span>
                                                                        ) : (
                                                                            <span>
                                                                                <strong>{h.assignee_name || 'Unknown'}</strong> updated on{' '}
                                                                                {h.updatedAt
                                                                                    ? new Date(h.updatedAt).toLocaleString()
                                                                                    : 'Unknown date'}{' '}
                                                                                →{' '}
                                                                                <span className="font-medium">{h.status || 'N/A'}</span>
                                                                                {h.remarks && ` (Remarks: ${h.remarks})`}
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <span className="text-gray-500 text-sm">No history available</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && selectedLeadId && (
                <ReassignModal onClose={closeModal} leadId={selectedLeadId} />
            )}
        </div>
    );
}
