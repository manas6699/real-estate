'use client';

import React, { useEffect, useState } from 'react';
import AssignModal from './AssignModal';
import axios from 'axios';
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { GET_ALL_LEADS } from '@/config/api';

type Lead = {
    _id: string;
    name: string;
    phone: string;
    source: string;
    status: string;
    createdAt: string;
};

type assignbtntype = {
    assignbtn?: string;
}

export default function LeadTable({ assignbtn }: assignbtntype) {
    const [data, setData] = useState<Lead[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);


    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await axios.get(GET_ALL_LEADS);
                // if assignbtn is assigned then filter lead.status to 'assigned'
                if (assignbtn === 'assigned') {
                    const assignedLeads = res.data.leads.filter(
                        (lead: Lead) => lead.status === 'assigned'
                    );
                    setData(assignedLeads);
                    return;
                }
                else {
                    const unassignedLeads = res.data.leads.filter(
                        (lead: Lead) => lead.status === 'not-assigned'
                    );

                    setData(unassignedLeads);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchLeads();
    }, [assignbtn]);


    const columns: ColumnDef<Lead>[] = [
        {
            accessorKey: 'source',
            header: 'Project Name',
        },
        {
            accessorKey: 'name',
            header: 'Customer Name',
        },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: info =>
                new Date(info.getValue() as string).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }),
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
        },
        {
            accessorKey: 'budget',
            header: 'Client budget',
            cell: () => '60 Lacks',
        },
        {
            id: 'assign',
            header: '',
            cell: ({ row }) => (
                <button
                    onClick={() => {
                        setSelectedLeadId(row.original._id);
                        setIsModalOpen(true);
                    }}
                    className={`px-4 py-2 rounded ${assignbtn === 'assigned'
                            ? 'bg-blue-600 text-white'
                            : 'bg-orange-500 text-white'
                        }`}
                >
                    {assignbtn === 'assigned' ? 'Reassign' : 'Assign'}
                </button>
            ),
        },
        {
            id: 'select',
            header: 'Select',
            cell: () => <input type="checkbox" />,
        },
    ];


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {table.getRowModel().rows.map(row => (
                <div
                    key={row.id}
                    className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow p-4"
                >
                    {row.getVisibleCells().map(cell => (
                        <div
                            key={cell.id}
                            className="flex-1 mb-2 md:mb-0 md:mr-4 text-left"
                        >
                            <div className="text-xs flex justify-center text-gray-400">
                                {cell.column.columnDef.header as string}
                            </div>
                            <div className="font-medium items-center flex justify-center mt-2">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {isModalOpen && selectedLeadId && (
                <AssignModal
                    onClose={() => setIsModalOpen(false)}
                    leadId={selectedLeadId} // ✅ pass it as prop
                />
            )}
        </div>
    );
    
}
