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
import { GET_ALL_UNASSIGNED_LEADS } from '@/config/api';
import UnassignLeadsBlank from '../Blank/UnassignLeadsBlank';

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
};

export default function LeadTable({ assignbtn }: assignbtntype) {
    const [data, setData] = useState<Lead[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

    // pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0); // backend should return total leads count

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await axios.get(GET_ALL_UNASSIGNED_LEADS, {
                    params: { page, limit: pageSize },
                });

                let leads: Lead[] = res.data.leads || [];

                // filter based on assigned/unassigned
                if (assignbtn === 'assigned') {
                    leads = leads.filter((lead: Lead) => lead.status === 'assigned');
                } else {
                    leads = leads.filter((lead: Lead) => lead.status === 'not-assigned');
                }

                setData(leads);
                setTotal(res.data.total || 0); // assuming backend sends `total`
            } catch (err) {
                console.error(err);
            }
        };
        fetchLeads();
    }, [assignbtn, page, pageSize]);

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
            cell: (info) =>
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
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    return (
        <>
            <div className="flex">
                <h1 className="text-2xl font-bold mb-4">
                    {assignbtn === 'assigned' ? 'Assigned Leads' : 'Unassigned Leads'}
                </h1>
                <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                    <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                        {data.length}
                    </span>
                </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-400 p-2 sm:w-1/5  mb-4">
                <h2 className="text-sm font-extrabold">Total Unassigned  Leads : {total}</h2>
            </div>

            <div className="space-y-4">
                {
                    data.length === 0 ? (
                        <UnassignLeadsBlank />
                    ) :
                        table.getRowModel().rows.map((row) => (
                            <div
                                key={row.id}
                                className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow p-4"
                            >
                                {row.getVisibleCells().map((cell) => (
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
                        ))
                }

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm">
                            Page {page} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <div>
                        <label className="mr-2 text-sm">Rows per page:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1); // reset to first page
                            }}
                            className="border rounded p-1 text-sm"
                        >
                            {[10, 15, 20, 25].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {isModalOpen && selectedLeadId && (
                    <AssignModal
                        onClose={() => setIsModalOpen(false)}
                        leadId={selectedLeadId}
                    />
                )}
            </div>
        </>
    );
}
