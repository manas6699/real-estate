'use client';
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    getFilteredRowModel,
    ColumnFiltersState,
    getFacetedUniqueValues,
    FilterFn,
    flexRender,
    getFacetedRowModel,
    getPaginationRowModel,
    PaginationState,
    VisibilityState
} from '@tanstack/react-table';
import { History, SlidersHorizontal, Download, RotateCcw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import AssignType from '@/types/AssignType';

// Define the shape for history entries and props
type HistoryEntry =
    | string
    | {
        lead_id?: string;
        assignee_name?: string;
        updatedAt?: string;
        status?: string;
        remarks?: string;
    };

interface Props {
    data: AssignType[];
}

// --------------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextFilter = ({ column }: { column: any }) => {
    const columnFilterValue = column.getFilterValue();
    return (
        <input
            type="text"
            value={(columnFilterValue ?? '')}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Search ${column.columnDef.header}...`}
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
    );
};
// FIXED Select Filter Component - Now shows only values from filtered data
function SelectFilter({
    column,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: any;
}) {
    const columnFilterValue = column.getFilterValue();

    // ⭐ CRITICAL FIX: Use faceted unique values which reflect CURRENTLY FILTERED data
    const facetedUniqueValues = column.getFacetedUniqueValues();

    // Convert to sorted array of values from the filtered dataset
    const sortedValues = useMemo(() => {
        const values = Array.from(facetedUniqueValues.keys())
            .filter(value => value && String(value).trim() !== '')
            .sort();
        return values;
    }, [facetedUniqueValues]); // Re-run when faceted values change

    return (
        <select
            value={(columnFilterValue ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value || undefined)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
        >
            <option value="">All {column.columnDef.header}</option>
            {sortedValues.map((value) => (
                <option key={String(value)} value={String(value)}>
                    {String(value)}
                </option>
            ))}
        </select>
    );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DateRangeFilter({ column }: { column: any }) {
    // 1. Correctly retrieve the filter value, which is an array: [startDate, endDate]
    // If the filter is not set, it defaults to [undefined, undefined]
    const [startDate, endDate] = (column.getFilterValue() as [string | undefined, string | undefined]) ?? [undefined, undefined];

    const setFilter = (newStartDate: string | undefined, newEndDate: string | undefined) => {
        // TanStack Table filter values should be `undefined` to clear the filter.
        // We only set the filter if at least one date is provided.
        column.setFilterValue(
            [newStartDate, newEndDate].some(Boolean)
                ? [newStartDate, newEndDate]
                : undefined
        );
    };

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // The input value is correctly passed as a string ('YYYY-MM-DD')
        setFilter(e.target.value || undefined, endDate);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(startDate, e.target.value || undefined);
    };

    const clearFilter = () => {
        setFilter(undefined, undefined);
    };

    return (
        <div className="flex flex-col space-y-2 p-1">
            {/* ... (Start Date Input) ... */}
            <div className="flex flex-col space-y-2">
                <div className="relative">
                    <input
                        type="date"
                        // This uses the date string from the filter state.
                        value={startDate || ''}
                        onChange={handleStartChange}
                        data-column={column.id}
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Start Date"
                        title="Start Date"
                    />
                    {/* ... (Calendar Icon) ... */}
                    <Calendar size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* ... (End Date Input) ... */}
                <div className="relative">
                    <input
                        type="date"
                        // This uses the date string from the filter state.
                        value={endDate || ''}
                        onChange={handleEndChange}
                        data-column={column.id}
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="End Date"
                        title="End Date"
                    />
                    {/* ... (Calendar Icon) ... */}
                    <Calendar size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {(startDate || endDate) && (
                <button
                    onClick={clearFilter}
                    className="w-full py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
                >
                    Clear Dates
                </button>
            )}

            {/* ... (Style Block) ... */}
            <style jsx>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
opacity: 0;
width: 100%;
height: 100%;
position: absolute;
cursor: pointer;
}
`}</style>
        </div>
    );
}



