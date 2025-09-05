"use client";
import React, { useState } from "react";
import axios from "axios";
import { POST_A_PROJECT } from "@/config/api";

const AddProject: React.FC = () => {
    const [projectName, setProjectName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(POST_A_PROJECT, {
                projectName,
            });
            setMessage(res.data.message);
            setProjectName("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Error adding project");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Project</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-sm focus:ring-blue-400"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white text-sm py-2 rounded-xl hover:bg-blue-600 transition"
                >
                    Add Project
                </button>
            </form>
            {message && (
                <p className="mt-3 text-sm text-center text-gray-600">{message}</p>
            )}
        </div>
    );
};

export default AddProject;
