import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { POST_A_PROJECT } from "@/config/api";

type Project = { _id: string; projectName: string };

type Props = {
    projects: Project[];
    selectedProject: string;
    onProjectSelect: (projectName: string) => void;
    refreshProjects: () => void;
};

const ProjectSelector = ({ projects, selectedProject, onProjectSelect, refreshProjects }: Props) => {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherProjectName, setOtherProjectName] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "others") {
            setShowOtherInput(true);
            onProjectSelect("");
        } else {
            setShowOtherInput(false);
            onProjectSelect(value);
        }
    };

    const handleAddNew = async () => {
        if (!otherProjectName.trim()) return toast.error("Enter project name");
        setAdding(true);
        try {
            const res = await axios.post(POST_A_PROJECT, { projectName: otherProjectName.trim() });
            if (res.data.success) {
                toast.success("Project added!");
                onProjectSelect(otherProjectName.trim());
                setShowOtherInput(false);
                setOtherProjectName("");
                refreshProjects();
            }
        } catch (err) {
            console.error(err);
            toast.error("Error adding project");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Interested Project</label>
            <select
                value={showOtherInput ? "others" : selectedProject}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
                <option value="" disabled>Select project</option>
                {projects.map((p) => (
                    <option key={p._id} value={p.projectName}>{p.projectName}</option>
                ))}
                <option value="others">Others (Add new project)</option>
            </select>

            {showOtherInput && (
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
                        onClick={handleAddNew}
                        disabled={adding}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {adding ? "Adding..." : "Add"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectSelector;