"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import { ASSIGN_OLD_LEADS_TO_TELECALLER, GET_ALL_TELECALLERS_API, GET_OLD_LEADS_FOR_ADMIN } from "@/config/api";
import Navbar from "@/components/AdminComponents/Navbar";
import Sidebar from "@/components/AdminComponents/Sidebar";

// ==========================
// Types
// ==========================
export type Lead = {
    _id?: string;
    eid?: number | string;
    aid?: string;
    tid?: string;
    pid?: string;
    cid?: string;
    enq_date?: string; // "DD-MM-YYYY HH:mm" as per backend
    enqdate2?: string; // "DD-MM-YYYY"
    purpose?: string;
    remarks?: string;
    plocation?: string;
    source?: string;
    flag?: number | string;
    zone?: string;
    mis_id?: string;
    reminder?: string;
    replydate1?: string;
    calltime?: string;
    flagupdate?: string;
    Username1?: string;
    Username2?: string;
    Usertype?: string;
    client_name?: string;
    client_contact?: string;
    client_mail?: string;
    whatsapp?: string;
    cdate?: string;
    proj_id?: string;
    pname?: string;
    devname?: string;
    created_at?: string;
    category?: string;
    facing?: string;
    pdate?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

// Server response shape from /api/ol
interface LeadsResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    totalPages: number;
    data: Lead[];
}

// ==========================
// Utilities
// ==========================

const API_URL = GET_OLD_LEADS_FOR_ADMIN;

// Convert HTML date (YYYY-MM-DD) -> DD-MM-YYYY for backend
function toDDMMYYYY(htmlDate?: string) {
    if (!htmlDate) return undefined;
    const [y, m, d] = htmlDate.split("-");
    if (!y || !m || !d) return undefined;
    return `${d}-${m}-${y}`;
}

function clsx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

// ==========================
// Filters UI State
// ==========================
interface Filters {
    username: string;
    location: string;
    name: string;
    phone: string;   // ✅ phone filter added
    source: string;
    start: string;
    end: string;
    disposition: string,
    pname: string
}

const defaultFilters: Filters = {
    username: "",
    location: "",
    name: "",
    phone: "",
    disposition: "",
    pname: "",
    source: "",
    start: "",
    end: "",
};


