'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/AdminComponents/Navbar';
import Sidebar from '@/components/AdminComponents/Sidebar';
import { GET_ALL_SCHEDULES, GET_MULTIPLE_ASSIGNS } from "@/config/api";
import OverdueTable from "@/components/AdminComponents/OverdueTable";

type Schedule = {
    lead_id: string;
    assign_id: string;
    start?: string;
    end?: string;
};

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
    history: HistoryEntry[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        upload_type: string,
        upload_by: string,
        status: string;
        projectSource: string;
        comments: string;
        location: string;
        alternate_phone: string;
        client_budget: string;
        furnished_status: string;
        interested_project: string;
        lead_status: string;
        lead_type: string;
        preferred_configuration: string;
        preferred_floor: string;
        property_status: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
};


// ✅ API response wrapper
type ApiResponse<T> = {
    success: boolean;
    data: T;
};

const OverdueLeadDetailsPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [assigns, setAssigns] = useState<Assign[]>([]);

    const fetchSchedules = async () => {
        try {
            setLoading(true);

            // ✅ Step 1: get all schedules
            const res = await axios.get<ApiResponse<Schedule[]>>(GET_ALL_SCHEDULES);
            if (!res.data.success) throw new Error("❌ Failed to fetch schedules");

            const schedulesData = Array.isArray(res.data.data) ? res.data.data : [];
            setSchedules(schedulesData);

            // ✅ Step 2: find overdue lead_ids
            const now = new Date();
            const overdueLeadIds: string[] = schedulesData
                .filter((s) => s.end && new Date(s.end) < now)
                .map((s) => s.assign_id);

            if (overdueLeadIds.length > 0) {
                // ✅ Step 3: fetch overdue lead details
                const leadRes = await axios.post<ApiResponse<Assign[]>>(
                    GET_MULTIPLE_ASSIGNS,
                    {
                        assign_ids: overdueLeadIds, // ✅ matches your payload
                    }
                );

                if (leadRes.data.success) {
                    // ✅ Step 4: reverse and save
                    setAssigns([...leadRes.data.data].reverse());
                }
            } else {
                setAssigns([]);
            }
        } catch (error) {
            console.error("Error fetching schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch on mount
    useEffect(() => {
        fetchSchedules();
    }, []);

    return (
        <div>
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 overflow-x-hidden">
                <Sidebar />
                {/* Main content takes remaining space */}
                <div className="flex flex-col flex-1 gap-4 lg:ml-64 p-6">
                    <Navbar />
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mt-6">
                        <a href="/admin/Dashboard">
                            <ArrowLeft className="cursor-pointer" />
                        </a>
                        <p className="flex items-center text-gray-600 font-extrabold">
                            Admin Dashboard <ChevronRight className="mx-2" /> View Overdue Leads Details
                        </p>
                    </div>

                    {/* Loader */}
                    {loading && (
                        <div className="text-center text-gray-600 mt-4">
                            ⏳ Fetching overdue leads...
                        </div>
                    )}

                    {/* AssignedTable */}
                    {!loading && assigns.length > 0 && (
                        // <OverdueTable data={assigns} />
                        <OverdueTable data={assigns} />
                    )}

                    {!loading && assigns.length === 0 && (
                        <div className="text-center text-gray-500 mt-6">
                            ✅ No overdue leads found
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
};

export default OverdueLeadDetailsPage;
