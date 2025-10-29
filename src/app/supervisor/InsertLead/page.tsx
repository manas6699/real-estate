'use client';

import axios from 'axios';

import Loader from '@/components/loader';
import React, { useEffect, useState } from 'react';
import { whoami } from '@/utils/whoami';
import { toast, ToastContainer } from 'react-toastify';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/SupervisorComponents/Sidebar'
import AddProject from '@/components/AdminComponents/AddProject';
import AddLocation from '@/components/AdminComponents/AddLocation';
import { GET_ALL_PROJECTS, GET_ALL_SOURCES, LEADS_ENDPOINT_Manual, POST_A_SOURCE } from '@/config/api';

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
    projectSource: string;
    upload_type: string;
    upload_by: string | null
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
    const uploader_name = whoami()
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
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [newSource, setNewSource] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "projectSource") {
            if (e.target.value === "Others") {
                setShowOtherInput(true);
            } else {
                setShowOtherInput(false);
            }
        }
    };

    // Fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(GET_ALL_PROJECTS);
                setProjects(res.data.data || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("Failed to load projects");
            }
        };
        fetchProjects();
    }, []);

    // Fetch lead sources
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
        fetchSources();
    }, []);

    const handleAddSource = async () => {
        if (!newSource.trim()) {
            toast.error("Please enter a source name");
            return;
        }

        try {
            const res = await axios.post(POST_A_SOURCE, {
                sourceName: newSource.trim(),
            });

            const addedSource = res.data?.data?.sourceName || newSource.trim();

            toast.success("New source added successfully");

            setNewSource('');
            setShowOtherInput(false);

            // Auto-select the newly added source
            setFormData((prev) => ({
                ...prev,
                projectSource: addedSource,
            }));

            await fetchSources(); // Refresh dropdown
        } catch (error) {
            console.error("Error adding source:", error);
            toast.error("Failed to add source");
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(LEADS_ENDPOINT_Manual, formData);
            toast.success('Lead posted successfully');
            setFormData({ name: '', email: '', phone: '', source: "", projectSource: "", upload_by: "" , upload_type: ""});
            setShowOtherInput(false);
            setLoading(false);
        } catch (error: unknown) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Failed to submit. Please try again.';
                toast.error(message);
            } else {
                toast.error('An unknown error occurred.');
            }
            console.error('Submission error:', error);
        }
    };

    return (
        <div>
            <main className="flex flex-col w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1 gap-4 lg:ml-64 p-6">
                    <div className="flex flex-col flex-1 gap-4">
                        <Navbar />
                        <h1 className='text-2xl font-extrabold ml-8'>
                            Insert Lead Manually
                        </h1>
                        <form
                            onSubmit={handleSubmit}
                            className=" p-4 sm:p-6 w-full max-w-sm flex flex-col gap-4"
                        >
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Client's Name"
                                required
                                className="bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none focus:ring-0 px-1 py-2 text-sm"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                                className="bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none focus:ring-0 px-1 py-2 text-sm"
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone number (10 Digit)"
                                pattern="[0-9]{10}"
                                required
                                className="bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none focus:ring-0 px-1 py-2 text-sm"
                            />
                            {/* Project Name (Dropdown) */}
                            <select
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                required
                                className="bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none px-1 py-2 text-sm"
                            >
                                <option value="">Select Project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project.projectName}>
                                        {project.projectName}
                                    </option>
                                ))}
                            </select>
                            {/* Lead Source (Dropdown) */}
                            <select
                                name="projectSource"
                                value={formData.projectSource}
                                onChange={handleChange}
                                required
                                className="bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none px-1 py-2 text-sm"
                            >
                                <option value="">Select Lead Source</option>
                                {sources.map((src) => (
                                    <option key={src._id} value={src.sourceName}>
                                        {src.sourceName}
                                    </option>
                                ))}
                                <option value="Others">➕ Add Source</option>
                            </select>

                            {showOtherInput && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSource}
                                        onChange={(e) => setNewSource(e.target.value)}
                                        placeholder="Enter new source"
                                        className="flex-1 bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none px-1 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSource}
                                        className="bg-green-500 text-white px-3 rounded-md text-sm hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="bg-orange-500 text-white text-sm cursor-pointer hover:bg-[#c42553] py-2 rounded-md transition-all"
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <Loader color="white" />
                                    </div>
                                ) : (
                                    <>Submit</>
                                )}
                            </button>
                        </form>
                        <div className="flex justify-start">
                            <AddProject />
                            <AddLocation />
                        </div>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            closeOnClick
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default InsertLeadPage;
