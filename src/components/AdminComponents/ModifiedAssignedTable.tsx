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
import Assign from '@/types/AssignType2'
import ReassignModal from '@/components/AdminComponents/ReassignModal';
import {
    ChevronDown,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    FilterX,
    Search,
    SearchX,
} from 'lucide-react';
import CommentBox from './CommentBox';
import { ToastContainer } from 'react-toastify';

interface Props {
    data: Assign[];
}

export default function AssignCardTable({ data }: Props) {
    // --- State and Business Logic (Unchanged) ---
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
        id: '',
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
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        const filterIdValue = filters.id.toLowerCase().trim();
        const filtered = data.filter(item => {
            const lead = item.lead_details;
            const itemUpdatedAt = new Date(item.updatedAt);
            const afterStart =
                !filters.startDate || itemUpdatedAt >= new Date(filters.startDate);
            const beforeEnd =
                !filters.endDate ||
                itemUpdatedAt <= new Date(filters.endDate + 'T23:59:59');
            const matchId = !filterIdValue || (
                item._id.toLowerCase().includes(filterIdValue) ||
                item.lead_id.toLowerCase().includes(filterIdValue) ||
                item.dumb_id.toLowerCase().includes(filterIdValue)
            );
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
                matchId &&
                matchUser &&
                matchDisposition &&
                matchLeadSource &&
                matchProjectName &&
                matchBudget &&
                matchLocation &&
                matchConfig
            );
        });
        return filtered.sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return dateB - dateA;
        });
    }, [data, filters]);

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
        { header: 'Customer', accessorFn: r => r.lead_details.name, id: 'customerName', cell: ({ getValue }) => <div className="truncate max-w-[120px] font-medium text-gray-800">{getValue() as string}</div> },
        // { header: 'Phone', accessorFn: r => r.lead_details.phone, id: 'phone', cell: ({ getValue }) => <div className="truncate max-w-[100px]">{getValue() as string}</div> },
        // { header: 'Project', accessorFn: r => r.lead_details.source, id: 'projectName', cell: ({ getValue }) => <div className="truncate max-w-[120px]">{getValue() as string}</div> },
        { header: 'Source', accessorFn: r => r.lead_details.projectSource, id: 'leadSource', cell: ({ getValue }) => <div className="truncate max-w-[100px]">{getValue() as string}</div> },
        { header: 'Assignee', accessorFn: r => r.assignee_name, id: 'assignee', cell: ({ getValue }) => <div className="truncate max-w-[100px]">{getValue() as string}</div> },
        {
            header: 'Status', accessorFn: r => r.status, id: 'status', cell: ({ getValue }) => (
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                    {getValue() as string}
                </span>
            )
        },
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
        window.location.reload()
    };

    const filterInputClass = "border border-gray-300 px-3 py-2 rounded-lg w-full text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-150";

    return (
        // --- ROOT DIV: `overflow-x-hidden` REMOVED ---
        <div className="space-y-4">
            <div className="font-bold text-gray-800 ml-6 mt-4">
                Lead Count: {filteredCount}
            </div>

            {/* --- Filters Section (Unchanged) --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-sm">
                <div>
                    <label className="block text-gray-600 font-medium mb-1.5">Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                        className={filterInputClass}
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium mb-1.5">End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                        className={filterInputClass}
                    />
                </div>
                <div className="relative">
                    <label className="block text-gray-600 font-medium mb-1.5">ID (Search)</label>
                    <input
                        type="text"
                        value={filters.id}
                        onChange={e => setFilters({ ...filters, id: e.target.value })}
                        className={`${filterInputClass} pl-10`}
                        placeholder="Search IDs..."
                    />
                    <Search className="absolute left-3 top-[38px] w-4 h-4 text-gray-400" />
                </div>

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
                        <label className="text-xs text-gray-600 mb-1.5">{label}</label>
                        <select
                            value={filters[key as keyof typeof filters]}
                            onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                            className={filterInputClass}
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

                <div className="flex">
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 cursor-pointer px-4 text-white py-2 rounded-lg w-full sm:w-auto self-end font-semibold shadow-md hover:shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <FilterX className="w-4 h-4" />
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* --- TABLE CONTAINER: `sexy-table-scrollbar` ADDED --- */}
            <div className="overflow-x-auto border rounded-xl bg-white shadow-lg sexy-table-scrollbar">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                <th className="px-6 py-4 w-12"></th>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-4">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                                <th className="px-6 py-4 whitespace-nowrap">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => {
                            const assign = row.original;
                            const lead = assign.lead_details;
                            const isExpanded = expandedRow === assign._id;

                            return (
                                <React.Fragment key={row.id}>
                                    <tr className="border-b hover:bg-orange-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleExpand(assign._id)}
                                                className="text-orange-600 p-1.5 rounded-full hover:bg-orange-100 transition-colors"
                                            >
                                                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 text-gray-800 truncate max-w-[150px]">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4">
                                            <button
                                                className="px-3 py-1.5 text-xs bg-orange-500 cursor-pointer text-white rounded-md font-semibold hover:bg-orange-600 transition-all hover:shadow-md whitespace-nowrap"
                                                onClick={() => openModal(assign.lead_id)}
                                            >
                                                Reassign
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Row (Unchanged) */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50/80">
                                            <td colSpan={columns.length + 2} className="p-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-700 break-words">
                                                    <DetailItem label="ID" value={assign.dumb_id} />
                                                    <DetailItem label="Phone" value={lead.phone} />
                                                    <DetailItem label="Project" value={lead.source} />
                                                    <DetailItem label="Disposition" value={lead.lead_status} />
                                                    <DetailItem label="Sub Disposition" value={lead.subdisposition || lead.sub_disposition} />
                                                    <DetailItem label="Lead Type" value={lead.lead_type} />
                                                    <DetailItem label="Client Budget" value={lead.client_budget} />
                                                    <DetailItem label="Location" value={lead.location} />
                                                    <DetailItem label="Preferred Config" value={lead.preferred_configuration} />
                                                    <DetailItem label="Client Email" value={lead.email} />
                                                    <DetailItem label="Assigned By" value={lead.upload_by} />
                                                    <DetailItem label="Upload Type" value={lead.upload_type} />
                                                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                                                        <DetailItem label="Remarks" value={lead.comments} />
                                                    </div>
                                                </div>

                                                {Array.isArray(assign.history) && assign.history.length > 0 && (
                                                    <div className="mt-6 text-sm text-gray-800 border-t border-gray-200 pt-6">
                                                        <CommentBox assignid={assign._id} assignee_id={assign.assignee_id} />
                                                        <ToastContainer position="top-right" autoClose={3000} />
                                                        <strong className="block mb-1 text-lg font-semibold text-gray-900">
                                                            Activity History (Newest First)
                                                        </strong>


                                                        <div className="relative border-l-2 border-gray-200 space-y-6 ml-2 pl-6">
                                                            {[...assign.history].reverse().map((item, index) => (
                                                                <div key={index} className="relative">
                                                                    <div className={`
                                                                        absolute w-4 h-4 rounded-full mt-4 -left-[33.5px] border-4 border-white
                                                                        ${typeof item === 'string' ? 'bg-orange-400' : 'bg-indigo-500'}
                                                                    `}></div>
                                                                    {typeof item === 'string' ? (
                                                                        <div className="p-4 bg-orange-50 rounded-xl shadow-lg border border-orange-100">
                                                                            <p className="font-semibold text-orange-800">
                                                                                {item}
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <span className={`
                                                                                    font-bold text-lg 
                                                                                    ${item.status === 'Booked' ? 'text-green-600' : 'text-indigo-600'}
                                                                                `}>
                                                                                    {item.status || 'Status Updated'}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {item.updatedAt
                                                                                        ? new Date(item.updatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
                                                                                        : '—'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-sm text-gray-700 mb-1">
                                                                                <span className="font-semibold">Assignee:</span> {item.assignee_name || '—'}
                                                                            </div>
                                                                            {item.remarks && (
                                                                                <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                                                                    <strong className="block text-sm text-indigo-700">Remarks:</strong>
                                                                                    <p className="text-sm text-indigo-800">{item.remarks}</p>
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

                {/* No Results (Unchanged) */}
                {filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-sm">
                        <SearchX className="w-12 h-12 text-gray-400 mb-4" />
                        <span className="text-lg font-semibold">No Leads Found</span>
                        <span>No leads were found matching your filters.</span>
                    </div>
                )}
            </div>

            {/* Pagination (Unchanged) */}
            {filteredData.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                        <PaginationButton
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </PaginationButton>
                    </div>

                    <span className="font-semibold text-gray-700">
                        Page{' '}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                        <label className="font-medium text-gray-600">Rows per page:</label>
                        <select
                            value={pageSize}
                            onChange={e =>
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: Number(e.target.value),
                                }))
                            }
                            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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

            {/* --- CUSTOM HORIZONTAL SCROLLBAR STYLES --- */}
            {/* These styles are applied using the `sexy-table-scrollbar` class */}
            <style jsx global>{`
                /* For Webkit browsers (Chrome, Safari, Edge) */
                .sexy-table-scrollbar::-webkit-scrollbar {
                    height: 10px; /* Height of the horizontal scrollbar */
                }
                .sexy-table-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9; /* bg-slate-100 */
                    border-radius: 10px;
                    margin: 10px; /* Adds padding around the track */
                }
                .sexy-table-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #fb923c; /* tailwind's orange-400 */
                    border-radius: 10px;
                }
                .sexy-table-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #f97316; /* tailwind's orange-500 */
                }

                /* For Firefox */
                .sexy-table-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #fb923c #f1f5f9; /* thumb color track color */
                }
            `}</style>

        </div>
    );
}

// --- Helper Components (Unchanged) ---
function DetailItem({ label, value }: { label: string; value: string | undefined | null }) {
    if (!value) return null;
    return (
        <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">{label}</span>
            <span className="block text-gray-800">{value}</span>
        </div>
    );
}

function PaginationButton({ children, ...props }: React.ComponentProps<'button'>) {
    return (
        <button
            {...props}
            className="p-2 border rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
        >
            {children}
        </button>
    );
}