// components/PropertyTable.tsx
'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    ColumnFiltersState,
    FilterFn
} from '@tanstack/react-table';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ADD_INVENTORY_API } from '@/config/api';
import { Edit } from 'lucide-react';

// Types based on your backend response
interface OwnerDetails {
    ownerName: string;
    ownerPhone: string;
    ownerAltPhone?: string;
    ownerEmail?: string;
    ownerType: string;
    ownerNotes?: string;
}

interface Amenities {
    clubhouse: boolean;
    swimmingPool: boolean;
    gym: boolean;
    communityHall: boolean;
    badmintonCourt: boolean;
    cafeteria: boolean;
    gasPipeline: boolean;
}

interface Property {
    _id: string;
    ownerDetails: OwnerDetails;
    listingType: 'rent' | 'sale';
    propertyType: 'complex' | 'standalone' | 'individual';
    complexName: string;
    location: string;
    nearbyLandmarks: string;
    price?: number;
    rent?: number;
    securityDeposit?: number;
    maintenanceIncluded: boolean;
    configuration: string;
    furnishing: 'unfurnished' | 'semifurnished' | 'furnished';
    superBuiltUpArea: number;
    carpetArea: number;
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    totalFloors?: number;
    propertyOnFloor?: number;
    view: string;
    parking: string;
    vastuCompliant: boolean;
    liftAvailable: boolean;
    amenities: Amenities;
    status: string;
    featured: boolean;
    views: number;
    lastContacted?: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        properties: Property[];
        pagination: {
            current: number;
            total: number;
            limit: number;
            totalRecords: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}


// Custom filter function that doesn't require match-sorter-utils
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const containsFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    if (typeof value === 'string') {
        return value.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (typeof value === 'number') {
        return value.toString().includes(filterValue);
    }
    return false;
};

const PropertyTable: React.FC = () => {
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Fetch data from API
    const fetchProperties = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(ADD_INVENTORY_API, {
                params: {
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                },
            });

            if (response.data.success) {
                setProperties(response.data.data.properties);
                toast.success(`Loaded ${response.data.data.properties.length} properties`);
            } else {
                throw new Error(response.data.message);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error fetching properties:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch properties';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const handleEdit = useCallback(

        (property: Property) => {
            // handle edit redirect 
            router.push(`${property._id}`)
        },[router]
    )
    
    // Define columns
    const columns = useMemo<ColumnDef<Property>[]>(
        () => [
            {
                accessorKey: 'ownerDetails.ownerName',
                header: 'Owner Name',
                cell: info => info.getValue(),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'ownerDetails.ownerPhone',
                header: 'Phone',
                cell: info => info.getValue(),
            },
            {
                accessorKey: 'listingType',
                header: 'Type',
                cell: info => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === 'rent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                            }`}
                    >
                        {info.getValue() === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                ),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'propertyType',
                header: 'Property Type',
                cell: info => {
                    const type = info.getValue() as string;
                    const typeMap: { [key: string]: string } = {
                        complex: 'Apartment',
                        standalone: 'Standalone',
                        individual: 'Villa',
                    };
                    return typeMap[type] || type;
                },
                filterFn: containsFilter,
            },
            {
                accessorKey: 'location',
                header: 'Location',
                cell: info => info.getValue(),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'configuration',
                header: 'Config',
                cell: info => info.getValue(),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'price',
                header: 'Price/Rent',
                cell: info => {
                    const row = info.row.original;
                    if (row.listingType === 'sale' && row.price) {
                        return `₹${row.price.toLocaleString()}`;
                    } else if (row.listingType === 'rent' && row.rent) {
                        return `₹${row.rent.toLocaleString()}/month`;
                    }
                    return '-';
                },
                filterFn: containsFilter,
            },
            {
                accessorKey: 'superBuiltUpArea',
                header: 'Area (sqft)',
                cell: info => info.getValue(),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'bedrooms',
                header: 'Beds',
                cell: info => info.getValue(),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'bathrooms',
                header: 'Baths',
                cell: info => info.getValue(),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'furnishing',
                header: 'Furnishing',
                cell: info => {
                    const furnishing = info.getValue() as string;
                    return furnishing.charAt(0).toUpperCase() + furnishing.slice(1);
                },
                filterFn: containsFilter,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: info => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === 'active'
                            ? 'bg-green-100 text-green-800'
                            : info.getValue() === 'sold'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {info.getValue() as string}
                    </span>
                ),
                filterFn: containsFilter,
            },
            {
                accessorKey: 'createdAt',
                header: 'Created',
                cell: info => new Date(info.getValue() as string).toLocaleDateString(),
                filterFn: containsFilter,
            },
            {
                id: 'Edit',
                header: 'Edit',
                cell: ({ row }) => (
                    <div className="flex space-x-2">

                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-white p-1 hover:bg-yellow-500 bg-yellow-400 rounded cursor-pointer text-sm font-medium"
                        >
                            <Edit size={15}/>
                        </button>

                    </div>
                ),
            },
        ],
        [handleEdit]
    );

    // Initialize table
    const table = useReactTable({
        data: properties,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: containsFilter,
    });



    const handleRefresh = () => {
        fetchProperties();
    };

    if (loading && properties.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error && properties.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            {/* Header with Global Search and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Properties Inventory</h2>
                    <p className="text-gray-600">Total: {properties.length} properties</p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    {/* Global Search */}
                    <div className="relative">
                        <input
                            type="text"
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Search all properties..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Column Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {table.getHeaderGroups().map(headerGroup =>
                    headerGroup.headers
                        .filter(header => header.column.getCanFilter())
                        .map(header => (
                            <div key={header.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Filter by {header.column.columnDef.header as string}
                                </label>
                                <input
                                    type="text"
                                    value={(header.column.getFilterValue() as string) ?? ''}
                                    onChange={e => header.column.setFilterValue(e.target.value)}
                                    placeholder={`Search ${header.column.columnDef.header as string}...`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                        ))
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                            {{
                                                asc: <span className="text-gray-400">↑</span>,
                                                desc: <span className="text-gray-400">↓</span>,
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} •{' '}
                        {table.getFilteredRowModel().rows.length} results
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Show</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-700">entries</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            First
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyTable;