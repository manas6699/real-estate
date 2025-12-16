'use client';

import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Commented out to prevent build errors in some environments. Ensure this is imported in your _app.tsx or layout.tsx
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import {
    EDIT_LEAD_FORM,
    GET_ALL_TELECALLERS_API,
    REASSIGN_NEW_LEADS,
    GET_ALL_PROJECTS,
    GET_LEAD_DETAILS
} from "@/config/api";
import preferredConfigs from "@/options/PreferedConfig";
import BudgetInput from "@/components/TelecallerComponents/BudgetInput";
import { whoami } from '@/utils/whoami';

// --- Imported Sub-Components ---
import TransferLeadModal from "@/components/TelecallerComponents/LeadEdit/TransferLeadModal";
import ProjectSelector from "@/components/TelecallerComponents/LeadEdit/ProjectSelector";
import ScheduleSection from "@/components/TelecallerComponents/LeadEdit/ScheduleSection";
import { ArrowLeft, Lock } from "lucide-react";

// --- 🟢 STATUS MAPPING CONFIGURATION ---
const STATUS_MAPPING: Record<string, { disposition: string; category: string }> = {
    "1st Try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "2nd try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "3rd try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "4th Try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "5th Try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "6th Try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "7th Try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "8th Try": { "disposition": "IN PROGRESS", "category": "Retry" },
    "9th Try": { "disposition": "Unqualified", "category": "Junk" },
    "Call Back": { "disposition": "FOLLOW UP", "category": "Cold" },
    "Follow up for feedback": { "disposition": "FOLLOW UP", "category": "Cold" },
    "Interested in the project": { "disposition": "FOLLOW UP", "category": "Cold" },
    "No Answer/Number is busy": { "disposition": "FOLLOW UP", "category": "Retry" },
    "SV Fixed": { "disposition": "FOLLOW UP", "category": "Warm" },
    "Already Booked somewhere": { "disposition": "Unqualified", "category": "Junk" },
    "Bad Data": { "disposition": "Unqualified", "category": "Junk" },
    "Booked with us": { "disposition": "Unqualified", "category": "Junk" },
    "Complaint Call": { "disposition": "Unqualified", "category": "Junk" },
    "Channel Partner": { "disposition": "Unqualified", "category": "Junk" },
    "Customer Stopped Responding": { "disposition": "Unqualified", "category": "Junk" },
    "Duplicate": { "disposition": "Unqualified", "category": "Junk" },
    "Flat Size Mismatch": { "disposition": "Unqualified", "category": "Junk" },
    "Flat Owner for Resale/Rental": { "disposition": "Unqualified", "category": "Junk" },
    "Requirement Mismatch": { "disposition": "Unqualified", "category": "Junk" },
    "Floor Mismatch": { "disposition": "Unqualified", "category": "Junk" },
    "For Upcoming Project": { "disposition": "Unqualified", "category": "Junk" },
    "General/Casual Enquiry": { "disposition": "Unqualified", "category": "Junk" },
    "Location Mismatch": { "disposition": "Unqualified", "category": "Junk" },
    "Non Contactable": { "disposition": "Unqualified", "category": "Junk" },
    "Not Interested": { "disposition": "Unqualified", "category": "Junk" },
    "No Requirement": { "disposition": "Unqualified", "category": "Junk" },
    "Out of Budget/Budget Mismatch": { "disposition": "Unqualified", "category": "Junk" },
    "Plan Postponed": { "disposition": "Unqualified", "category": "Junk" },
    "Possession Time Mismatch": { "disposition": "Unqualified", "category": "Junk" },
    "Test": { "disposition": "Unqualified", "category": "Junk" },
    "Will Call us back": { "disposition": "Unqualified", "category": "Cold" },
    "Wrong Number": { "disposition": "Unqualified", "category": "Junk" },
    "Interested in the Project": { "disposition": "SV Push", "category": "Cold" },
    "Call Back Needed": { "disposition": "SV Push", "category": "Cold" },
    "SV Appointed Fixed": { "disposition": "SV Push", "category": "Warm" },
    "Upcoming Project": { "disposition": "SV Push", "category": "Cold" },
    "Site visit Done": { "disposition": "SV Push", "category": "Hot" }
};

type leadIdType = { leadId: string };
type Project = { _id: string; projectName: string };

const furnishedOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
const propertyStatusOptions = ["Under Construction", "Ready to Move"];

