"use client";

import React, { useState } from "react";

import { FileDown, X } from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";
import { LEADS_ENDPOINT } from "@/config/api";



const Gallery = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source:'Primus Ganges'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await axios.post<{ message: string; lead: unknown }>(
                LEADS_ENDPOINT,
                formData
            );

            toast.success('You Floor Plan is ready to download!');
            setFormData({ name: '', email: '', phone: '', source: 'Primus Ganges' });
            setIsOpen(false);

            // Trigger the download
            const link = document.createElement('a');
            link.href = 'pdfs/Primus Ganges Floor Plans.pdf'; // Path in the public folder
            link.download = 'Primus Ganges Floor Plans.pdf'; // Suggested filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    'Failed to submit. Please try again.';
                toast.error(message);
            } else {
                toast.error('An unknown error occurred.');
            }
            console.error('Submission error:', error);
        }
    };
    return (
        <>
           

            <div>
                {/* Main Section */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-20 mb-10 bg-yellow-50">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center gap-3 px-10 py-2
                    cursor-pointer bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all w-fit"
                    >
                        <FileDown className="w-7 h-7 md:w-9 md:h-9" />
                        <div className="flex flex-col leading-tight text-left">
                            <span className="text-[10px] md:text-xs font-medium text-white/80">Download</span>
                            <span className="text-sm md:text-base font-semibold">Floor Plans</span>
                        </div>
                    </button>

                    <div className="flex-1">
                        <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                            Primus Ganges offers you to discover spacious layouts designed with purpose and perfection.
                            The floor plans at Primus Ganges blend intelligent design with indulgent comfort, offering
                            expansive living spaces tailored to elevate every moment.
                            Choose a layout that matches your lifestyle — where every square foot speaks luxury.
                        </p>
                    </div>
                </div>

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 md:p-8 shadow-lg relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Modal Content */}
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Download Floor Plans</h2>
                            <p className="text-sm text-gray-600 mb-6">Fill in your details to proceed.</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number (10Digits)"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />

                                <button
                                    type="submit"
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-all cursor-pointer"
                                >
                                    Receive Floor Plans
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default Gallery;
