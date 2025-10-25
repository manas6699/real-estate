'use client';

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader";
import {
    EDIT_LEAD_FORM,
    GET_ALL_TELECALLERS_API,
    REASSIGN_NEW_LEADS,
    GET_ALL_PROJECTS,
    POST_A_PROJECT,
    GET_LEAD_DETAILS
} from "@/config/api";
import leadStatuses from "@/options/Leadstatus";
import preferredConfigs from "@/options/PreferedConfig";
import BudgetInput from "@/components/TelecallerComponents/BudgetInput";
import { whoami } from '@/utils/whoami';
import { Dispositions } from "@/app/data/dispositions";

type leadIdType = { leadId: string };
type Telecaller = {
    id: string;
    name: string;
    role: string;
    online: boolean;
};

type Project = {
    _id: string;
    projectName: string;
};

const transferStatus = ["Agent Switch", "Cold", "Warm", "Refer", "Hot"];

const furnishedOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
const propertyStatusOptions = ["Under Construction", "Ready to Move"];

const LeadEditForm = ({ leadId }: leadIdType) => {
    const [alternate_phone, setAlternatePhone] = useState("");
    const [client_budget, setClientBudget] = useState("");
    const [interested_project, setInterestedProject] = useState("");
    const [lead_status, setLeadStatus] = useState("");
    const [location, setLocation] = useState("");
    const [preferred_floor, setPreferredFloor] = useState("");
    const [preferred_configuration, setPreferredConfig] = useState("");
    const [furnished_status, setFurnishedStatus] = useState("");
    const [property_status, setPropertyStatus] = useState("");
    const [comments, setComments] = useState("");
    const [schedule_date, setScheduleDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [schedule_time, setScheduleTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [remarks, setRemarks] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [showOtherProjectInput, setShowOtherProjectInput] = useState(false);
    const [otherProjectName, setOtherProjectName] = useState("");
    const [addingProject, setAddingProject] = useState(false);
    // Add this with other state hooks
    const [lead_type, setLeadType] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                setCurrentUserId(userData._id);
            } catch (err) {
                console.error("Error parsing user from localStorage", err);
            }
        }

        // Fetch projects list
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchLeadDetails = async () => {
            try {
                const res = await axios.get(GET_LEAD_DETAILS(leadId));
                if (res.data?.lead) {
                    const lead = res.data.lead;
                    setAlternatePhone(lead.alternate_phone || "");
                    setClientBudget(lead.client_budget || "");
                    setInterestedProject(lead.interested_project || "");
                    setLeadStatus(lead.lead_status || "");
                    setLeadType(lead.lead_type || "");
                    setLocation(lead.location || "");
                    setPreferredFloor(lead.preferred_floor || "");
                    setPreferredConfig(lead.preferred_configuration || "");
                    setFurnishedStatus(lead.furnished_status || "");
                    setPropertyStatus(lead.property_status || "");
                    setComments(lead.comments || "");
                    setScheduleDate(lead.schedule_date || "");
                    setScheduleTime(lead.schedule_time || "");
                }
            } catch (err) {
                console.error("Error fetching lead details:", err);
                toast.error("Failed to load lead details");
            }
        };

        fetchLeadDetails();
        fetchProjects();
    }, [leadId]);


    const fetchProjects = async () => {
        try {
            const res = await axios.get(GET_ALL_PROJECTS);
            if (res.data.success) {
                setProjects(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
            toast.error("Failed to load projects");
        }
    };

    const fetchTelecallers = async () => {
        try {
            const res = await axios.get(GET_ALL_TELECALLERS_API);
            if (res.data.success) {
                const filtered = res.data.data.filter(
                    (tc: Telecaller) => tc.id !== currentUserId
                );
                setTelecallers(filtered);
            }
        } catch (err) {
            console.error("Error fetching telecallers:", err);
            toast.error("Failed to load telecallers");
        }
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "others") {
            setShowOtherProjectInput(true);
            setInterestedProject("");
        } else {
            setShowOtherProjectInput(false);
            setInterestedProject(value);
            setOtherProjectName("");
        }
    };

    const addNewProject = async () => {
        if (!otherProjectName.trim()) {
            toast.error("Please enter a project name");
            return;
        }

        setAddingProject(true);
        try {
            const res = await axios.post(POST_A_PROJECT, {
                projectName: otherProjectName.trim()
            });

            if (res.data.success) {
                toast.success("Project added successfully!");
                setInterestedProject(otherProjectName.trim());
                setShowOtherProjectInput(false);
                setOtherProjectName("");

                // Refresh the projects list
                fetchProjects();
            } else {
                toast.error(res.data.message || "Failed to add project");
            }
        } catch (err) {
            console.error("Error adding project:", err);
            toast.error("Error adding project!");
        } finally {
            setAddingProject(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userDataString = localStorage.getItem("user");
        let assignee_id = "";

        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                assignee_id = userData._id || "";
            } catch (err) {
                console.error("Error parsing token from localStorage", err);
            }
        }
        if (schedule_date && !schedule_time) {
            setError("If Schedule Date is selected, Schedule Time is mandatory.");
            setLoading(false)
            return;
        }
        setError("");

        const formData = {
            alternate_phone,
            client_budget,
            interested_project: showOtherProjectInput ? otherProjectName : interested_project,
            lead_status,
            lead_type,
            location,
            preferred_floor,
            preferred_configuration,
            furnished_status,
            property_status,
            comments,
            schedule_date,
            schedule_time,
            assignee_id,
        };

        try {
            const response = await axios.put(EDIT_LEAD_FORM(leadId), formData);
            console.log(response.data);
            toast.success("Lead updated successfully!");
            setAlternatePhone("");
            setClientBudget("");
            setInterestedProject("");
            setLeadStatus("");
            setLocation("");
            setPreferredFloor("");
            setPreferredConfig("");
            setFurnishedStatus("");
            setPropertyStatus("");
            setComments("");
            setScheduleDate("");
            setScheduleTime("");
            setShowOtherProjectInput(false);
            setOtherProjectName("");
            setLeadType("");
        } catch (error) {
            console.error("Error updating lead:", error);
            toast.error("Error updating lead!");
        } finally {
            setLoading(false);
        }
    };

    const openTransferModal = () => {
        fetchTelecallers();
        setIsModalOpen(true);
    };

    const handleTransferLead = async (telecaller: Telecaller) => {
        if (!remarks.trim()) {
            toast.error("Please enter remarks");
            return;
        }

        const history = `This Lead has been reassigned to ${telecaller.name} by ${whoami()} with remarks : ${remarks}`
        const payload = {
            lead_id: leadId,
            assignee_id: telecaller.id,
            assignee_name: telecaller.name,
            remarks,
            history_entry: history
        };

        try {
            const res = await axios.post(REASSIGN_NEW_LEADS, payload);

            if (res.data.success) {
                toast.success("Lead transferred successfully!");
                setIsModalOpen(false);
                setRemarks("");
            } else {
                toast.error(res.data.message || "Failed to transfer lead");
            }
        } catch (err) {
            console.error("Error transferring lead:", err);
            toast.error("Error transferring lead!");
        }
    };

    const handleLeadStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = e.target.value;
        setLeadStatus(selectedStatus);

        // Automatically determine and set lead_type
        const determinedType = Dispositions[selectedStatus] || ""; // Fallback to "" if not found
        setLeadType(determinedType);
    };

    return (
        <>
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    ✏️ Dispose Lead with Details
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {/* Alternate Phone Number */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Alternate Phone Number
                        </label>
                        <input
                            type="number"
                            value={alternate_phone}
                            onChange={(e) =>
                                e.target.value.length <= 10 && setAlternatePhone(e.target.value)
                            }
                            placeholder="Enter alternate phone number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Client Budget */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Client Budget
                        </label>
                        <BudgetInput value={client_budget} onChange={setClientBudget} />
                    </div>

                    {/* Interested Project */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Interested Project
                        </label>
                        <select
                            value={showOtherProjectInput ? "others" : interested_project}
                            onChange={handleProjectChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="" disabled>
                                Select project
                            </option>
                            {projects.map((project) => (
                                <option key={project._id} value={project.projectName}>
                                    {project.projectName}
                                </option>
                            ))}
                            <option value="others">Others (Add new project)</option>
                        </select>

                        {showOtherProjectInput && (
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    value={otherProjectName}
                                    onChange={(e) => setOtherProjectName(e.target.value)}
                                    placeholder="Enter project name"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addNewProject}
                                    disabled={addingProject}
                                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {addingProject ? "Adding..." : "Add"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Preferred Floor */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Preferred Floor
                        </label>
                        <input
                            type="text"
                            value={preferred_floor}
                            onChange={(e) => setPreferredFloor(e.target.value)}
                            placeholder="Enter preferred floor"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Preferred Config */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Preferred Configuration
                        </label>
                        <select
                            value={preferred_configuration}
                            onChange={(e) => setPreferredConfig(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="" disabled>
                                Select preferred configuration
                            </option>
                            {preferredConfigs.map((config) => (
                                <option key={config} value={config}>
                                    {config}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Furnished */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Furnished Status
                        </label>
                        <select
                            value={furnished_status}
                            onChange={(e) => setFurnishedStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="" disabled>
                                Select furnished status
                            </option>
                            {furnishedOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Property Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Property Status
                        </label>
                        <select
                            value={property_status}
                            onChange={(e) => setPropertyStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="" disabled>
                                Select property status
                            </option>
                            {propertyStatusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lead Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Disposition Status
                        </label>
                        <select
                            value={lead_status}
                            onChange={handleLeadStatusChange}
                            className="w-full px-3 py-2 border rounded-lg bg-orange-100 focus:ring-2 focus:ring-orange-500 outline-none"
                            required
                        >
                            <option value="" disabled>
                                Select Disposition status
                            </option>
                            {leadStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Lead Type */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Lead Type
                        </label>
                        {/* Display the determined lead_type value directly */}
                        <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 font-medium">
                            {lead_type || "Select Disposition Status"}
                        </div>
                        {/* Keep a hidden select or input if necessary for form serialization 
        but since you use formData object in handleSubmit, the state is enough.
        You can remove the whole <select> element and just keep the visual <div>.
    */}
                    </div>

                    {/* Schedule Date */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Schedule Call Date
                        </label>
                        <input
                            type="date"
                            value={schedule_date}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Schedule Time */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Schedule Call Time
                        </label>
                        <input
                            type="time"

                            value={schedule_time}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${schedule_date && !schedule_time ? "border-red-500" : ""
                                }`}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Comments */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-600">
                            Comments
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Enter any additional comments"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex flex-col md:flex-row gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition"
                        >
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <Loader color="white" />
                                    <span className="ml-2">Submitting...</span>
                                </div>
                            ) : (
                                "Save Lead"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={openTransferModal}
                            className="flex-1 py-2 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
                        >
                            Transfer Lead
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-fadeIn">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            🔄 Transfer Lead
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Transfer Reason
                            </label>
                            <select
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            >
                                <option value="" disabled>
                                    Select reason
                                </option>
                                {transferStatus.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="max-h-60 overflow-y-auto border-t pt-3">
                            {telecallers.length > 0 ? (
                                telecallers.map((tc) => (
                                    <div
                                        key={tc.id}
                                        className="flex justify-between items-center border-b py-2"
                                    >
                                        <span className="font-medium">{tc.name}</span>
                                        <button
                                            onClick={() => handleTransferLead(tc)}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                        >
                                            Transfer
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No telecallers available</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default LeadEditForm;