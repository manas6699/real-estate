'use client';

import axios from 'axios';
import Loader from '@/components/loader';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '@/components/AdminComponents/Navbar';
import Sidebar from '@/components/AdminComponents/Sidebar';
import { whoami } from '@/utils/whoami';
import AddLocation from '@/components/AdminComponents/AddLocation';
import {
    GET_ALL_PROJECTS,
    GET_ALL_SOURCES,
    LEADS_ENDPOINT_Manual,
    POST_A_SOURCE,
    POST_A_PROJECT
} from '@/config/api';

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
    projectSource: string;
    upload_type: string;
    upload_by: string | null;
};

type Project = {
    _id: string;
    projectName: string;
};

type Source = {
    _id: string;
    sourceName: string;
};

const InsertLeadPage = () => {
    const uploader_name = whoami();
    const [formData, setFormData] = useState<BrochureFormData>({
        name: '',
        email: '',
        phone: '',
        source: '',
        projectSource: "",
        upload_type: "single",
        upload_by: uploader_name,
    });

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [showProjectInput, setShowProjectInput] = useState(false);
    const [newProject, setNewProject] = useState('');
    const [projectLoading, setProjectLoading] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [newSource, setNewSource] = useState('');
    const [sourceLoading, setSourceLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "source") {
            setShowProjectInput(e.target.value === "Others");
        }

        if (e.target.name === "projectSource") {
            setShowOtherInput(e.target.value === "Others");
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await axios.get(GET_ALL_PROJECTS);
            setProjects(res.data.data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to load projects");
        }
    };

    const fetchSources = async () => {
        try {
            const res = await axios.get(GET_ALL_SOURCES);
            setSources(res.data.data || []);
        } catch (error) {
            console.error("Error fetching sources:", error);
            toast.error("Failed to load lead sources");
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchSources();
    }, []);

    const handleAddProject = async () => {
        if (!newProject.trim()) {
            toast.error("Please enter a project name");
            return;
        }
        setProjectLoading(true);
        try {
            const res = await axios.post(POST_A_PROJECT, { projectName: newProject.trim() });
            const addedProjectName = res.data?.data?.projectName || newProject.trim();
            toast.success("New project added successfully");
            setNewProject('');
            setShowProjectInput(false);
            setFormData((prev) => ({ ...prev, source: addedProjectName }));
            await fetchProjects();
        } catch (error) {
            console.error("Error adding project:", error);
            toast.error("Failed to add project");
        } finally {
            setProjectLoading(false);
        }
    };

    const handleAddSource = async () => {
        if (!newSource.trim()) {
            toast.error("Please enter a source name");
            return;
        }
        setSourceLoading(true);
        try {
            const res = await axios.post(POST_A_SOURCE, { sourceName: newSource.trim() });
            const addedSource = res.data?.data?.sourceName || newSource.trim();
            toast.success("New source added successfully");
            setNewSource('');
            setShowOtherInput(false);
            setFormData((prev) => ({ ...prev, projectSource: addedSource }));
            await fetchSources();
        } catch (error) {
            console.error("Error adding source:", error);
            toast.error("Failed to add source");
        } finally {
            setSourceLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.source === "Others" || formData.projectSource === "Others") {
            toast.error("Please add and select the valid Project or Source.");
            return;
        }
        try {
            setLoading(true);
            await axios.post(LEADS_ENDPOINT_Manual, formData);
            toast.success('Lead posted successfully');
            setFormData({
                name: '',
                email: '',
                phone: '',
                source: "",
                projectSource: "",
                upload_type: "single",
                upload_by: uploader_name,
            });
            setShowOtherInput(false);
            setShowProjectInput(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to submit.');
            } else {
                toast.error('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Reusable styles
    const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 bg-white text-gray-700 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400";
    const labelClasses = "block text-sm font-semibold text-gray-600 mb-1.5 ml-1";

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:ml-64 relative overflow-y-auto">
                <div className="sticky top-0 z-40">
                    <Navbar />
                </div>

                <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">

                    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

                        {/* Form Card */}
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                                <h2 className="text-2xl font-bold text-white">New Lead Entry</h2>
                                <p className="text-indigo-100 text-sm mt-1">Manually insert lead details into the system.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">

                                {/* Client Name */}
                                <div>
                                    <label className={labelClasses}>Client Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        required
                                        disabled={loading}
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={labelClasses}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        disabled={loading}
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className={labelClasses}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        pattern="[0-9]{10}"
                                        required
                                        disabled={loading}
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Project Selection */}
                                <div>
                                    <label className={labelClasses}>Interested Project</label>
                                    <div className="relative">
                                        <select
                                            name="source"
                                            value={formData.source}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            <option value="">Select a Project...</option>
                                            {projects.map((project) => (
                                                <option key={project._id} value={project.projectName}>
                                                    {project.projectName}
                                                </option>
                                            ))}
                                            <option value="Others" className="font-semibold text-indigo-600">+ Add New Project</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Add Project Input */}
                                {showProjectInput && (
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-fade-in-down">
                                        <label className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2 block">Create New Project</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newProject}
                                                onChange={(e) => setNewProject(e.target.value)}
                                                placeholder="Enter project name"
                                                disabled={projectLoading}
                                                className="flex-1 px-3 py-2 rounded-md border border-indigo-200 focus:border-indigo-500 focus:outline-none text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddProject}
                                                disabled={projectLoading}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-70 transition-colors flex items-center justify-center min-w-[80px]"
                                            >
                                                {projectLoading ? <Loader color="white" size={15} /> : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Lead Source Selection */}
                                <div>
                                    <label className={labelClasses}>Lead Source</label>
                                    <div className="relative">
                                        <select
                                            name="projectSource"
                                            value={formData.projectSource}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            <option value="">Select Source...</option>
                                            {sources.map((src) => (
                                                <option key={src._id} value={src.sourceName}>
                                                    {src.sourceName}
                                                </option>
                                            ))}
                                            <option value="Others" className="font-semibold text-green-600">+ Add New Source</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Add Source Input */}
                                {showOtherInput && (
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 animate-fade-in-down">
                                        <label className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2 block">Create New Source</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newSource}
                                                onChange={(e) => setNewSource(e.target.value)}
                                                placeholder="Enter source name"
                                                disabled={sourceLoading}
                                                className="flex-1 px-3 py-2 rounded-md border border-green-200 focus:border-green-500 focus:outline-none text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSource}
                                                disabled={sourceLoading}
                                                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-70 transition-colors flex items-center justify-center min-w-[80px]"
                                            >
                                                {sourceLoading ? <Loader color="white" size={15} /> : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading || showProjectInput || showOtherInput}
                                        className={`w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed transform-none" : ""
                                            }`}
                                    >
                                        {loading ? (
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader color="white" />
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            "Submit Lead"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Side Actions (Locations etc) */}
                        <div className="w-full max-w-lg lg:w-auto flex flex-col gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                                <h3 className="text-gray-700 font-semibold mb-3">Quick Actions</h3>
                                <AddLocation />
                                {/* You can add more quick action buttons here later */}
                            </div>
                        </div>

                    </div>

                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        toastClassName="rounded-xl shadow-lg"
                    />
                </div>
            </main>
        </div>
    );
};

export default InsertLeadPage;