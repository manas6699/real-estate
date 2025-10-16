'use client';

import React, { useEffect, useMemo, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Search, Clock } from "lucide-react";

import { GET_REASSIGNS } from "@/config/api"
import { whoami } from "@/utils/whoami";

// Props
type LeadHistoryRow = {
    _id: string;
    lead_id: string;
    assignee_name: string;
    assign_mode: string;
    status: string;
    remarks?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history: Array<string | Record<string, any>>;
    lead_details: {
        name?: string;
        email?: string;
        phone?: string;
    };
    createdAt?: string;
    updatedAt?: string;
};

export default function HistoryTable() {

    const username = whoami()
    const [data, setData] = useState<LeadHistoryRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Table state
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${GET_REASSIGNS }?username=${encodeURIComponent(username ?? "")}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (mounted) {
                    setData(json.data || []);
                    setError(null);
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (mounted) setError(err.message || "Failed to fetch");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [ username]);

    // columns
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<LeadHistoryRow, any>[]>(
        () => [
            {
                id: "expander",
                header: () => null,
                cell: ({ row }) => {
                    const isOpen = row.getIsExpanded?.();
                    return (
                        <span className="flex items-center justify-center">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                    );
                },
            },
            {
                accessorKey: "lead_details.name",
                header: "Lead Name",
                cell: (info) => info.getValue() || "—",
                enableSorting: true,
                enableColumnFilter: true,
            },
            {
                accessorFn: (row) => row.lead_details?.email ?? "",
                id: "email",
                header: "Email",
                cell: (info) => info.getValue() || "—",
            },
            {
                accessorFn: (row) => row.lead_details?.phone ?? "",
                id: "phone",
                header: "Phone",
            },
            {
                accessorKey: "assignee_name",
                header: "Assignee",
            },
            {
                accessorKey: "status",
                header: "Status",
            },
            {
                accessorKey: "assign_mode",
                header: "Assign Mode",
            },
            {
                accessorKey: "remarks",
                header: "Remarks",
            },
            {
                accessorKey: "createdAt",
                header: "Created",
                cell: (info) => (info.getValue() ? new Date(info.getValue() as string).toLocaleString() : "—"),
            },
            {
                accessorKey: "updatedAt",
                header: "Updated",
                cell: (info) => (info.getValue() ? new Date(info.getValue() as string).toLocaleString() : "—"),
            },
            {
                id: "history",
                header: "History",
                cell: ({ row }) => {
                    // We'll render a small preview inside the table cell and a full timeline in the expanded area
                    const h = row.original.history || [];
                    // preview: last 1-2 entries
                    const preview = h.slice(-2).map((entry, idx) => {
                        if (typeof entry === "string") return (<div key={idx} className="text-sm truncate">{entry}</div>);
                        const label = entry.status || entry.assignee_name || JSON.stringify(entry);
                        return (<div key={idx} className="text-sm truncate">{label}</div>);
                    });
                    return <div className="space-y-1">{preview}</div>;
                },
            },
        ],
        []
    );

    // table instance
    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination: { pageIndex, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                const next = updater({ pageIndex, pageSize });
                setPageIndex(next.pageIndex);
                setPageSize(next.pageSize);
            } else {
                setPageIndex(updater.pageIndex ?? pageIndex);
                setPageSize(updater.pageSize ?? pageSize);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: false,
    });

    // custom row expansion state using local state map to keep it simple
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const toggleExpand = (id: string) => {
        setExpandedMap((s) => ({ ...s, [id]: !s[id] }));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search leads, email, phone..."
                            className="pl-8 pr-3 py-2 border rounded-md text-sm"
                        />
                    </div>
                    <div className="text-sm text-gray-500">Total: {data.length}</div>
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Rows:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        className="border rounded-md text-sm p-1"
                    >
                        {[5, 10, 20, 50, 100].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto border rounded-md">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="text-left p-3 text-sm">
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className="flex items-center space-x-2"
                                                onClick={header.column.getToggleSortingHandler?.()}
                                            >
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                                <span>
                                                    {header.column.getCanSort() ? (
                                                        header.column.getIsSorted() === "asc" ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <span className="w-4 h-4 inline-block" />
                                                        )
                                                    ) : null}
                                                </span>
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-sm text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-sm text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-sm text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                const original = row.original;
                                const isExpanded = !!expandedMap[original._id];
                                return (
                                    <React.Fragment key={row.id}>
                                        <tr
                                            className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
                                            onClick={() => toggleExpand(original._id)}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="p-3 align-top text-sm">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>

                                        {/* expanded accordion area */}
                                        {isExpanded && (
                                            <tr className="bg-white">
                                                <td colSpan={row.getVisibleCells().length} className="p-4 border-t">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {/* left: lead summary */}
                                                        <div className="space-y-2">
                                                            <div className="text-sm text-gray-600">Lead</div>
                                                            <div className="font-semibold text-lg">{original.lead_details?.name || '—'}</div>
                                                            <div className="text-sm">{original.lead_details?.email}</div>
                                                            <div className="text-sm">{original.lead_details?.phone}</div>

                                                            <div className="mt-3 text-xs text-gray-500">Assignee</div>
                                                            <div className="text-sm">{original.assignee_name}</div>

                                                            <div className="mt-3 text-xs text-gray-500">Remarks</div>
                                                            <div className="text-sm">{original.remarks || '—'}</div>
                                                        </div>

                                                        {/* middle: timeline */}
                                                        <div className="md:col-span-2">
                                                            <div className="flex items-center mb-3 space-x-2">
                                                                <Clock className="w-4 h-4" />
                                                                <div className="text-sm font-semibold">History Timeline</div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {original.history && original.history.length > 0 ? (
                                                                    original.history.map((entry, idx) => {
                                                                        const isObject = typeof entry === 'object' && entry !== null;
                                                                        return (
                                                                            <div key={idx} className="flex items-start space-x-3">
                                                                                <div className="pt-1">
                                                                                    <span className="w-2 h-2 block rounded-full bg-pink-500" />
                                                                                </div>

                                                                                <div className="flex-1">
                                                                                    {isObject ? (
                                                                                        <div className="bg-gray-50 p-3 rounded-md border">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="text-sm font-medium">{entry.status || entry.assignee_name || 'Update'}</div>
                                                                                                <div className="text-xs text-gray-400">{entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : ''}</div>
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600 mt-1">Assignee: {entry.assignee_name || '—'}</div>
                                                                                            {entry.remarks ? <div className="text-xs text-gray-500 mt-1">Remarks: {entry.remarks}</div> : null}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="text-sm">{entry}</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div className="text-sm text-gray-500">No history available</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length}</div>

                <div className="flex items-center space-x-2">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </button>

                    <div className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                    </div>

                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </div>
    );
}