// ==========================
// Main Component
// ==========================
export default function OldLeadsTablePage() {
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);


    // ==========================
    // Modal State
    // ==========================
    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telecallers, setTelecallers] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [loadingTelecallers, setLoadingTelecallers] = useState(false);

    // REMARKS STATE
    const [remarks, setRemarks] = useState("");

    const openAssignModal = async (lead: Lead) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
        setLoadingTelecallers(true);
        try {
            const res = await fetch(GET_ALL_TELECALLERS_API);
            if (!res.ok) throw new Error("Failed to load telecallers");
            const json = await res.json();
            setTelecallers(json.data || []);
        } catch (err) {
            console.error(err);
            setTelecallers([]);
        } finally {
            setLoadingTelecallers(false);
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
                setRemarks(""); // reset remarks
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error assigning lead:", error);
            alert("Something went wrong while assigning lead.");
        }
    };

    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));

        if (filters.username.trim()) params.set("username", filters.username.trim());
        if (filters.location.trim()) params.set("location", filters.location.trim());
        if (filters.name.trim()) params.set("name", filters.name.trim());
        if (filters.source.trim()) params.set("source", filters.source.trim());
        if (filters.phone.trim()) params.set("phone", filters.phone.trim());
        if (filters.disposition.trim()) params.set("disposition", filters.disposition.trim());
        if (filters.pname.trim()) params.set("pname", filters.pname.trim());

        // Dates: backend expects DD-MM-YYYY
        const startDDMM = toDDMMYYYY(filters.start);
        const endDDMM = toDDMMYYYY(filters.end);
        if (startDDMM) params.set("startDate", startDDMM);
        if (endDDMM) params.set("endDate", endDDMM);

        return params.toString();
    }, [filters, page, limit]);


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const qs = buildQuery();
            const res = await fetch(`${API_URL}?${qs}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json: LeadsResponse = await res.json();
            setRows(json.data || []);
            setTotal(json.total || 0);
            setTotalPages(json.totalPages || 1);
        } catch (e) {
            console.error(e);
            setRows([]);
            setTotal(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [buildQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // TanStack Table Columns
    // Generate columns dynamically based on keys in rows
    // TanStack Table Columns
    const columns = useMemo<ColumnDef<Lead>[]>(() => {
        const baseColumns: ColumnDef<Lead>[] =
            rows.length > 0
                ? Object.keys(rows[0])
                    .filter((key) => {
                        const lower = key.toLowerCase();
                        if (lower === "password") return false;
                        if (lower === "_id" || lower.endsWith("id")) return false;
                        return true;
                    })
                    .map((key) => ({
                        header: key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase()),
                        accessorKey: key,
                        cell: ({ getValue }) => (
                            <span>{String(getValue() || "-")}</span>
                        ),
                    }))
                : [];

        // Insert Action column at 1st position
        baseColumns.splice(0, 0, {
            header: "Action",
            id: "action",
            cell: ({ row }) => (
                <button
                    onClick={() => openAssignModal(row.original)}
                    className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs hover:bg-orange-600 active:scale-95"
                >
                    Assign
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

    const onApplyFilters = () => {
        setPage(1); // reset to first page when applying
        fetchData();
    };

    const onReset = () => {
        setFilters(defaultFilters);
        setPage(1);
        setLimit(50);
    };

    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 min-h-screen w-full bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
                    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
                        {/* Header */}
                        <div className="mb-4">
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">View Report</h1>
                            <p className="text-sm text-slate-600">View All your Old lead report here</p>
                        </div>

                        {/* Filters Card */}
                        <div className="mb-6 rounded-2xl border bg-white shadow-sm">
                            <div className="p-4 sm:p-6 grid gap-4">
                                {/* First row: Username + Phone + Source */}
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">
                                            Username
                                        </label>
                                        <select
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            value={filters.username}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, username: e.target.value }))
                                            }
                                        >
                                            <option value="">Select Username</option>
                                            <option value="tele1">tele1</option>
                                            <option value="tele2">tele2</option>
                                            <option value="tlfarhat parveen">tlfarhat parveen</option>
                                            <option value="tlgargi ray">tlgargi ray</option>
                                            <option value="tlabhisek das">tlabhisek das</option>
                                            <option value="tlhiranmoy halder">tlhiranmoy halder</option>
                                            <option value="tldebosmita chatterjee">tldebosmita chatterjee</option>
                                            <option value="tlbiswarup">tlbiswarup</option>
                                            <option value="tlanish majumder">tlanish majumder</option>
                                            <option value="tlsudeshna dey">tlsudeshna dey</option>
                                            <option value="tlshital shah">tlshital shah</option>
                                            <option value="tlamrita">tlamrita</option>
                                            <option value="tlgourab banerjee">tlgourab banerjee</option>
                                            <option value="tlavishek saha">tlavishek saha</option>
                                            <option value="tlayan sarkar">tlayan sarkar</option>
                                            <option value="deojyoti singh">deojyoti singh</option>
                                            <option value="SHUVAM BHATTACHARYA">SHUVAM BHATTACHARYA</option>
                                            <option value="tlpriyanka pradhan">tlpriyanka pradhan</option>
                                            <option value="Jamaluddin Mondal">Jamaluddin Mondal</option>
                                            <option value="SAGAR HALDER">SAGAR HALDER</option>
                                            <option value="tlsantu naskar">tlsantu naskar</option>
                                            <option value="tlabhisek kumar">Abhisek kumar</option>
                                            <option value="tlrahul jha">tlrahul jha</option>
                                            <option value="Rupa Mondal">Rupa Mondal</option>
                                            <option value="Chiranjit Nandy">Chiranjit Nandy</option>
                                            <option value="Sayan Biswas">Sayan Biswas</option>
                                            <option value="Sujay Paul">Sujay Paul</option>
                                            <option value="Chris Das">Chris Das</option>
                                            <option value="mr_ankit doshi">Ankit doshi</option>
                                            <option value="Arpita Banerjee">Arpita Banerjee</option>
                                            <option value="tlsanjeev chowdhury">anjeev chowdhury</option>
                                            <option value="Salvina Talapatra">Salvina Talapatra</option>
                                            <option value="admin">admin</option>
                                            <option value="Aman_Gupta">Aman gupta</option>
                                            <option value="RohanSingh">Rohan singh</option>
                                            <option value="agent1">agent1</option>
                                            <option value="mr_debosmita chatterjee">Debosmita chatterjee</option>
                                            <option value="mr_abhishek das">Abhishek das</option>
                                            <option value="mr_hiranmoy halder">Hiranmoy halder</option>
                                            <option value="mr_arita mondal">Arita mondal</option>
                                            <option value="mr_abhisek kumar">Abhisek kumar</option>
                                            <option value="mr_rahul jha">Rahul jha</option>
                                            <option value="Bibekananda Chatterjee">Bibekananda Chatterjee</option>
                                            <option value="mr_sanjay mondal">Sanjay mondal</option>
                                            <option value="mr_himanshu kumar choudhary">Himanshu kumar choudhary</option>
                                            <option value="mr_kaustav roy chowdhury">Kaustav roy chowdhury</option>
                                            <option value="mr_suryakant sahoo">Suryakant sahoo</option>
                                            <option value="mr_kaushik sengupta">Kaushik sengupta</option>
                                            <option value="mr_swastik singh">Swastik singh</option>
                                            <option value="mr_dhiraj jha">Dhiraj jha</option>
                                            <option value="mr_santu naskar">Santu naskar</option>
                                            <option value="mr_sudehna dey">Sudehna dey</option>
                                            <option value="SATYABRATA BARIK">SATYABRATA BARIK</option>
                                            <option value="krishna">krishna</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">
                                            Disposition
                                        </label>
                                        <select
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            value={filters.disposition}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, disposition: e.target.value }))
                                            }
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
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">
                                            Project Name
                                        </label>
                                        <select
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            value={filters.pname}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, pname: e.target.value }))
                                            }
                                        >
                                            <option value="">Select Project</option>
                                            <option value="No Data">No Data</option>
                                            <option value="The levelz">The levelz</option>
                                            <option value="sunrise aura">sunrise aura</option>
                                            <option value="Laguna bay">Laguna bay</option>
                                            <option value="Utpalaa">Utpalaa</option>
                                            <option value="Eden Meghbalika">Eden Meghbalika</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">Phone</label>
                                        <input
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            placeholder="e.g. 9686108899"
                                            value={filters.phone}
                                            onChange={(e) => setFilters((f) => ({ ...f, phone: e.target.value }))}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">Source</label>
                                        <input
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            placeholder="e.g. 99acres, MagicBricks"
                                            value={filters.source}
                                            onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
                                        />
                                    </div>
                                </div>


                                {/* Second row: Location + Client Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">Location (plocation)</label>
                                        <input
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            placeholder="e.g. Southern Bypass"
                                            value={filters.location}
                                            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-slate-700">Client Name</label>
                                        <input
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            placeholder="e.g. Kunal"
                                            value={filters.name}
                                            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                                        />
                                    </div>


                                    <div className="flex flex-col order-1">
                                        <label className="text-sm font-medium text-slate-700">Start Date (enq_date)</label>
                                        <input
                                            type="date"
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            value={filters.start}
                                            onChange={(e) => setFilters((f) => ({ ...f, start: e.target.value }))}
                                        />
                                    </div>
                                    {/* End Date on the RIGHT */}
                                    <div className="flex flex-col order-2 sm:order-1">
                                        <label className="text-sm font-medium text-slate-700">End Date (enq_date)</label>
                                        <input
                                            type="date"
                                            className="mt-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                            value={filters.end}
                                            onChange={(e) => setFilters((f) => ({ ...f, end: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <button
                                        onClick={onApplyFilters}
                                        className="rounded-2xl bg-orange-500 text-white px-4 py-2 shadow hover:shadow-md active:scale-[.99]"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={onReset}
                                        className="rounded-2xl border px-4 py-2 hover:bg-slate-50"
                                    >
                                        Reset
                                    </button>

                                    {/* Page size */}
                                    <div className="ml-auto flex items-center gap-2">
                                        <label className="text-sm text-slate-600">Rows per page</label>
                                        <select
                                            className="rounded-xl border px-3 py-2"
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(Number(e.target.value));
                                                setPage(1);
                                            }}
                                        >
                                            {[25, 50, 100, 200].map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-400 p-2 sm:w-1/5  mb-4">
                            <h2 className="text-sm font-extrabold">Total Leads : {total}</h2>
                        </div>
                        {/* Table */}
                        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-700">
                                        {table.getHeaderGroups().map((hg) => (
                                            <tr key={hg.id}>
                                                {hg.headers.map((header) => (
                                                    <th key={header.id} className="px-4 py-3 text-left font-semibold border-b">
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                                                    <div className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
                                                </td>
                                            </tr>
                                        ) : rows.length === 0 ? (
                                            <tr>
                                                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">No data</td>
                                            </tr>
                                        ) : (
                                            table.getRowModel().rows.map((row) => (
                                                <tr key={row.id} className="even:bg-slate-50/40 hover:bg-slate-50">
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td key={cell.id} className="px-4 py-3 border-b">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="flex flex-wrap items-center gap-3 p-3">
                                <div className="text-sm text-slate-600">
                                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                    {" • "}
                                    <span className="text-slate-500">{total} total</span>
                                </div>
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        className={clsx(
                                            "rounded-xl border px-2 py-2 hover:bg-slate-50 disabled:opacity-50",
                                            page === 1 && "pointer-events-none"
                                        )}
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        aria-label="First page"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        className={clsx(
                                            "rounded-xl border px-2 py-2 hover:bg-slate-50 disabled:opacity-50",
                                            page === 1 && "pointer-events-none"
                                        )}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        className={clsx(
                                            "rounded-xl border px-2 py-2 hover:bg-slate-50 disabled:opacity-50",
                                            page >= totalPages && "pointer-events-none"
                                        )}
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page >= totalPages}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <button
                                        className={clsx(
                                            "rounded-xl border px-2 py-2 hover:bg-slate-50 disabled:opacity-50",
                                            page >= totalPages && "pointer-events-none"
                                        )}
                                        onClick={() => setPage(totalPages)}
                                        disabled={page >= totalPages}
                                        aria-label="Last page"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="mt-4 text-xs text-slate-500">
                            Tip: The username filter matches <span className="font-semibold">Username1</span> or <span className="font-semibold">Username2</span> on the server. Location & Client Name use partial, case-insensitive match.
                        </p>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold">
                                    Assign Lead {selectedLead?._id}
                                </h2>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {loadingTelecallers ? (
                                    <p className="text-sm text-slate-500">Loading telecallers...</p>
                                ) : telecallers.length === 0 ? (
                                    <p className="text-sm text-slate-500">No telecallers found.</p>
                                ) : (
                                    <ul className="divide-y">
                                        {telecallers.map((tc) => (
                                            <li
                                                key={tc.id}
                                                className="flex items-center justify-between py-2"
                                            >
                                                <span className="text-sm">{tc.name}</span>
                                                <button
                                                    onClick={() => handleAssign(tc.id, tc.name)}
                                                    className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs hover:bg-blue-600 active:scale-95"
                                                >
                                                    Assign
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}


                            </div>

                            {/* Remarks Input now below telecallers */}
                            <div className="p-6">
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
                            {/* Footer with Close Button */}
                            <div className="p-4 border-t flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
