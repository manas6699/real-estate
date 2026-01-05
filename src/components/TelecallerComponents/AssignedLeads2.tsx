'use client'
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { useState, useMemo } from "react";
import axios from "axios";
import { GET_LEAD_HISTORY } from '@/config/api';
import {
    Check, Copy, Edit3, History, Search, Clock, Tag,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { WhatsMyRole } from '@/utils/WhatsMyRole';

// --- Types ---
type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    dumb_id: string,
    history: string[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        upload_type: string;
        lead_status: string;
        subdisposition?: string;
        sub_disposition?: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string
};

interface Props {
    data: Assign[];
}

export default function AssignedLeads2({ data }: Props) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isBulk, setIsBulk] = useState(false); // false = In House (Single + Webhook), true = Data Sheet (Bulk)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Helper for Status Colors
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'assigned': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'processed': return 'bg-green-100 text-green-700 border-green-200';
            case 'reassigned': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'auto-assigned': return 'bg-purple-100 text-pink-700 border-pink-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Filtered and Time-Sorted Data
    const filteredData = useMemo(() => {
        const filtered = data.filter(item => {
            const type = (item.lead_details.upload_type || '').toLowerCase();
            if (isBulk) {
                // Data Sheet View: Only show bulk
                return type === 'bulk';
            } else {
                // In House View: Show single, webhook, or empty
                return type === 'single' || type === 'webhook' || type === '';
            }
        });

        // Sort by Time (Newest First)
        return filtered.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [data, isBulk]);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const fetchLeadHistory = async (leadId: string) => {
        try {
            const res = await axios.get(GET_LEAD_HISTORY(leadId));
            const payload = res?.data?.data ?? res?.data ?? [];
            setHistory(Array.isArray(payload) ? payload : [payload]);
            setShowHistory(true);
        } catch (err) {
            console.error('Failed history fetch', err);
            setHistory([]);
            setShowHistory(true);
        }
    };

    const FilldetailsHandler = (b: string) => {
        const role = WhatsMyRole();
        if (role === 'inventory') {
            window.open('/telecaller/inventory', '_blank');
        } else {
            window.open(`/telecaller/change/${b}`, '_blank');
        }
    };

    const uniqueDispositions = useMemo(() =>
        Array.from(new Set(data.map(item => item.lead_details.lead_status).filter(Boolean))),
        [data]);

    const uniqueSubDispositions = useMemo(() =>
        Array.from(new Set(data.map(item => item.lead_details.subdisposition || item.lead_details.sub_disposition).filter(Boolean))),
        [data]);

    const uniqueStatuses = useMemo(() =>
        Array.from(new Set(data.map(item => item.status).filter(Boolean))),
        [data]);

    const columns = useMemo<ColumnDef<Assign>[]>(() => [
        {
            header: 'ID',
            accessorKey: 'dumb_id',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 font-mono text-[11px]">
                    {row.original.dumb_id}
                    <button onClick={() => handleCopyId(row.original.dumb_id)} className="hover:text-blue-500 cursor-pointer">
                        {copiedId === row.original.dumb_id ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                    </button>
                </div>
            )
        },
        {
            header: 'Date & Time',
            accessorKey: 'updatedAt',
            enableColumnFilter: false,
            cell: ({ row }) => {
                const date = new Date(row.original.updatedAt);
                return (
                    <div className="text-xs leading-tight min-w-[100px]">
                        <div className="font-bold text-gray-700">
                            {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Phone',
            accessorKey: 'lead_details.phone',
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.lead_details.phone}</span>
        },
        {
            header: 'Customer Info',
            accessorKey: 'lead_details.name',
            cell: ({ row }) => (
                <div className="text-xs">
                    <div className="font-bold text-gray-900">{row.original.lead_details.name}</div>
                    <div className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${row.original.lead_details.upload_type === 'webhook' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {row.original.lead_details.upload_type || "Single"}
                    </div>
                </div>
            )
        },
        {
            header: 'Disposition',
            accessorKey: 'lead_details.lead_status',
            filterFn: 'equals',
            cell: ({ row }) => (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold border border-blue-100 uppercase text-[10px]">
                    {row.original.lead_details.lead_status || 'New'}
                </span>
            )
        },
        {
            header: 'Sub Disposition',
            id: 'subdisposition',
            accessorFn: (row) => row.lead_details.subdisposition || row.lead_details.sub_disposition,
            cell: ({ row }) => (
                <div className="text-gray-500 flex items-start gap-1 max-w-[150px]">
                    <Tag size={10} className="mt-0.5 shrink-0" />
                    <span className="text-[10px] italic leading-tight">
                        {row.original.lead_details.subdisposition || row.original.lead_details.sub_disposition || "N/A"}
                    </span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            filterFn: 'equals',
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusStyles(row.original.status)}`}>
                    {row.original.status}
                </span>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            enableColumnFilter: false,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => FilldetailsHandler(row.original.lead_id)}
                        className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors cursor-pointer"
                        title="Fill Details"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={() => fetchLeadHistory(row.original._id)}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 cursor-pointer"
                    >
                        <History size={14} />
                    </button>
                </div>
            )
        }
    ], [copiedId]);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { globalFilter, columnFilters },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-700">Lead Registry</h2>
                    <div className="bg-black text-white text-xs px-2.5 py-1 rounded-full">{table.getFilteredRowModel().rows.length}</div>

                    {/* --- Back to Two-Way Toggle --- */}
                    <div className="relative flex p-1 bg-gray-200/80 backdrop-blur-md rounded-xl border border-gray-300 shadow-inner w-fit">
                        <button
                            onClick={() => setIsBulk(false)}
                            className={`relative z-10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-lg cursor-pointer flex items-center gap-2 ${!isBulk ? 'text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {!isBulk && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />}
                            In House
                        </button>

                        <button
                            onClick={() => setIsBulk(true)}
                            className={`relative z-10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-lg cursor-pointer flex items-center gap-2 ${isBulk ? 'text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {isBulk && <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />}
                            Data Sheet
                        </button>

                        <div
                            className={`absolute top-1 bottom-1 transition-all duration-300 ease-out bg-white rounded-lg shadow-sm border border-gray-100 ${isBulk ? 'left-[calc(50%+2px)] w-[48%]' : 'left-1 w-[48%]'}`}
                            style={{ zIndex: 0 }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search leads..."
                        className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white border-b-2 border-gray-100">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-3 align-top">
                                        <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            header.column.id === 'lead_details_lead_status' ? (
                                                <select
                                                    value={(header.column.getFilterValue() as string) ?? ''}
                                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                                    className="w-full text-[10px] p-1 border rounded bg-gray-50 cursor-pointer"
                                                >
                                                    <option value="">All Dispositions</option>
                                                    {uniqueDispositions.map(val => <option key={val} value={val}>{val}</option>)}
                                                </select>
                                            ) : header.column.id === 'subdisposition' ? (
                                                <select
                                                    value={(header.column.getFilterValue() as string) ?? ''}
                                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                                    className="w-full text-[10px] p-1 border rounded bg-gray-50 cursor-pointer"
                                                >
                                                    <option value="">All Subs</option>
                                                    {uniqueSubDispositions.map(val => <option key={val} value={val}>{val}</option>)}
                                                </select>
                                            ) : header.column.id === 'status' ? (
                                                <select
                                                    value={(header.column.getFilterValue() as string) ?? ''}
                                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                                    className="w-full text-[10px] p-1 border rounded bg-gray-50 cursor-pointer font-bold"
                                                >
                                                    <option value="">All Statuses</option>
                                                    {uniqueStatuses.map(val => <option key={val} value={val}>{val.toUpperCase()}</option>)}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={(header.column.getFilterValue() as string) ?? ''}
                                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                                    placeholder="Filter..."
                                                    className="w-full font-normal text-[10px] px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400"
                                                />
                                            )
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Show</span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="border rounded p-1"
                    >
                        {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"><ChevronsLeft size={16} /></button>
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"><ChevronLeft size={16} /></button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"><ChevronRight size={16} /></button>
                    <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"><ChevronsRight size={16} /></button>
                </div>
            </div>

            {/* History Modal remains the same */}
            {showHistory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <History className="text-blue-500" /> Update History
                        </h2>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {history.slice().reverse().map((item, idx) => (
                                <div key={idx} className="pl-4 border-l-2 border-blue-200 py-1 text-sm relative">
                                    <div className="absolute -left-[5px] top-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <p className="text-[10px] text-gray-400 font-bold">{typeof item === 'string' ? 'System' : new Date(item.updatedAt).toLocaleString('en-GB')}</p>
                                    <p className="text-gray-700">{typeof item === 'string' ? item : `${item.assignee_name} marked as ${item.status}`}</p>
                                    {typeof item !== 'string' && item.remarks && <p className="text-xs text-gray-500 italic mt-1 bg-gray-50 p-2 rounded">&quot;{item.remarks}&quot;</p>}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowHistory(false)} className="w-full mt-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}