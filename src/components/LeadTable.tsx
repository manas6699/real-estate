"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/loader';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState
} from '@tanstack/react-table';

import { GET_ALL_LEADS } from '../config/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Lead = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    createdAt: string;
};

export default function LeadTable() {
    const [data, setData] = useState<Lead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const res = await axios.get(GET_ALL_LEADS, {
                    withCredentials: true
                });
                if (Array.isArray(res.data.leads)) {
                    setData(res.data.leads);
                } else {
                    throw new Error('Invalid data format from server.');
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                alert(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Something went wrong while fetching leads.'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);



    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const columns: ColumnDef<Lead>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'phone', header: 'Phone' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'source', header: 'Source' },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: (info) => formatDate(info.getValue() as string),
            sortingFn: 'datetime',
        },
        {
            id: 'time',
            header: 'Time',
            accessorFn: (row) => formatTime(row.createdAt),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize,
                pageIndex: 0,
            },
        },
    });


    const exportToExcel = () => {
        const exportData = data.map((lead) => ({
            Name: lead.name,
            Phone: lead.phone,
            Email: lead.email,
            Source: lead.source,
            Date: formatDate(lead.createdAt),
            Time: formatTime(lead.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'leads_export.xlsx');
    };


    const getFilteredDataLength = () => {
        return table.getFilteredRowModel().rows.length;
    }

    const getFilteredProjectName = () => {
        const filterValue = table.getColumn('source')?.getFilterValue();
        if (!filterValue) return 'All Sources';
        return filterValue as string;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-8">
                Total {getFilteredDataLength()} lead from {getFilteredProjectName()} ,  out of   {data.length} Leads
            </h2>
            <div className="mb-4 flex items-center space-x-4">
                <label className="font-medium">Filter by Source:</label>
                <select
                    value={(table.getColumn('source')?.getFilterValue() as string) ?? ''}
                    onChange={(e) => table.getColumn('source')?.setFilterValue(e.target.value)}
                    className="border rounded px-3 py-1"
                >
                    <option value="">All</option>
                    {[...new Set(data.map((lead) => lead.source))].map((src) => (
                        <option key={src} value={src}>
                            {src}
                        </option>
                    ))}
                </select>
                <button
                    onClick={exportToExcel}
                    className="ml-auto bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                    Export to Excel
                </button>
            </div>


            {loading ? (
                <div className="text-center py-10 text-gray-500 text-lg font-medium">
                    <p>Loading leads...</p>
                    <div className="flex justify-center items-center mt-5">
                        <Loader />
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow rounded-md">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="text-left px-4 py-2 cursor-pointer select-none"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() === 'asc'
                                                ? ' 🔼'
                                                : header.column.getIsSorted() === 'desc'
                                                    ? ' 🔽'
                                                    : ''}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-2 border-t">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center py-10 text-gray-500 font-medium"
                                    >
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="bg-gray-200 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="bg-gray-200 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
