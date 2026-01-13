'use client';

import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { Navigation, SquareMousePointer, AlertCircle } from 'lucide-react';
import AssignModal from '@/components/AdminComponents/AssignModal';
import UnassignLeadsBlank from '@/components/Blank/UnassignLeadsBlank';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { GET_ALL_UNASSIGNED_LEADS, GET_ALL_TELECALLERS_API, BULK_ASSIGN_API } from '@/config/api';

type Lead = {
    _id: string;
    name: string;
    phone: string;
    source: string;
    status: string;
    createdAt: string;
    upload_by?: string;
    upload_type?: string;
    projectSource?: string;
};

type assignbtntype = {
    assignbtn?: string;
};

export default function LeadTable({ assignbtn }: assignbtntype) {
    const [data, setData] = useState<Lead[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bulkModal, setBulkModal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telecallerList, setTelecallerList] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectTelecaller, setSelectTelecaller] = useState<any>("");
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [remarks, setRemarks] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const allSelected = data.length > 0 && selectedIds.length === data.length;

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // Filter states
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        source: '',
        projectSource: '',
    });

    // 1. DUPLICATE LOGIC: Identify leads with same Name + Phone
    const duplicateIds = useMemo(() => {
        return data.reduce((acc: string[], lead, index, self) => {
            const isDuplicate = self.some((otherLead, otherIndex) =>
                otherIndex !== index &&
                otherLead.name?.toLowerCase().trim() === lead.name?.toLowerCase().trim() &&
                otherLead.phone === lead.phone
            );
            if (isDuplicate) acc.push(lead._id);
            return acc;
        }, []);
    }, [data]);

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

                if (assignbtn === 'assigned') {
                    leads = leads.filter((lead: Lead) => lead.status === 'assigned');
                } else {
                    leads = leads.filter((lead: Lead) => lead.status === 'not-assigned');
                }

                setData(leads);
                setTotal(res.data.total || 0);
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
            });
        }
    }, [bulkModal]);

    const handleBulkAssign = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one lead to assign.");
            return;
        }
        if (!selectTelecaller) {
            alert("Please select a telecaller first!");
            return;
        }

        const telecaller = telecallerList.find((t) => t.name === selectTelecaller);

        if (!telecaller) {
            alert("Selected telecaller not found.");
            return;
        }

        const historyMessage = `This Lead has been assigned to ${telecaller.name} at ${new Date().toISOString()} with remarks: "${remarks}"`;

        const payload = {
            lead_ids: selectedIds,
            assignee_id: telecaller.id,
            assignee_name: telecaller.name || "Unknown",
            history: [historyMessage],
            remarks,
        };

        try {
            const res = await axios.post(BULK_ASSIGN_API, payload);
            alert(res.data?.message || "Leads assigned successfully!");
            setBulkModal(false);
            setSelectedIds([]);
            setPage(1);
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
        { accessorKey: 'source', header: 'Project Name' },
        { accessorKey: 'projectSource', header: 'Project Source' },
        { accessorKey: 'name', header: 'Customer Name' },
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
        { accessorKey: 'phone', header: 'Phone' },
        { accessorKey: 'upload_by', header: 'Upload By' },
        { accessorKey: 'upload_type', header: 'Type' },
        {
            id: 'assign',
            header: '',
            cell: ({ row }) => (
                <button
                    onClick={() => {
                        setSelectedLeadId(row.original._id);
                        setIsModalOpen(true);
                    }}
                    className={`px-4 py-2 rounded cursor-pointer ${assignbtn === 'assigned' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
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

            <div className="bg-red-50 border-l-4 border-red-400 p-2 sm:w-1/5 mb-4">
                <h2 className="text-sm font-extrabold">Total Leads : {total}</h2>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                <div className="flex flex-wrap gap-3 mb-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" value={filters.startDate} onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))} className="border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" value={filters.endDate} onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))} className="border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lead Source</label>
                        <input type="text" value={filters.source} onChange={(e) => setFilters((prev) => ({ ...prev, source: e.target.value }))} placeholder="e.g., Uttalika" className="border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Source</label>
                        <input type="text" value={filters.projectSource} onChange={(e) => setFilters((prev) => ({ ...prev, projectSource: e.target.value }))} placeholder="e.g., In House" className="border rounded p-2 text-sm" />
                    </div>
                    <button onClick={() => setPage(1)} className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Apply</button>
                    <button onClick={() => { setFilters({ startDate: '', endDate: '', source: '', projectSource: '' }); setPage(1); }} className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer">Clear</button>
                </div>

                {total > 0 && (
                    <div className='flex gap-4'>
                        <button onClick={toggleSelectAll} className="relative px-6 py-3 text-md w-60 cursor-pointer font-bold uppercase tracking-widest bg-slate-800 text-orange-300 rounded-md overflow-hidden flex items-center justify-center space-x-2">
                            <span>{selectedIds.length < data.length ? "Select All" : "Unselect All"}</span>
                            <SquareMousePointer />
                            <span className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-transparent to-orange-400 animate-border-top"></span>
                            <span className="absolute right-[-6px] top-0 h-full w-[6px] bg-gradient-to-b from-transparent to-orange-400 animate-border-right"></span>
                            <span className="absolute right-0 bottom-0 h-[6px] w-full bg-gradient-to-l from-transparent to-orange-400 animate-border-bottom"></span>
                            <span className="absolute left-0 bottom-0 h-full w-[6px] bg-gradient-to-t from-transparent to-orange-400 animate-border-left"></span>
                        </button>

                        {selectedIds.length > 0 && (
                            <button onClick={() => setBulkModal(true)} className="relative px-6 py-3 text-md w-60 cursor-pointer font-bold uppercase tracking-widest bg-slate-800 text-green-300 rounded-md overflow-hidden flex items-center justify-center space-x-2">
                                <span>Bulk Assign</span>
                                <Navigation />
                                <span className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-transparent to-green-400 animate-border-top"></span>
                                <span className="absolute right-[-6px] top-0 h-full w-[6px] bg-gradient-to-b from-transparent to-green-400 animate-border-right"></span>
                                <span className="absolute right-0 bottom-0 h-[6px] w-full bg-gradient-to-l from-transparent to-green-400 animate-border-bottom"></span>
                                <span className="absolute left-0 bottom-0 h-full w-[6px] bg-gradient-to-t from-transparent to-green-400 animate-border-left"></span>
                            </button>
                        )}
                    </div>
                )}

                {bulkModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
                        <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Bulk Assign Leads</h2>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Select Telecaller</label>
                            <select value={selectTelecaller} onChange={(e) => setSelectTelecaller(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-4">
                                <option value="">-- Choose Telecaller --</option>
                                {telecallerList.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Remarks (optional)</label>
                            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-4" rows={3} placeholder="Enter remarks" />
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => setBulkModal(false)} className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 cursor-pointer">Cancel</button>
                                <button onClick={handleBulkAssign} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 cursor-pointer">Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {data.length === 0 ? (
                    <UnassignLeadsBlank />
                ) : (
                    table.getRowModel().rows.map((row) => {
                        const isDuplicate = duplicateIds.includes(row.original._id);
                        return (
                            <div
                                key={row.id}
                                className={`relative flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow p-4 border-l-4 transition-all ${isDuplicate ? 'border-red-500 bg-red-50' : 'border-transparent'
                                    }`}
                            >
                                {isDuplicate && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-tighter bg-red-100 px-2 py-0.5 rounded-full border border-red-200 z-10 shadow-sm">
                                        <AlertCircle size={10} className="animate-pulse" />
                                        Duplicate Lead
                                    </div>
                                )}

                                {row.getVisibleCells().map((cell) => (
                                    <div key={cell.id} className="flex-1 mb-2 md:mb-0 md:mr-4 text-left text-sm">
                                        <div className="text-xs flex justify-center text-gray-400">
                                            {cell.column.columnDef.header as string}
                                        </div>
                                        <div className="font-medium items-center flex justify-center mt-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                )}

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer">Prev</button>
                        <span className="text-sm">Page {page} of {totalPages || 1}</span>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer">Next</button>
                    </div>
                    <div>
                        <label className="mr-2 text-sm">Rows per page:</label>
                        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded p-1 text-sm">
                            {[10, 15, 20, 25].map((size) => <option key={size} value={size}>{size}</option>)}
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