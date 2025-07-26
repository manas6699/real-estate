'use client';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'

import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import Loader from '@/components/loader';
import { LEADS_ENDPOINT } from '@/config/api';
import React, { useState } from 'react';

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

const InsertLeadPage = () => {

    const [formData, setFormData] = useState<BrochureFormData>({
        name: '',
        email: '',
        phone: '',
        source: '', 
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(LEADS_ENDPOINT, formData);
            toast.success('Lead posted successfully');
            setFormData({ name: '', email: '', phone: '', source: "" });
            setLoading(false); // <--- Reset loading here on success
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
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="p-4 text-2xl font-semibold  mb-2">
                    Insert Lead Manually
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
                        <input
                            type="text"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            placeholder="Lead Source"
                            required
                            className="bg-transparent border-0 border-b border-gray-400 focus:border-pink-500 focus:outline-none focus:ring-0 px-1 py-2 text-sm"
                        />
                          

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
                     <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
                </div>
            </main>
        </div>
    )
}

export default InsertLeadPage