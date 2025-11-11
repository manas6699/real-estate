'use client';

import React, { useMemo, useState } from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    flexRender,
    getPaginationRowModel,
    PaginationState,
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
    dumb_id: string;
    history: (HistoryEntry | string)[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        projectSource: string;
        status: string;
        lead_status: string;
        upload_type: string,
        upload_by: string,
        comments: string;
        lead_type?: string;
        client_budget?: string;
        location?: string;
        preferred_configuration?: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
};

interface Props {
    data: Assign[];
}

export default function AssignCardTable({ data }: Props) {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        user: '',
        id: '', // This is the ID filter state
        disposition: '',
        leadSource: '',
        projectName: '',
        clientBudget: '',
        location: '',
        preferredConfiguration: '',
    });

    const dropdownOptions = useMemo(() => {
        const unique = <T extends string | undefined>(arr: T[]) =>
            Array.from(new Set(arr.filter(Boolean))) as string[];

        return {
            users: unique(data.map(d => d.assignee_name)),
            dispositions: unique(data.map(d => d.status)),
            leadSources: unique(data.map(d => d.lead_details.projectSource)),
            projectNames: unique(data.map(d => d.lead_details.source)),
            budgets: unique(data.map(d => d.lead_details.client_budget)),
            locations: unique(data.map(d => d.lead_details.location)),
            configurations: unique(data.map(d => d.lead_details.preferred_configuration)),
        };
    }, [data]);

    const filteredData = useMemo(() => {
        // Reset page index to 0 when filters or data change
        setPagination(prev => ({ ...prev, pageIndex: 0 }));

        const filterIdValue = filters.id.toLowerCase().trim();

        const filtered = data.filter(item => {
            const lead = item.lead_details;
            const itemUpdatedAt = new Date(item.updatedAt);

            // 1. Date Filters
            const afterStart =
                !filters.startDate || itemUpdatedAt >= new Date(filters.startDate);
            const beforeEnd =
                !filters.endDate ||
                itemUpdatedAt <= new Date(filters.endDate + 'T23:59:59'); // Include the full end day

            // 2. ID Filter (New Logic)
            const matchId = !filterIdValue || (
                item._id.toLowerCase().includes(filterIdValue) || // Search main assignment ID
                item.lead_id.toLowerCase().includes(filterIdValue) || // Search lead_id
                item.dumb_id.toLowerCase().includes(filterIdValue) // Search dumb_id
            );

            // 3. Dropdown Filters
            const matchUser = !filters.user || item.assignee_name === filters.user;
            const matchDisposition = !filters.disposition || item.status === filters.disposition;
            const matchLeadSource = !filters.leadSource || lead.projectSource === filters.leadSource;
            const matchProjectName = !filters.projectName || lead.source === filters.projectName;
            const matchBudget = !filters.clientBudget || lead.client_budget === filters.clientBudget;
            const matchLocation = !filters.location || lead.location === filters.location;
            const matchConfig =
                !filters.preferredConfiguration ||
                lead.preferred_configuration === filters.preferredConfiguration;

            return (
                afterStart &&
                beforeEnd &&
                matchId && // Include the new ID filter
                matchUser &&
                matchDisposition &&
                matchLeadSource &&
                matchProjectName &&
                matchBudget &&
                matchLocation &&
                matchConfig
            );
        });

        // CRITICAL CHANGE: Sort the data by 'updatedAt' in descending order (newest first)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return dateB - dateA; // Sorts B before A if B is newer
        });

    }, [data, filters]); // Dependencies remain the same

    const columns: ColumnDef<Assign>[] = [
        {
            header: 'Date/Time',
            accessorFn: r => r.updatedAt,
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
                return <div className="min-w-[100px] whitespace-nowrap">{`${formattedDate} ${formattedTime}`}</div>;
            },
        },
        { header: 'Customer', accessorFn: r => r.lead_details.name, id: 'customerName', cell: ({ getValue }) => <div className="truncate max-w-[120px]">{getValue() as string}</div> },
        { header: 'Phone', accessorFn: r => r.lead_details.phone, id: 'phone', cell: ({ getValue }) => <div className="truncate max-w-[100px]">{getValue() as string}</div> },
        // { header: 'Email', accessorFn: r => r.lead_details.email, id: 'email', cell: ({ getValue }) => <div className="truncate max-w-[150px]" title={getValue() as string}>{getValue() as string}</div> },
        { header: 'Project', accessorFn: r => r.lead_details.source, id: 'projectName', cell: ({ getValue }) => <div className="truncate max-w-[120px]">{getValue() as string}</div> },
        { header: 'Source', accessorFn: r => r.lead_details.projectSource, id: 'leadSource', cell: ({ getValue }) => <div className="truncate max-w-[100px]">{getValue() as string}</div> },
        { header: 'Assignee', accessorFn: r => r.assignee_name, id: 'assignee', cell: ({ getValue }) => <div className="truncate max-w-[100px]">{getValue() as string}</div> },
        { header: 'Status', accessorFn: r => r.status, id: 'status', cell: ({ getValue }) => <div className="truncate max-w-[80px]">{getValue() as string}</div> },
    ];

    const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination },
    });

    const filteredCount = filteredData.length;

    const toggleExpand = (id: string) => setExpandedRow(expandedRow === id ? null : id);

    const openModal = (leadId: string) => {
        setSelectedLeadId(leadId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLeadId(null);
    };

    const handleClearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            user: '',
            id: '',
            disposition: '',
            leadSource: '',
            projectName: '',
            clientBudget: '',
            location: '',
            preferredConfiguration: '',
        });
        window.location.reload()
    };

    return (
        <div className="space-y-6 overflow-x-hidden">
            <div className="text-lg font-bold text-gray-700">
                Lead Count: {filteredCount}
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-md shadow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 text-sm">
                {/* Dates */}
                <div>
                    <label className="block text-gray-600 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">ID (Search)</label>
                    <input
                        type="text" // Changed type to text for searching
                        value={filters.id}
                        onChange={e => setFilters({ ...filters, id: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>

                {/* Dropdown Filters */}
                {[
                    { key: 'user', label: 'User', options: dropdownOptions.users },
                    { key: 'disposition', label: 'Status', options: dropdownOptions.dispositions },
                    { key: 'leadSource', label: 'Lead Source', options: dropdownOptions.leadSources },
                    { key: 'projectName', label: 'Project Name', options: dropdownOptions.projectNames },
                    { key: 'clientBudget', label: 'Client Budget', options: dropdownOptions.budgets },
                    { key: 'location', label: 'Location', options: dropdownOptions.locations },
                    { key: 'preferredConfiguration', label: 'Preferred Configuration', options: dropdownOptions.configurations },
                ].map(({ key, label, options }) => (
                    <div key={key}>
                        <label className="block text-gray-600 mb-1">{label}</label>
                        <select
                            value={filters[key as keyof typeof filters]}
                            onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                            className="border px-2 py-1 rounded w-full"
                        >
                            <option value="">All</option>
                            {options.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* Clear Button */}
                <div className="flex">
                    <button
                        onClick={handleClearFilters}
                        className="bg-red-500 cursor-pointer px-3 text-white py-1 rounded w-full sm:w-auto self-end"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table Section (Rest of the code is unchanged) */}
            <div className="overflow-x-auto border rounded-md bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                <th className="px-4 py-2"></th>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2 whitespace-nowrap">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                                <th className="px-4 py-2 whitespace-nowrap">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {/* {table.getRowModel().rows.map(row => { */}
                        {table.getRowModel().rows.map((row) => {
                            const assign = row.original;
                            const lead = assign.lead_details;
                            const isExpanded = expandedRow === assign._id;

                            return (
                                <React.Fragment key={row.id}>
                                    <tr className="border-b hover:bg-yellow-50">
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => toggleExpand(assign._id)}
                                                className="text-blue-600 text-xs border px-2 py-1 rounded bg-gray-50 hover:bg-gray-100"
                                            >
                                                {isExpanded ? '➖' : '➕'}
                                            </button>
                                        </td>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-4 py-2 truncate max-w-[150px]">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2">
                                            <button
                                                className="px-2 py-1 text-xs bg-orange-500 cursor-pointer text-white rounded hover:bg-orange-600"
                                                onClick={() => openModal(assign.lead_id)}
                                            >
                                                Reassign
                                            </button>
                                        </td>
                                    </tr>

                                    {isExpanded && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={columns.length + 2} className="p-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs text-gray-700 break-words">
                                                    <div><strong>ID:</strong> {assign.dumb_id || '—'}</div>
                                                    <div><strong>Disposition:</strong> {lead.lead_status || '—'}</div>
                                                    <div><strong>Lead Type:</strong> {lead.lead_type || '—'}</div>
                                                    <div><strong>Client Budget:</strong> {lead.client_budget || '—'}</div>
                                                    <div><strong>Location:</strong> {lead.location || '—'}</div>
                                                    <div><strong>Preferred Config:</strong> {lead.preferred_configuration || '—'}</div>
                                                    <div><strong>Remarks:</strong> {lead.comments || '—'}</div>
                                                    <div><strong>Client Email:</strong> {lead.email || '—'}</div>
                                                    <div><strong>Assigned By:</strong> {lead.upload_by || '—'}</div>
                                                    <div><strong>Upload Type:</strong> {lead.upload_type || '—'}</div>
                                                </div>
                                                {Array.isArray(assign.history) && assign.history.length > 0 && (
                                                    <div className="mt-6 text-sm text-gray-800 border-t pt-4">
                                                        <strong className="block mb-4 text-base font-semibold text-gray-900">
                                                            Activity History (Newest First)
                                                        </strong>

                                                        {/* Timeline Container */}
                                                        <div className="relative border-l border-gray-200 space-y-4 ml-2 pl-4">

                                                            {/* KEEPING .reverse() to show newest at the top */}
                                                            {[...assign.history].reverse().map((item, index) => (
                                                                <div key={index} className="relative">

                                                                    {/* Timeline Dot/Marker */}
                                                                    <div className={`
                                                                        absolute w-3 h-3 rounded-full mt-4 -left-[22.5px] border border-white
                                                                        ${typeof item === 'string' ? 'bg-orange-400' : 'bg-indigo-500'}
                                                                    `}></div>

                                                                    {typeof item === 'string' ? (
                                                                        /* String Entry (e.g., Bulk Assignment) - styled to look like an important event */
                                                                        <div className="p-3 bg-orange-50 rounded-lg shadow-sm border border-orange-200">
                                                                            <p className="font-medium text-orange-800">
                                                                                {item}
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        /* Object Entry (e.g., Status Update) */
                                                                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">

                                                                            {/* Header: Status & Updated At */}
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <span className={`
                                                                                    font-bold text-base 
                                                                                    ${item.status === 'Booked' ? 'text-green-600' : 'text-indigo-600'}
                                                                                `}>
                                                                                    {item.status || 'Status Updated'}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {item.updatedAt
                                                                                        ? new Date(item.updatedAt).toLocaleString()
                                                                                        : '—'}
                                                                                </span>
                                                                            </div>

                                                                            {/* Assignee */}
                                                                            <div className="text-xs text-gray-600 mb-1">
                                                                                <span className="font-medium">Assignee:</span> {item.assignee_name || '—'}
                                                                            </div>

                                                                            {/* Remarks */}
                                                                            {item.remarks && (
                                                                                <div className="mt-2 p-2 bg-indigo-50 rounded-md border border-indigo-100">
                                                                                    <strong className="block text-xs text-indigo-700">Remarks:</strong>
                                                                                    <p className="text-xs text-indigo-800">{item.remarks}</p>
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}

                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {filteredData.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        No leads found matching your filters.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {'>>'}
                        </button>
                    </div>

                    <span>
                        Page{' '}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                        <label>Rows per page:</label>
                        <select
                            value={pageSize}
                            onChange={e =>
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: Number(e.target.value),
                                }))
                            }
                            className="border rounded px-2 py-1"
                        >
                            {[10, 25, 50].map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {isModalOpen && selectedLeadId && (
                <ReassignModal onClose={closeModal} leadId={selectedLeadId} />
            )}
        </div>
    );
}