'use client';

import axios from 'axios';
import { toast } from 'react-toastify';

import Loader from '@/components/loader';
import { LEADS_ENDPOINT } from '@/config/api';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Ban, Clock } from 'lucide-react';


type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

type FormProps = {
    source: string;
};

export default function Form({ source }: FormProps) {
    const [formData, setFormData] = useState<BrochureFormData>({
        name: '',
        email: '',
        phone: '',
        source: '', // Empty initially
    });

    const [loading, setLoading] = useState(false);

    // 🔥 useEffect to set source only on client
    useEffect(() => {
        setFormData((prev) => ({ ...prev, source }));
    }, [source]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(LEADS_ENDPOINT, formData);
            toast.success('Our Team will reach out to you very soon!');
            setFormData({ name: '', email: '', phone: '', source });
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
        <>
            <div className="flex justify-center items-start mt-6 sm:mt-10 px-2 sm:px-4">

                <form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 shadow-lg rounded-xl p-4 sm:p-6 w-full max-w-sm flex flex-col gap-4"
                >
                    <h2 className="text-2xl font-semibold text-center mb-2 text-white">Contact Us</h2>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="bg-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-sm"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="bg-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-sm"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number (10 Digit)"
                        pattern="[0-9]{10}"
                        required
                        className="bg-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-sm"
                    />

                    <button
                        type="submit"
                        className="bg-[#de3163] cursor-pointer hover:bg-[#c42553] text-white py-2 rounded-md transition-all"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <Loader color='white' />
                            </div>
                        ) : (
                            <>Submit</>
                        )}
                    </button>
                </form>
            </div>
            <div className="mt-14 text-center font-extrabold space-y-2">
                <p className="text-xl font-extrabold sm:text-base text-white">
                    ✨ Our expert team will reach out to you within 24 hours.
                </p>
                


                <div className="flex justify-center gap-4 flex-wrap mt-4 text-xs sm:text-sm">
                    {/* Privacy */}
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-1 rounded-full shadow-md">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-white" />
                        100% Privacy Guaranteed
                    </span>

                    {/* No Spam */}
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-1 rounded-full shadow-md">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500"></span>
                        </div>
                        <Ban className="w-4 h-4 text-white" />
                        No Spam Policy
                    </span>

                    {/* Instant Delivery */}
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-1 rounded-full shadow-md">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                        </div>
                        <Clock className="w-4 h-4 text-white" />
                        Instant Brochure Delivery
                    </span>
                </div>

            </div>
        </>

    );
}
