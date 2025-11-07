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
    ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Search, Clock, Filter, X, Calendar, Edit3 } from "lucide-react";

import { GET_REASSIGNS } from "@/config/api"
import { useRouter } from 'next/navigation';
import { whoami } from "@/utils/whoami";

// Props
type LeadHistoryRow = {
    _id: string;
    lead_id: string;
    assignee_name: string;
    assign_mode: string;
    status: string;
    remarks?: string;
    dumb_id :string;
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
    const router = useRouter()
    const username = whoami()
    const [data, setData] = useState<LeadHistoryRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Table state
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${GET_REASSIGNS}?username=${encodeURIComponent(username ?? "")}`);
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
    }, [username]);

    // Get unique values for dropdown filters
    const filterOptions = useMemo(() => {
        const assignees = Array.from(new Set(data.map(item => item.assignee_name).filter(Boolean)));
        const statuses = Array.from(new Set(data.map(item => item.status).filter(Boolean)));
        const assignModes = Array.from(new Set(data.map(item => item.assign_mode).filter(Boolean)));
        const remarks = Array.from(new Set(data.map(item => item.remarks).filter(Boolean)));

        return {
            assignees: assignees.sort(),
            statuses: statuses.sort(),
            assignModes: assignModes.sort(),
            remarks: remarks.sort()
        };
    }, [data]);

    // Filter data based on date range
    const filteredData = useMemo(() => {
        if (!dateRange.from && !dateRange.to) return data;

        return data.filter(item => {
            if (!item.createdAt) return false;

            const itemDate = new Date(item.createdAt);
            const fromDate = dateRange.from ? new Date(dateRange.from) : null;
            const toDate = dateRange.to ? new Date(dateRange.to + 'T23:59:59.999Z') : null; // End of day

            if (fromDate && itemDate < fromDate) return false;
            if (toDate && itemDate > toDate) return false;

            return true;
        });
    }, [data, dateRange]);
    // Helper function to get cell value based on column ID
    const getCellValue = (item: LeadHistoryRow, columnId: string) => {
        switch (columnId) {
            case "id":
                return item?.dumb_id;
            case "name":
                return item.lead_details?.name;
            case "email":
                return item.lead_details?.email;
            case "phone":
                return item.lead_details?.phone;
            case "assignee_name":
                return item.assignee_name;
            case "status":
                return item.status;
            case "assign_mode":
                return item.assign_mode;
            case "dispositions":
                return item.remarks;
            default:
                return item[columnId as keyof LeadHistoryRow];
        }
    };
    // Combine all filters (date range + column filters + global filter)
    const finalFilteredData = useMemo(() => {
        let result = filteredData;

        // Apply column filters
        columnFilters.forEach(filter => {
            result = result.filter(item => {
                const value = getCellValue(item, filter.id);
                return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            });
        });

        // Apply global filter
        if (globalFilter) {
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(globalFilter.toLowerCase())
                ) ||
                (item.lead_details?.name?.toLowerCase().includes(globalFilter.toLowerCase())) ||
                (item.lead_details?.email?.toLowerCase().includes(globalFilter.toLowerCase())) ||
                (item.lead_details?.phone?.toLowerCase().includes(globalFilter.toLowerCase())) ||
                (item.assignee_name?.toLowerCase().includes(globalFilter.toLowerCase())) ||
                (item.status?.toLowerCase().includes(globalFilter.toLowerCase())) ||
                (item.remarks?.toLowerCase().includes(globalFilter.toLowerCase())) ||
                (item.assign_mode?.toLowerCase().includes(globalFilter.toLowerCase()))
            );
        }

        return result;
    }, [filteredData, columnFilters, globalFilter]);



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
                accessorKey: "dumb_id",
                id: "id",
                header: "ID",
                cell: (info) => info.getValue() || "—",
                enableSorting: true,
                enableColumnFilter: true,
            },
            {
                accessorKey: "lead_details.name",
                id: "name",
                header: "Name",
                cell: (info) => info.getValue() || "—",
                enableSorting: true,
                enableColumnFilter: true,
            },
            {
                accessorFn: (row) => row.lead_details?.email ?? "",
                id: "email",
                header: "Email",
                cell: (info) => info.getValue() || "—",
                enableColumnFilter: true,
            },
            {
                accessorFn: (row) => row.lead_details?.phone ?? "",
                id: "phone",
                header: "Phone",
                enableColumnFilter: true,
            },
            {
                accessorKey: "assignee_name",
                header: "Assignee",
                enableColumnFilter: true,
            },
            {
                accessorKey: "status",
                header: "Status",
                enableColumnFilter: true,
            },
            {
                accessorKey: "assign_mode",
                header: "Assign Mode",
                enableColumnFilter: true,
            },
            {
                accessorKey: "remarks",
                header: "Disposition",
                enableColumnFilter: true
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
                id: "Action",
                header: "Action",
                cell: ({ row }) => {
                    const leadId = row.original.lead_id; // This gets the lead_id from your data

                    return (
                        <button
                            onClick={() => router.push(`/telecaller/change/${leadId}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Edit3 className="w-4 h-4" />
                            Fill Details
                        </button>
                    );
                },
            },
        ],
        [router]
    );

    // Filter functions
    const getColumnFilterValue = (columnId: string) => {
        const filter = columnFilters.find(f => f.id === columnId);
        return filter?.value as string || "";
    };

    const setColumnFilter = (columnId: string, value: string) => {
        setColumnFilters(prev => {
            const otherFilters = prev.filter(f => f.id !== columnId);
            if (value) {
                return [...otherFilters, { id: columnId, value }];
            }
            return otherFilters;
        });
    };

    const clearAllFilters = () => {
        setColumnFilters([]);
        setGlobalFilter("");
        setDateRange({ from: "", to: "" });
    };

    const hasActiveFilters = columnFilters.length > 0 || globalFilter || dateRange.from || dateRange.to;

    // Quick date range presets
    const applyDatePreset = (days: number) => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - days);

        setDateRange({
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0]
        });
    };

    // table instance - Use finalFilteredData which includes date range filtering
    const table = useReactTable({
        data: finalFilteredData,
        columns,
        state: {
            globalFilter,
            columnFilters,
            pagination: { pageIndex, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
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
        <div className="p-6 bg-white rounded-lg shadow-lg">
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Lead History</h1>
                        <p className="text-gray-600 mt-1">Track and manage lead assignment history</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters || hasActiveFilters
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {columnFilters.length + (globalFilter ? 1 : 0) + (dateRange.from || dateRange.to ? 1 : 0)}
                                </span>
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Global Search */}
                <div className="relative max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search leads, email, phone, assignee..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Name Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={getColumnFilterValue("name")}
                                onChange={(e) => setColumnFilter("name", e.target.value)}
                                placeholder="Filter by name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Email Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                value={getColumnFilterValue("email")}
                                onChange={(e) => setColumnFilter("email", e.target.value)}
                                placeholder="Filter by email..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Phone Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={getColumnFilterValue("phone")}
                                onChange={(e) => setColumnFilter("phone", e.target.value)}
                                placeholder="Filter by phone..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Assignee Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assignee
                            </label>
                            <select
                                value={getColumnFilterValue("assignee_name")}
                                onChange={(e) => setColumnFilter("assignee_name", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Assignees</option>
                                {filterOptions.assignees.map(assignee => (
                                    <option key={assignee} value={assignee}>
                                        {assignee}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={getColumnFilterValue("status")}
                                onChange={(e) => setColumnFilter("status", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                {filterOptions.statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assign Mode Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign Mode
                            </label>
                            <select
                                value={getColumnFilterValue("assign_mode")}
                                onChange={(e) => setColumnFilter("assign_mode", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Modes</option>
                                {filterOptions.assignModes.map(mode => (
                                    <option key={mode} value={mode}>
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dispo&n bsp;$itions
                            </label>
                            <select
                                value={getColumnFilterValue("remarks")}
                                onChange={(e) => setColumnFilter("remarks", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All</option>
                                {filterOptions.remarks.map(mode => (
                                    <option key={mode} value={mode}>
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="md:col-span-2 lg:col-span-4">
                            <div className="border-t pt-4 mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Created Date Range
                                </label>

                                {/* Quick Date Presets */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button
                                        onClick={() => applyDatePreset(7)}
                                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Last 7 days
                                    </button>
                                    <button
                                        onClick={() => applyDatePreset(30)}
                                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Last 30 days
                                    </button>
                                    <button
                                        onClick={() => applyDatePreset(90)}
                                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Last 90 days
                                    </button>
                                    <button
                                        onClick={() => setDateRange({ from: "", to: "" })}
                                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Clear Date
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">From Date</label>
                                        <input
                                            type="date"
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">To Date</label>
                                        <input
                                            type="date"
                                            value={dateRange.to}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Total: <span className="font-semibold">{data.length}</span> records
                    </div>

                    {hasActiveFilters && (
                        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            Filtered: <span className="font-semibold">{finalFilteredData.length}</span> records
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Rows per page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {[5, 10, 20, 50, 100].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="text-left p-4 text-sm font-semibold text-gray-700">
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center space-x-2 ${header.column.getCanSort() ? 'cursor-pointer hover:text-gray-900 transition-colors' : ''
                                                    }`}
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
                                                            <span className="w-4 h-4 inline-block opacity-30">↕</span>
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
                                <td colSpan={columns.length} className="p-8 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        <div>Loading lead history...</div>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-red-600 bg-red-50">
                                    <div className="flex flex-col items-center gap-2">
                                        <X className="w-8 h-8" />
                                        <div className="font-medium">Error loading data</div>
                                        <div className="text-sm">{error}</div>
                                    </div>
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-gray-500 bg-gray-50">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="w-8 h-8" />
                                        <div className="font-medium">No records found</div>
                                        <div className="text-sm">
                                            {hasActiveFilters
                                                ? "Try adjusting your filters to see more results"
                                                : "No lead history data available"
                                            }
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                const original = row.original;
                                const isExpanded = !!expandedMap[original._id];
                                return (
                                    <React.Fragment key={row.id}>
                                        <tr
                                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                                                }`}
                                            onClick={() => toggleExpand(original._id)}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="p-4 align-top text-sm border-t border-gray-100">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}

                                            
                                        </tr>

                                        {/* expanded accordion area */}
                                        {isExpanded && (
                                            <tr className="bg-white">
                                                <td colSpan={row.getVisibleCells().length} className="p-6 border-t border-gray-200">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        {/* left: lead summary */}
                                                        <div className="space-y-4">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-600 mb-2">Lead Information</div>
                                                                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Name</div>
                                                                        <div className="font-semibold text-gray-900">{original.lead_details?.name || '—'}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Email</div>
                                                                        <div className="text-sm text-gray-900">{original.lead_details?.email || '—'}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Phone</div>
                                                                        <div className="text-sm text-gray-900">{original.lead_details?.phone || '—'}</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="text-sm font-medium text-gray-600 mb-2">Assignment Details</div>
                                                                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Assignee</div>
                                                                        <div className="text-sm font-medium text-gray-900">{original.assignee_name}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Status</div>
                                                                        <div className="text-sm text-gray-900">{original.status}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Assign Mode</div>
                                                                        <div className="text-sm text-gray-900">{original.assign_mode}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Remarks</div>
                                                                        <div className="text-sm text-gray-900">{original.remarks || '—'}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* timeline */}
                                                        <div className="lg:col-span-2">
                                                            <div className="flex items-center mb-4 space-x-2">
                                                                <Clock className="w-5 h-5 text-gray-600" />
                                                                <div className="text-lg font-semibold text-gray-900">History Timeline</div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {original.history && original.history.length > 0 ? (
                                                                    original.history.map((entry, idx) => {
                                                                        const isObject = typeof entry === 'object' && entry !== null;
                                                                        return (
                                                                            <div key={idx} className="flex items-start space-x-4">
                                                                                <div className="flex flex-col items-center">
                                                                                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                                                                                    {idx < original.history.length - 1 && (
                                                                                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                                                                                    )}
                                                                                </div>

                                                                                <div className="flex-1 pb-4">
                                                                                    {isObject ? (
                                                                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-white transition-colors">
                                                                                            <div className="flex items-center justify-between mb-2">
                                                                                                <div className="font-medium text-gray-900">{entry.status || entry.assignee_name || 'Update'}</div>
                                                                                                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                                                                                    {entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : ''}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="text-sm text-gray-600 mb-1">Assignee: {entry.assignee_name || '—'}</div>
                                                                                            {entry.remarks ? (
                                                                                                <div className="text-sm text-gray-500 mt-2">
                                                                                                    Remarks: {entry.remarks}
                                                                                                </div>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3">
                                                                                            {entry}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                                                        No history available for this lead
                                                                    </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {' '}
                    {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, finalFilteredData.length)} of {' '}
                    <span className="font-semibold">{finalFilteredData.length}</span> records
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>

                    <div className="text-sm text-gray-700 mx-4">
                        Page <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> of {' '}
                        <span className="font-semibold">{table.getPageCount() || 1}</span>
                    </div>

                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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