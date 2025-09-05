"use client";
import React, { useState } from "react";
import axios from "axios";
import { POST_A_LOCATION } from "@/config/api";

const AddLocation: React.FC = () => {
    const [locationName, setLocationName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(POST_A_LOCATION, {
                locationName,
            });
            setMessage(res.data.message);
            setLocationName("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Error adding location");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Location</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter location name"
                    className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition text-sm"
                >
                    Add Location
                </button>
            </form>
            {message && (
                <p className="mt-3 text-sm text-center text-gray-600">{message}</p>
            )}
        </div>
    );
};

export default AddLocation;