// Custom filter function for date range
const dateRangeFilter: FilterFn<AssignType> = (row, columnId, filterValue) => {
    const rowDate = new Date(row.getValue(columnId) as string);
    const [startDateString, endDateString] = filterValue;

    if (!startDateString && !endDateString) return true;

    // Normalize dates to start of day for accurate comparison
    const rowDateNormalized = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()).getTime();

    if (startDateString) {
        const start = new Date(startDateString);
        const startDateNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
        if (rowDateNormalized < startDateNormalized) return false;
    }

    if (endDateString) {
        const end = new Date(endDateString);
        // Add one day to the end date to include all data on the end date
        const endDateNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1).getTime();
        if (rowDateNormalized >= endDateNormalized) return false;
    }

    return true;
};

// --------------------------------------------------------------------------------

export default function ReportTable({ data }: Props) {
    const [selectedHistory, setSelectedHistory] = useState<HistoryEntry[] | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const columnMenuRef = useRef<HTMLDivElement>(null);

    // 1. Initialize default column visibility
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: true,
        customer_name: true,
        phone: true,
        dumb_id: true,
        project_name: true,
        lead_source: true,
        client_budget: true,
        remarks: true,
        subdisposition: true,
        disposition: true,
        user: true,
        history: true,
        // Any column NOT listed here will be visible by default unless specified otherwise in the column definition.
        // To hide others by default, list them as false:
        email: false,
        configuration: false,
        admin_remark: false,
        location: false,
        alternate_phone: false,
        furnished_status: false,
        interested_project: false,
        assign_mode: false,
        upload_by: false,
        upload_type: false,
    });

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })

    const columns = useMemo<ColumnDef<AssignType>[]>(
        () => [
            {
                id: 'createdAt', // Explicit ID
                accessorKey: 'createdAt',
                header: 'Date & Time',
                enableColumnFilter: true,
                filterFn: dateRangeFilter,
                cell: (info) => {
                    const date = new Date(info.getValue() as string);
                    return (
                        <>
                            {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            &nbsp;
                            {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </>
                    );
                },
            },
            {
                id: 'customer_name', // Explicit ID for Customer Name
                accessorKey: 'lead_details.name',
                header: 'Customer Name',
                enableColumnFilter: true,
                filterFn: 'includesString',
            },
            {
                id: 'phone', // Explicit ID for Phone
                accessorKey: 'lead_details.phone',
                header: 'Phone',
                enableColumnFilter: true
            },
            {
                id: 'dumb_id',
                accessorKey: 'dumb_id',
                header: 'Id',
                enableColumnFilter: true,
            },
            {
                id: 'email', // Explicit ID for Email
                accessorKey: 'lead_details.email',
                header: 'Email',
                enableColumnFilter: true
            },
            {
                id: 'project_name', // Explicit ID
                accessorKey: 'lead_details.source',
                header: 'Project Name',
                enableColumnFilter: true
            },
            {
                id: 'lead_source', // Explicit ID
                accessorKey: 'lead_details.projectSource',
                header: 'Lead Source',
                enableColumnFilter: true
            },
            {
                id: 'client_budget', // Explicit ID
                accessorKey: 'lead_details.client_budget',
                header: 'Client Budget',
                enableColumnFilter: true
            },
            {
                id: 'configuration', // Explicit ID
                accessorKey: 'lead_details.preferred_configuration',
                header: 'Configuration',
                enableColumnFilter: true
            },
            {
                id: 'admin_remark', // Explicit ID
                accessorKey: 'remarks',
                header: 'Admin Remark',
                enableColumnFilter: false
            },
            {
                id: 'remarks', // Explicit ID
                accessorKey: 'lead_details.comments',
                header: 'Remarks',
                enableColumnFilter: false
            },
            {
                id: 'subdisposition', // Explicit ID
                accessorKey: 'lead_details.subdisposition',
                header: 'Subdisposition',
                enableColumnFilter: true,
                cell: ({ row }) => {
                    const lead = row.original.lead_details;
                    const displayStatus = lead.subdisposition;

                    return (


                        <span className="truncate max-w-xs">{displayStatus}</span>

                    );
                },
            },
            {
                id: 'disposition', // Explicit ID
                accessorKey: 'lead_details.lead_status',
                header: 'Disposition',
                enableColumnFilter: true,
                cell: ({ row }) => {
                    const lead = row.original.lead_details;
                    const assign = row.original;
                    const displayStatus = lead.lead_status || assign.status;

                    return (
                        <span className="flex items-center space-x-1.5">
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${assign.status === 'assigned' ? 'bg-red-500' : 'bg-purple-500'
                                    }`}
                            ></span>
                            <span className="truncate max-w-xs">{displayStatus}</span>
                        </span>
                    );
                },
            },
            {
                id: 'user', // Explicit ID
                accessorKey: 'assignee_name',
                header: 'User',
                enableColumnFilter: true
            },
            {
                id: 'location', // Explicit ID
                accessorKey: 'lead_details.location',
                header: 'Location',
                enableColumnFilter: true
            },
            {
                id: 'alternate_phone', // Explicit ID
                accessorKey: 'lead_details.alternate_phone',
                header: 'Alternate Phone',
                enableColumnFilter: true
            },
            {
                id: 'furnished_status', // Explicit ID
                accessorKey: 'lead_details.furnished_status',
                header: 'Furnished Status',
                enableColumnFilter: true
            },
            {
                id: 'interested_project', // Explicit ID
                accessorKey: 'lead_details.interested_project',
                header: 'Interested Project',
                enableColumnFilter: true
            },
            {
                id: 'assign_mode', // Explicit ID
                accessorKey: 'assign_mode',
                header: 'Assign Mode',
                enableColumnFilter: true
            },
            {
                id: 'upload_by', // Explicit ID
                accessorKey: 'lead_details.upload_by',
                header: 'Upload By',
                enableColumnFilter: true
            },
            {
                id: 'upload_type', // Explicit ID
                accessorKey: 'lead_details.upload_type',
                header: 'Upload Type',
                enableColumnFilter: true
            },
            {
                id: 'history', // Explicit ID
                accessorKey: 'history',
                header: 'View History',
                enableColumnFilter: false,
                cell: ({ row }) => (
                    <div className="px-4 py-3 text-center">
                        <button
                            onClick={() => openSidebar(row.original.history)}
                            className="inline-flex items-center justify-center p-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                            aria-label="View history"
                        >
                            <History size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // ⭐ KEY FIX: Added getFacetedRowModel for proper dynamic filtering
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            pagination,
            columnVisibility
        },
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(), // This enables dynamic facet updates
        getFacetedUniqueValues: getFacetedUniqueValues(), // This provides current filtered unique values
        getPaginationRowModel: getPaginationRowModel(), // For pagination
        filterFns: {
            dateRangeFilter: dateRangeFilter,
        },
    });

    // Logic to close the column menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
                setShowColumnMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [columnMenuRef]);

    const openSidebar = (history: HistoryEntry[] | undefined) => {
        if (history && history.length > 0) {
            setSelectedHistory(history);
        } else {
            setSelectedHistory([]);
        }
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedHistory(null);
    };

    const handleResetFilters = () => {
        setColumnFilters([]);
        // Clear all date inputs
        document.querySelectorAll('input[type="date"]').forEach(input => {
            (input as HTMLInputElement).value = '';
        });
    };

    const handleExportToExcel = () => {
        // 1. Get VISIBLE columns
        const visibleColumns = table.getAllColumns().filter(col => col.getIsVisible());

        // 2. Map column headers for the spreadsheet header row
        const header = visibleColumns.map(col => col.columnDef.header as string);

        // 3. Map filtered rows to data array
        const dataForExport = table.getFilteredRowModel().rows.map(row => {
            return visibleColumns.map(column => {
                if (column.id === 'createdAt') {
                    // Custom formatting for the 'createdAt' date column
                    const dateValue = row.getValue(column.id) as string;
                    if (!dateValue) return '';
                    const date = new Date(dateValue);
                    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
                }

                if (column.id === 'disposition') {
                    // Custom logic for the 'disposition' column
                    const lead = row.original.lead_details;
                    const assign = row.original;
                    return lead.lead_status || assign.status;
                }

                // Fallback for simple values
                return row.getValue(column.id) ?? '';
            });
        });

        // 4. Create the SheetJS (xlsx) workbook and sheet
        const wsData = [header, ...dataForExport];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report Data');

        // 5. Download the file
        XLSX.writeFile(wb, 'Lead_Report.xlsx');

    };

    return (
        <div className="rounded-xl">
            {/* Table Controls */}
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-x border-t border-gray-200 rounded-t-lg">
                <button
                    onClick={handleExportToExcel}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    aria-label="Export to Excel"
                >
                    <Download size={16} />
                    <span>Export to Excel</span>
                </button>

                <button
                    onClick={handleResetFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    aria-label="Reset Filters"
                >
                    <RotateCcw size={16} />
                    <span>Reset Filters</span>
                </button>

                {/* Select Columns Dropdown */}
                <div className="relative inline-block text-left">
                    <button
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                        aria-expanded={showColumnMenu}
                        aria-haspopup="true"
                    >
                        <SlidersHorizontal size={16} />
                        <span>Select Columns</span>
                    </button>

                    {showColumnMenu && (
                        <div
                            ref={columnMenuRef}
                            className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-200"
                        >
                            <div className="py-2">
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                    Show/Hide Columns
                                </div>

                                {/* 4. Add Select All / Select None Buttons */}
                                <div className="px-4 py-2 flex space-x-2 border-b border-gray-100 bg-gray-50">
                                    <button
                                        onClick={() => table.toggleAllColumnsVisible(true)}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        Select All
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={() => table.toggleAllColumnsVisible(false)}
                                        className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline"
                                    >
                                        Select None
                                    </button>
                                </div>
                                {table.getAllColumns()
                                    .filter(column => column.getCanHide())
                                    .map(column => (
                                        <label key={column.id} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={column.getIsVisible()}
                                                onChange={column.getToggleVisibilityHandler()}
                                                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            {column.columnDef.header as string}
                                        </label>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Table */}
            <div className="relative rounded-b-lg border-x border-b border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-max border-collapse text-sm rounded-xl">
                        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        if (!header.column.getIsVisible()) return null;

                                        const TEXT_FILTER_COLUMNS = [
                                            'customer_name',    // Customer Name
                                            'phone',           // Phone
                                            'email',           // Email
                                            'alternate_phone', // Alternate Phone
                                            'dumb_id', // dumb_id new addition  
                                        ];
                                        const isTextFilter = TEXT_FILTER_COLUMNS.includes(header.column.id);

                                        return (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="px-3 py-3 whitespace-nowrap border-b border-gray-200"
                                            >
                                                <div className="flex flex-col space-y-2">
                                                    <span className="font-bold text-xs">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </span>
                                                    {header.column.getCanFilter() ? (
                                                        isTextFilter ? (
                                                            <TextFilter column={header.column} />
                                                        ) : header.column.id === 'createdAt' ? (
                                                            <DateRangeFilter column={header.column} />
                                                        ) : (
                                                            <SelectFilter column={header.column} />
                                                        )
                                                    ) : (
                                                        <div className="h-10"></div>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => {
                                return (
                                    <tr key={row.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-4 py-3  max-w-xs text-gray-900">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --------------------- Pagination Controls --------------------- */}
            <div className=" justify-between items-center px-4 py-3 bg-white border-x border-b border-gray-200 rounded-b-lg text-sm">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Rows per page:</span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="p-1.5 border border-gray-300 rounded-md text-sm bg-white"
                    >
                        {[10, 25, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                        Page{' '}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
                    </span>
                    <span className="text-gray-600">
                        Total Records: <strong>{table.getFilteredRowModel().rows.length}</strong>
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next Page"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {/* ------------------- End Pagination Controls ------------------- */}

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="fixed top-0 right-0 md:w-96 w-full h-full bg-white shadow-xl border-l transform transition-transform duration-300 ease-in-out z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Lead History</h2>
                        <button
                            onClick={closeSidebar}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
                        {selectedHistory && selectedHistory.length > 0 ? (
                            <ul className="space-y-3">
                                {[...selectedHistory].reverse().map((h, idx) => (
                                    <li key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">
                                        {typeof h === 'string' ? (
                                            <span>{h}</span>
                                        ) : (
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <strong className="font-medium text-gray-900">{h.assignee_name || 'Unknown'}</strong>
                                                    <span className="text-xs text-gray-500">
                                                        {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : 'Unknown date'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-extrabold px-2 py-0.5 text-blue-800">
                                                        {h.status || 'N/A'}
                                                    </span>
                                                    {h.remarks && (
                                                        <span className="ml-2 text-xs text-gray-600">
                                                            Remarks: {h.remarks}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <History size={32} className="text-gray-300 mb-2" />
                                <p className="text-sm">No history available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:bg-opacity-0"
                    onClick={closeSidebar}
                ></div>
            )}

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}