const LeadEditForm = ({ leadId }: leadIdType) => {
    const router = useRouter();

    // --- State Management ---
    const [formData, setFormData] = useState({
        alternate_phone: "",
        client_budget: "",
        interested_project: "",
        lead_status: "",       // Maps to Disposition Group (e.g., IN PROGRESS)
        sub_disposition: "",   // Maps to specific Status (e.g., 1st Try)
        lead_type: "",         // Maps to Category (e.g., Retry)
        location: "",
        preferred_floor: "",
        preferred_configuration: "",
        furnished_status: "",
        property_status: "",
        comments: "",
        schedule_date: "",
        schedule_time: "",
    });

    const [projects, setProjects] = useState<Project[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telecallers, setTelecallers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Transfer Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transferRemarks, setTransferRemarks] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [hasSaved, setHasSaved] = useState(false);

    // --- 🟢 Helper: Extract Unique Dispositions (Groups) ---
    const dispositionGroups = useMemo(() => {
        const groups = new Set(Object.values(STATUS_MAPPING).map(d => d.disposition));
        return Array.from(groups);
    }, []);

    // --- 🟢 Helper: Get Sub-Dispositions for a Group ---
    const getSubDispositionsForGroup = useCallback((group: string) => {
        return Object.keys(STATUS_MAPPING).filter(key => STATUS_MAPPING[key].disposition === group);
    }, []);

    // --- API Helpers ---
    const fetchLeadDetails = useCallback(async () => {
        try {
            const res = await axios.get(GET_LEAD_DETAILS(leadId));
            if (res.data?.lead) {
                const lead = res.data.lead;

                // Smartly determine current state values from existing data
                const currentSubDisposition = lead.subdisposition || lead.sub_disposition || "";

                // If the lead already has a valid sub-disposition in our mapping, use it to set parent/type
                let currentDisposition = lead.lead_status || "";
                let currentLeadType = lead.lead_type || "";

                if (currentSubDisposition && STATUS_MAPPING[currentSubDisposition]) {
                    const mapping = STATUS_MAPPING[currentSubDisposition];
                    currentDisposition = mapping.disposition;
                    currentLeadType = mapping.category;
                }

                setFormData(prev => ({
                    ...prev,
                    alternate_phone: lead.alternate_phone || "",
                    client_budget: lead.client_budget || "",
                    interested_project: lead.interested_project || "",
                    location: lead.location || "",
                    preferred_floor: lead.preferred_floor || "",
                    preferred_configuration: lead.preferred_configuration || "",
                    furnished_status: lead.furnished_status || "",
                    property_status: lead.property_status || "",
                    comments: lead.comments || "",
                    schedule_date: lead.schedule_date || "",
                    schedule_time: lead.schedule_time || "",
                    // Set derived values
                    lead_status: currentDisposition,
                    sub_disposition: currentSubDisposition,
                    lead_type: currentLeadType
                }));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) { toast.error("Failed to load lead details"); }
    }, [leadId]);

    // --- Effects ---
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setCurrentUserId(JSON.parse(userData)._id);
        fetchProjects();
        fetchLeadDetails();
    }, [fetchLeadDetails, leadId]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get(GET_ALL_PROJECTS);
            if (res.data.success) setProjects(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchTelecallers = async () => {
        try {
            const res = await axios.get(GET_ALL_TELECALLERS_API);
            if (res.data.success) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setTelecallers(res.data.data.filter((tc: any) => tc.id !== currentUserId));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) { toast.error("Failed to load telecallers"); }
    };

    // --- Field Handlers ---
    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 🟢 Handler: Disposition Change (Parent Dropdown)
    const handleDispositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDisposition = e.target.value;
        setFormData(prev => ({
            ...prev,
            lead_status: selectedDisposition,
            sub_disposition: "", // Reset child selection
            lead_type: ""       // Reset lead type
        }));
    };

    // 🟢 Handler: Sub Disposition Change (Child Dropdown)
    const handleSubDispositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSub = e.target.value;
        const mapping = STATUS_MAPPING[selectedSub];

        // Automatically set the Lead Type based on JSON mapping
        const autoLeadType = mapping ? mapping.category : "";

        setFormData(prev => ({
            ...prev,
            sub_disposition: selectedSub,
            lead_type: autoLeadType
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTransfer = async (telecaller: any) => {
        if (!transferRemarks.trim()) return toast.error("Please enter remarks");

        const history = `This Lead has been reassigned to ${telecaller.name} by ${whoami()} with remarks : ${transferRemarks} and with comments: ${formData.comments}`;

        try {
            const res = await axios.post(REASSIGN_NEW_LEADS, {
                lead_id: leadId,
                assignee_id: telecaller.id,
                assignee_name: telecaller.name,
                remarks: transferRemarks,
                history_entry: history
            });
            if (res.data.success) {
                toast.success("Lead transferred!");
                setIsModalOpen(false);
                setTransferRemarks("");
            } else {
                toast.error(res.data.message);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) { toast.error("Transfer failed"); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.schedule_date && !formData.schedule_time) {
            setError("If Schedule Date is selected, Schedule Time is mandatory.");
            setLoading(false);
            return;
        }
        setError("");

        let finalComments = formData.comments;
        if (formData.schedule_date && formData.schedule_time) {
            const dt = new Date(`${formData.schedule_date}T${formData.schedule_time}`);
            finalComments = `${formData.comments}\n\n📅 Call scheduled for ${dt.toLocaleString()}`;
        }

        try {
            const payload = {
                ...formData,
                comments: finalComments,
                assignee_id: currentUserId,
                subdisposition: formData.sub_disposition
            };
            await axios.put(EDIT_LEAD_FORM(leadId), payload);
            toast.success("Lead updated successfully!");

            setHasSaved(true);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
            toast.error(`Error updating lead! , ${message}`);
        } finally {
            setLoading(false);
        }
    };

    // Calculate options for the Sub Disposition dropdown based on current parent selection
    const availableSubDispositions = useMemo(() => {
        return getSubDispositionsForGroup(formData.lead_status);
    }, [formData.lead_status, getSubDispositionsForGroup]);

    return (
        <>
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                        title="Go Back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">
                        ✏️ Dispose Lead with Details
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Basic Fields */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Alternate Phone</label>
                        <input
                            type="number"
                            value={formData.alternate_phone}
                            onChange={(e) => e.target.value.length <= 10 && updateField("alternate_phone", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Client Budget</label>
                        <BudgetInput value={formData.client_budget} onChange={(val: string) => updateField("client_budget", val)} />
                    </div>

                    <ProjectSelector
                        projects={projects}
                        selectedProject={formData.interested_project}
                        onProjectSelect={(val) => updateField("interested_project", val)}
                        refreshProjects={fetchProjects}
                    />

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Location</label>
                        <input type="text" value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Preferred Floor</label>
                        <input type="text" value={formData.preferred_floor} onChange={(e) => updateField("preferred_floor", e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Preferred Configuration</label>
                        <select value={formData.preferred_configuration} onChange={(e) => updateField("preferred_configuration", e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>Select Config</option>
                            {preferredConfigs.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Furnished Status</label>
                        <select value={formData.furnished_status} onChange={(e) => updateField("furnished_status", e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>Select Status</option>
                            {furnishedOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Property Status</label>
                        <select value={formData.property_status} onChange={(e) => updateField("property_status", e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>Select Status</option>
                            {propertyStatusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* 🟢 DISPOSITION SECTION 🟢 */}
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2 text-sm font-bold text-orange-800 border-b border-orange-200 pb-2 mb-2">
                            Disposition Details
                        </div>

                        {/* 1. Disposition (Group) */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Disposition</label>
                            <select
                                value={formData.lead_status}
                                onChange={handleDispositionChange}
                                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                                required
                            >
                                <option value="" disabled>Select Disposition</option>
                                {dispositionGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Sub Disposition (Specific Reason) */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Sub Disposition</label>
                            <select
                                value={formData.sub_disposition}
                                onChange={handleSubDispositionChange}
                                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                                disabled={!formData.lead_status} // Disable if no parent selected
                            >
                                <option value="" disabled>Select Sub Disposition</option>
                                {availableSubDispositions.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Lead Type (Auto-Calculated) */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Lead Type (Auto)</label>
                            <div className={`w-full px-3 py-2 border rounded-lg font-medium flex items-center gap-2
                                ${formData.lead_type === 'Hot' ? 'bg-red-100 text-red-700 border-red-200' :
                                    formData.lead_type === 'Warm' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                        formData.lead_type === 'Cold' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-gray-100 text-gray-500 border-gray-200'
                                }`}>
                                {formData.lead_type || "Waiting for selection..."}
                            </div>
                        </div>
                    </div>

                    <ScheduleSection
                        scheduleDate={formData.schedule_date}
                        scheduleTime={formData.schedule_time}
                        setScheduleDate={(val) => updateField("schedule_date", val)}
                        setScheduleTime={(val) => updateField("schedule_time", val)}
                        error={error}
                    />

                    {/* Comments */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-600">🐻‍❄️ Comments</label>
                        <textarea
                            cols={50}
                            rows={10}
                            value={formData.comments}
                            onChange={(e) => updateField("comments", e.target.value)}
                            placeholder="Enter comments ..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-2 flex flex-col md:flex-row gap-3 mt-4">
                        <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition">
                            {loading ? <div className="flex justify-center items-center"><Loader color="white" /><span className="ml-2">Submitting...</span></div> : "Save Lead"}
                        </button>

                        <button
                            type="button"
                            disabled={!hasSaved}
                            onClick={() => { fetchTelecallers(); setIsModalOpen(true); }}
                            className={`flex-1 py-2 px-4 flex justify-center items-center gap-2 font-medium rounded-lg transition
                                ${hasSaved
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            title={!hasSaved ? "You must save the lead details first" : "Transfer Lead"}
                        >
                            {!hasSaved && <Lock size={16} />}
                            Transfer Lead
                        </button>
                    </div>
                </form>
            </div>

            <TransferLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                telecallers={telecallers}
                onTransfer={handleTransfer}
                remarks={transferRemarks}
                setRemarks={setTransferRemarks}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default LeadEditForm;