'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigation, SquareMousePointer } from 'lucide-react';
import AssignModal from '@/components/AdminComponents/AssignModal';

import UnassignLeadsBlank from '@/components/Blank/UnassignLeadsBlank';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, } from '@tanstack/react-table';
import { GET_ALL_UNASSIGNED_LEADS, GET_ALL_TELECALLERS_API, BULK_ASSIGN_API } from '@/config/api';

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
    // bulk assign modal
    const [bulkModal, setBulkModal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telecallerList, setTelecallerList] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectTelecaller, setSelectTelecaller] = useState<any>("");
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    // remarks state
    const [remarks, setRemarks] = useState("")
    // selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const allSelected = data.length > 0 && selectedIds.length === data.length;

    // pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    // filter states
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        source: '',
        projectSource: '',
    });


    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await axios.get(GET_ALL_UNASSIGNED_LEADS, {
                    params: {
                        page,
                        limit: pageSize,
                        startDate: filters.startDate || undefined,
                        endDate: filters.endDate || undefined,
                        source: filters.source || undefined,
                        projectSource: filters.projectSource || undefined,
                    },
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
                setSelectedIds([]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLeads();
    }, [assignbtn, page, pageSize, filters]);

    useEffect(() => {
        if (bulkModal) {
            axios.get(GET_ALL_TELECALLERS_API).then((res) => {
                setTelecallerList(res.data?.data || []);
            }).catch((err) => {
                console.error("Error fetching telecaller list", err);
            })
        }
    }, [bulkModal])

    const handleBulkAssign = async () => {
        // basic validations
        if (selectedIds.length === 0) {
            alert("Please select at least one lead to assign.");
            return;
        }
        if (!selectTelecaller) {
            alert("Please select a telecaller first!");
            return;
        }

        // IMPORTANT FIX: compare against selectTelecaller (state), not setSelectTelecaller (setter)
        const telecaller = telecallerList.find((t) => t.name === selectTelecaller);

        if (!telecaller) {
            console.log("Telecaller not found. telecallerList:", telecallerList, "selectTelecaller:", selectTelecaller);
            alert("Selected telecaller not found.");
            return;
        }
        const historyMessage = `This Lead has been assigned to ${telecaller.name}  at ${new Date().toISOString()} with remarks: "${remarks}"`;

        const payload = {
            lead_ids: selectedIds,
            assignee_id: telecaller.id,
            assignee_name: telecaller.name || "Unknown",
            history: [historyMessage],
            remarks,
        };
        console.log(payload)

        try {

            const res = await axios.post(BULK_ASSIGN_API, payload);
            alert(res.data?.message || "Leads assigned successfully!");
            setBulkModal(false);
            setSelectedIds([]); // clear selected leads after success

            // optional: refresh leads list — trigger the same fetch used in your useEffect
            // simplest quick trick: reset page which will trigger the useEffect fetch
            setPage(1);
            // or better: extract fetchLeads into a function and call it here (see note below)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Bulk assignment failed:", err);
            alert(err?.response?.data?.message || "Something went wrong");
        }
    };


    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map((lead) => lead._id));
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };


    const columns: ColumnDef<Lead>[] = [
        {
            id: 'select',
            header: 'Action',
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.original._id)}
                    onChange={() => toggleSelectOne(row.original._id)}
                />
            ),
        },
        {
            accessorKey: 'source',
            header: 'Project Name',
        },
        {
            accessorKey: 'projectSource',
            header: 'Project Source',
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
            accessorKey: 'upload_by',
            header: 'Upload By',
        },
        {
            accessorKey: 'upload_type',
            header: 'Type',
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

            {/* ✅ Show selected IDs for debugging */}
            {/* <div className="mb-2 text-sm text-gray-600">
                Selected IDs: {selectedIds.join(', ') || 'None'}
            </div> */}
            {/* ✅ Toggle select */}
            <div className="mb-4 text-sm text-gray-600">
                {/* 🔍 Filters */}
                <div className="flex flex-wrap gap-3 mb-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                            className="border rounded p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                            }
                            className="border rounded p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lead Source</label>
                        <input
                            type="text"
                            value={filters.source}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, source: e.target.value }))
                            }
                            placeholder="e.g., Uttalika"
                            className="border rounded p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Source</label>
                        <input
                            type="text"
                            value={filters.projectSource}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, projectSource: e.target.value }))
                            }
                            placeholder="e.g., In House"
                            className="border rounded p-2 text-sm"
                        />
                    </div>

                    <button
                        onClick={() => setPage(1)} // triggers re-fetch with filters
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Apply
                    </button>

                    <button
                        onClick={() => {
                            setFilters({ startDate: '', endDate: '', source: '', projectSource: '' });
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    >
                        Clear
                    </button>
                </div>

                {total ?
                    <div className='flex gap-4'>
                        <button
                            onClick={toggleSelectAll}
                            className="relative px-6 py-3 text-md w-60 cursor-pointer font-bold uppercase 
                            tracking-widest bg-slate-800 text-orange-300 rounded-md overflow-hidden  
                            flex items-center justify-center space-x-2"
                        >
                            <span>
                                {selectedIds.length < data.length ? "Select All" : "Unselect All"}
                            </span>
                            <SquareMousePointer />
                            {/* Top border */}
                            <span className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-transparent to-orange-400 animate-border-top"></span>

                            {/* Right border */}
                            <span className="absolute right-[-6px] top-0 h-full w-[6px] bg-gradient-to-b from-transparent to-orange-400 animate-border-right"></span>

                            {/* Bottom border */}
                            <span className="absolute right-0 bottom-0 h-[6px] w-full bg-gradient-to-l from-transparent to-orange-400 animate-border-bottom"></span>

                            {/* Left border */}
                            <span className="absolute left-0 bottom-0 h-full w-[6px] bg-gradient-to-t from-transparent to-orange-400 animate-border-left"></span>
                        </button>
                        {selectedIds.length > 0 ?
                            <button
                                onClick={() => {

                                    setBulkModal(true);
                                }}
                                className="relative px-6 py-3 text-md w-60 cursor-pointer font-bold uppercase tracking-widest bg-slate-800 text-green-300 rounded-md overflow-hidden flex items-center justify-center space-x-2"
                            >
                                <span>Bulk Assign</span>
                                <Navigation />

                                {/* Top border */}
                                <span className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-transparent to-green-400 animate-border-top"></span>

                                {/* Right border */}
                                <span className="absolute right-[-6px] top-0 h-full w-[6px] bg-gradient-to-b from-transparent to-green-400 animate-border-right"></span>

                                {/* Bottom border */}
                                <span className="absolute right-0 bottom-0 h-[6px] w-full bg-gradient-to-l from-transparent to-green-400 animate-border-bottom"></span>

                                {/* Left border */}
                                <span className="absolute left-0 bottom-0 h-full w-[6px] bg-gradient-to-t from-transparent to-green-400 animate-border-left"></span>
                            </button>
                            : <></>}
                    </div>
                    :
                    <></>
                }

                {bulkModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Bulk Assign Leads</h2>

                            {/* Telecaller select */}
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Select Telecaller
                            </label>
                            <select
                                value={selectTelecaller}
                                onChange={(e) => setSelectTelecaller(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                            >
                                <option value="">-- Choose Telecaller --</option>
                                {telecallerList.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            {/* Remarks */}
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Remarks (optional)
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                                rows={3}
                                placeholder="Enter remarks"
                            />

                            {/* Actions */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setBulkModal(false)}
                                    className="px-4 cursor-pointer py-2 rounded-md bg-gray-200 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkAssign}
                                    className="px-4 py-2 cursor-pointer rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
                                        className="flex-1 mb-2 md:mb-0 md:mr-4 text-left text-sm"
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
