"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import Navbar from "@/components/AdminComponents/Navbar";
import TelecallerSidebar from "@/components/TelecallerComponents/TelecallerSidebar";
import { GET_OLD_LEADS_FOR_TELECALLER } from "@/config/api";

interface TelecallerData {
    _id: string;
    eid: string;
    aid: string;
    tid: string;
    pid: number;
    cid: number;
    enq_date: string;
    enqdate2: string;
    purpose: string;
    remarks: string;
    plocation: string;
    source: string;
    min: string;
    max: string;
    flag: number;
    Username1: string;
    client_name: string;
    client_contact: string;
    whatsapp: string;
    cdate: string;
    call_status: string;
    entryid: number;
    created_at: string;
}

const TelecallerPage = () => {
    const [data, setData] = useState<TelecallerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalLeads, setTotalLeads] = useState(0);

    // Filters
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [source, setSource] = useState("");
    const [disposition, setDisposition] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userData = localStorage.getItem("user");
                if (!userData) return;

                const { _id: userId } = JSON.parse(userData);

                const res = await axios.get(GET_OLD_LEADS_FOR_TELECALLER, {
                    params: {
                        page,
                        limit,
                        userId,
                        phone,
                        name,
                        location,
                        source,
                        disposition,
                        startDate,
                        endDate,
                    },
                });

                // Filter out "No Data"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cleanData = res.data.data.map((item: Record<string, any>) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const filtered: Record<string, any> = {};
                    Object.keys(item).forEach((key) => {
                        if (item[key] !== "No Data") {
                            filtered[key] = item[key];
                        }
                    });
                    return filtered;
                });

                setData(cleanData);
                setTotalLeads(res.data.total || cleanData.length);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [page, phone, name, location, source, disposition, startDate, endDate, limit]);

    // Table columns
    const columns = useMemo<ColumnDef<TelecallerData>[]>(
        () => [
            { accessorKey: "eid", header: "EID" },
            { accessorKey: "enq_date", header: "Enquiry Date" },
            { accessorKey: "purpose", header: "Purpose" },
            { accessorKey: "remarks", header: "Remarks" },
            { accessorKey: "plocation", header: "Location" },
            { accessorKey: "source", header: "Source" },
            { accessorKey: "client_name", header: "Client Name" },
            { accessorKey: "client_contact", header: "Contact" },
            { accessorKey: "call_status", header: "Call Status" },
            { accessorKey: "created_at", header: "Created At" },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
             <TelecallerSidebar />
            <main className="lg:ml-64">
                 <Navbar />
                </main>
            <section className='lg:ml-64 p-6'>
                
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">
                        Old Lead Data
                        </h1>
                    {/* ✅ Total Leads */}
                    <span className="py-2 bg-orange-500 text-yellow-200 rounded-full px-6 font-extrabold">
                        Your Total Old Leads: {totalLeads}
                    </span>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Client Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Disposition"
                        value={disposition}
                        onChange={(e) => setDisposition(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Project"
                        value={disposition}
                        onChange={(e) => setDisposition(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto border rounded-lg shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2 text-left border-b text-sm font-medium"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center p-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-2 border-b text-sm">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center p-4">
                                        No Data Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
};

export default TelecallerPage;
