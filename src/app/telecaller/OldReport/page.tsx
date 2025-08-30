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
import { ASSIGN_OLD_LEADS_TO_TELECALLER, GET_ALL_TELECALLERS_API, GET_OLD_LEADS_FOR_TELECALLER } from "@/config/api";
import { formatDateToDDMMYYYY } from "@/utils/dateformat";


interface Telecaller {
    id: string;
    name: string;
    role: string;
    online: boolean;
}

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
    disposition?: string;
    project?: string;
}

const TelecallerPage = () => {
    const [data, setData] = useState<TelecallerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalLeads, setTotalLeads] = useState(0);

    const [rows, setRows] = useState<TelecallerData[]>([]);

    // modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
    const [selectedLead, setSelectedLead] = useState<TelecallerData | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [assigning, setAssigning] = useState("");

        // REMARKS STATE
        const [remarks, setRemarks] = useState("");
    // Filters
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [source, setSource] = useState("");
    const [disposition, setDisposition] = useState("");
    const [project, setProject] = useState(""); // ✅ fixed project filter
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const totalPages = Math.ceil(totalLeads / limit);

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
                        project, // ✅ added to query
                        startDate: formatDateToDDMMYYYY(startDate),
                        endDate: formatDateToDDMMYYYY(endDate), 
                    },
                });

                // Clean + filter out "No Data"
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
                setRows(cleanData);
                setTotalLeads(res.data.total || cleanData.length);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [page, phone, name, location, source, disposition, project, startDate, endDate, limit]);

    const resetFilters = () => {
        setPhone("");
        setName("");
        setLocation("");
        setSource("");
        setDisposition("");
        setProject("");
        setStartDate("");
        setEndDate("");
        setPage(1);
    };

    const columns = useMemo<ColumnDef<TelecallerData>[]>(() => {
        const baseColumns: ColumnDef<TelecallerData>[] =
            rows.length > 0
                ? Object.keys(rows[0])
                    .filter((key) => {
                        const lower = key.toLowerCase();
                        if (lower === "password") return false;
                        if (["username1", "username2"].includes(lower)) return false;
                        if (["enqdate2", "cdate", "created_at"].includes(lower)) return false;
                        if (["usertype", "flag", "matchid2", "matchid1"].includes(lower)) return false;
                        if (lower === "_id" || lower.endsWith("id")) return false;
                        return true;
                    })
                    .map((key) => ({
                        header: key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase()),
                        accessorKey: key,
                        cell: ({ getValue }) => <span>{String(getValue() || "-")}</span>,
                    }))
                : [];

        // Insert Action column at 1st position
        baseColumns.splice(0, 0, {
            header: "Action",
            id: "action",
            cell: ({ row }) => (
                <button
                    onClick={() => openModal(row.original)}
                    className="px-6 py-1 rounded-sm bg-orange-500 text-white text-xs hover:bg-orange-600"
                >
                    Resolve 
                </button>
            ),
        });

        return baseColumns;
    }, [rows]);

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const userData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;

    const openModal = async (lead: TelecallerData) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
        try {
            const res = await axios.get(GET_ALL_TELECALLERS_API);
            setTelecallers(res.data?.data || []);  // ✅ pick the `data` array
        } catch (err) {
            console.error("Failed to fetch telecallers", err);
            setTelecallers([]);
        }
    };

        const handleAssign = async (assignee_id: string, assignee_name: string) => {
            if (!selectedLead?._id) return;
    
            try {
                const response = await fetch(ASSIGN_OLD_LEADS_TO_TELECALLER, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        lead_id: selectedLead._id,
                        assignee_id,
                        assignee_name,
                        remarks,
                    }),
                });
    
                const data = await response.json();
                if (data.success) {
                    alert("Lead assigned successfully!");
                    setIsModalOpen(false);
                    setRemarks(""); 
                } else {
                    alert(`Failed: ${data.message}`);
                }
            } catch (error) {
                console.error("Error assigning lead:", error);
                alert("Something went wrong while assigning lead.");
            }
        };
    return (
        <div>
            <TelecallerSidebar />
            <main className="lg:ml-64">
                <Navbar />
            </main>
            <section className="lg:ml-64 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Old Lead Data</h1>
                    <span className="py-2 bg-black text-yellow-500 text-sm rounded-full px-14 font-extrabold">
                        Your Total Old Leads: {totalLeads}
                    </span>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                    <select
                        className="border p-2 rounded w-full"
                        value={disposition}
                        onChange={(e) => setDisposition(e.target.value)}
                    >
                        <option value="">Select Disposition</option>
                        <option value="Accept">Accept</option>
                        <option value="Call Back">Call Back</option>
                        <option value="Not Responding">Not Responding</option>
                        <option value="Not Reachable">Not Reachable</option>
                        <option value="Already Booked">Already Booked</option>
                        <option value="Under Follow Up">Under Follow Up</option>
                        <option value="Fraud">Fraud</option>
                        <option value="Busy">Busy</option>
                        <option value="DEO-MAIL">DEO-MAIL</option>
                        <option value="Reject">Reject</option>
                        <option value="Agent Switch">Agent Switch</option>
                        <option value="Requirement Did not match">Requirement Did not match</option>
                        <option value="Visit fixed">Visit fixed</option>
                        <option value="Already Purchased">Already Purchased</option>
                        <option value="Referred">Referred</option>
                        <option value="TELE-MAIL">TELE-MAIL</option>
                        <option value="Location Issue">Location Issue</option>
                        <option value="Visited Followup">Visited Followup</option>
                        <option value="Budget Issue">Budget Issue</option>
                        <option value="Duplicate">Duplicate</option>
                        <option value="ADMIN-MAIL">ADMIN-MAIL</option>
                        <option value="Booking Done">Booking Done</option>
                        <option value="AGENT-MAIL">AGENT-MAIL</option>
                        <option value="Language barrier">Language barrier</option>
                    </select>
                    <div>

                        <label className="text-sm font-medium text-slate-700">Filter by Project Name</label>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    {/* Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="col-span-2 md:col-span-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Page size */}
                <div className="ml-auto flex items-center gap-2 mb-3">
                    <label className="text-sm text-slate-600">Rows per page</label>
                    <select
                        className="rounded-xl border px-3 py-2"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        {[10, 25, 50, 100, 200].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
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
                    <span>
                        Page {page} of {totalPages || 1}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>


                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>

                            <h2 className="text-lg font-semibold mb-4">Assign Lead</h2>

                            {/* Telecallers List */}
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {telecallers.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No telecallers found.</p>
                                ) : (
                                    telecallers.map((tc) => {
                                        const isMe = tc.name === (userData?.name || "");
                                        return (
                                            <div
                                                key={tc.id}
                                                className="flex items-center justify-between border-b py-2"
                                            >
                                                <span>
                                                    {isMe ? "Assign to Myself" : tc.name}   
                                                </span>
                                                <button
                                                    disabled={assigning === tc.id}
                                                     onClick={() => handleAssign(tc.id, tc.name)}
                                                    className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                                                >
                                                    {assigning === tc.id ? "Assigning..." : "Assign"}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                             {/* Remarks Input now below telecallers */}
                            <div className="">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Remarks
                                </label>
                                <textarea
                                    value={remarks}
                                    required
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter remarks..."
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Footer */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </section>
        </div>
    );
};

export default TelecallerPage;
