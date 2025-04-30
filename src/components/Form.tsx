'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
            await axios.post('https://split-wise-clone-085p.onrender.com/api/mmr/leads', formData);
            toast.success('Our Team will reach out to you very soon!');
            setFormData({ name: '', email: '', phone: '', source });
        } catch (error: unknown) {
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number (10 Digit)"
                required
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
                type="submit"
                className="bg-[#de3163] hover:bg-[#c42553] text-white py-2 rounded-md transition-all"
            >
                Submit
            </button>
        </form>
    );
}
