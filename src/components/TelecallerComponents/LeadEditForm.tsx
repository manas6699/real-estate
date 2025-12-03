'use client';

import axios from "axios";
import React, { useEffect, useState , useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader";
import {
    EDIT_LEAD_FORM,
    GET_ALL_TELECALLERS_API,
    REASSIGN_NEW_LEADS,
    GET_ALL_PROJECTS,
    GET_LEAD_DETAILS
} from "@/config/api";
import leadStatuses from "@/options/Leadstatus";
import preferredConfigs from "@/options/PreferedConfig";
import BudgetInput from "@/components/TelecallerComponents/BudgetInput";
import { whoami } from '@/utils/whoami';
import { Dispositions } from "@/app/data/dispositions";

// --- Imported Sub-Components ---
import TransferLeadModal from "@/components/TelecallerComponents/LeadEdit/TransferLeadModal";
import ProjectSelector from "@/components/TelecallerComponents/LeadEdit/ProjectSelector";
import ScheduleSection from "@/components/TelecallerComponents/LeadEdit/ScheduleSection";


type leadIdType = { leadId: string };
type Project = { _id: string; projectName: string };

const furnishedOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
const propertyStatusOptions = ["Under Construction", "Ready to Move"];


const LeadEditForm = ({ leadId }: leadIdType) => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        alternate_phone: "",
        client_budget: "",
        interested_project: "",
        lead_status: "",
        lead_type: "",
        location: "",
        preferred_floor: "",
        preferred_configuration: "",
        furnished_status: "",
        property_status: "",
        comments: "",
        schedule_date: "",
        schedule_time: "",
        sub_disposition: ""
    });

    const [subDispositionOptions, setSubDispositionOptions] = useState<string[]>(leadStatuses);
    const [projects, setProjects] = useState<Project[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telecallers, setTelecallers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Transfer Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transferRemarks, setTransferRemarks] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");



    // --- API Helpers ---
    const fetchLeadDetails = useCallback(async () => {
        try {
            const res = await axios.get(GET_LEAD_DETAILS(leadId));
            if (res.data?.lead) {
                const lead = res.data.lead;
                setFormData(prev => ({
                    ...prev,
                    alternate_phone: lead.alternate_phone || "",
                    client_budget: lead.client_budget || "",
                    interested_project: lead.interested_project || "",
                    lead_status: lead.lead_status || "",
                    lead_type: lead.lead_type || "",
                    location: lead.location || "",
                    preferred_floor: lead.preferred_floor || "",
                    preferred_configuration: lead.preferred_configuration || "",
                    furnished_status: lead.furnished_status || "",
                    property_status: lead.property_status || "",
                    comments: lead.comments || "",
                    schedule_date: lead.schedule_date || "",
                    schedule_time: lead.schedule_time || "",
                    sub_disposition: lead.subdisposition || lead.sub_disposition || "",
                }));
                // Check if existing sub_disposition is not in options, add it
                const detectedSub = lead.subdisposition || lead.sub_disposition;
                if (detectedSub && !leadStatuses.includes(detectedSub)) {
                    setSubDispositionOptions(prev => [...prev, detectedSub]);
                }
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) { toast.error("Failed to load lead details"); }
    },[leadId])

    // --- Effects ---
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setCurrentUserId(JSON.parse(userData)._id);
        fetchProjects();
        fetchLeadDetails();
    }, [fetchLeadDetails, leadId]);

    // Handle Sub-disposition logic
    useEffect(() => {
        if (!formData.sub_disposition) return;
        setSubDispositionOptions((prev) =>
            prev.includes(formData.sub_disposition) ? prev : [...prev, formData.sub_disposition]
        );
    }, [formData.sub_disposition]);

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

    const handleLeadStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        const type = Dispositions[status] || "";
        setFormData(prev => ({ ...prev, lead_status: status, lead_type: type }));
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
            const payload = { ...formData, comments: finalComments, assignee_id: currentUserId, subdisposition: formData.sub_disposition };
            await axios.put(EDIT_LEAD_FORM(leadId), payload);
            toast.success("Lead updated successfully!");
            // Reset logic here if needed, or redirect
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message :
                typeof err === "string" ? err :
                JSON.stringify(err);
            toast.error(`Error updating lead! , ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">✏️ Dispose Lead with Details</h2>

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

                    {/* Complex Project Selector Component */}
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

                    {/* Status Section */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Disposition Status</label>
                        <select value={formData.lead_status} onChange={handleLeadStatusChange} className="w-full px-3 py-2 border rounded-lg bg-orange-100 focus:ring-2 focus:ring-orange-500 outline-none" required>
                            <option value="" disabled>Select Disposition</option>
                            {subDispositionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Lead Type</label>
                        <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 font-medium">
                            {formData.lead_type || "Select Disposition Status"}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Sub Disposition</label>
                        <select value={formData.sub_disposition} onChange={(e) => updateField("sub_disposition", e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="" disabled>Select Sub Disposition</option>
                            {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Schedule Section Component */}
                    <ScheduleSection
                        scheduleDate={formData.schedule_date}
                        scheduleTime={formData.schedule_time}
                        setScheduleDate={(val) => updateField("schedule_date", val)}
                        setScheduleTime={(val) => updateField("schedule_time", val)}
                        error={error}
                    />

                    {/* Comments */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-600">Comments</label>
                        <textarea value={formData.comments} onChange={(e) => updateField("comments", e.target.value)} placeholder="Enter comments" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-2 flex flex-col md:flex-row gap-3 mt-4">
                        <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition">
                            {loading ? <div className="flex justify-center items-center"><Loader color="white" /><span className="ml-2">Submitting...</span></div> : "Save Lead"}
                        </button>
                        <button type="button" onClick={() => { fetchTelecallers(); setIsModalOpen(true); }} className="flex-1 py-2 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
                            Transfer Lead
                        </button>
                    </div>
                </form>
            </div>

            {/* Transfer Modal Component */}
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