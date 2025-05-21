'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '@/components/loader';
import { LEADS_ENDPOINT } from '@/config/api';
import Image from 'next/image';

type PopupFormProps = {
    source: string;
    formHeading: string;
    logoImage: string;
};

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

export default function PopupForm({ source , formHeading , logoImage }: PopupFormProps) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BrochureFormData>({
        name: '',
        email: '',
        phone: '',
        source: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
            setFormData((prev) => ({ ...prev, source }));
        }, 3000); // 3-second delay

        return () => clearTimeout(timer);
    }, [source]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(LEADS_ENDPOINT, formData);
            toast.success('Our Team will reach out to you very soon!');
            setVisible(false); // hide popup only after successful submission
        } catch (error) {
            toast.error('Submission failed. Try again.');
            console.error('Form error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4"
            >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto -mt-12 border-4 border-white shadow-md">
                    <Image
                        src={logoImage}
                        alt="Form Icon"
                        width={10}
                        height={10}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-xl font-semibold text-center">{formHeading}</h2>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="border px-4 py-2 rounded-md"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="border px-4 py-2 rounded-md"
                />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (10 digits)"
                    pattern="[0-9]{10}"
                    required
                    className="border px-4 py-2 rounded-md"
                />

                <button
                    type="submit"
                    className="bg-blue-900 text-white py-2 rounded-md hover:bg-pink-700 transition"
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
    );
}
