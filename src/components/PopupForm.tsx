'use client';

import axios from 'axios';
import Image from 'next/image';
import { Phone } from 'lucide-react';

import { toast } from 'react-toastify';
import Loader from '@/components/loader';
import { LEADS_ENDPOINT } from '@/config/api';
import React, { useEffect, useState, useRef } from 'react';

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

export default function PopupForm({ source, formHeading, logoImage }: PopupFormProps) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userClosed, setUserClosed] = useState(false); // track if user manually closed
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [formData, setFormData] = useState<BrochureFormData>({
        name: '',
        email: '',
        phone: '',
        source: '',
    });

    // Initial 10-second delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
            setFormData((prev) => ({ ...prev, source }));
        }, 10000);

        return () => clearTimeout(timer);
    }, [source]);

    // If user closes manually, show every 8s again
    useEffect(() => {
        if (userClosed && !visible) {
            intervalRef.current = setInterval(() => {
                setVisible(true);
                setUserClosed(false); // reset after showing again
            }, 8000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [userClosed, visible]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(LEADS_ENDPOINT, formData);
            if (typeof window !== "undefined") {
                window.gtag("event", "conversion", {
                    send_to: "AW-17339408048/jQQnCNCY__AaELC9icxA"
                })
            }
            toast.success('Our Team will reach out to you very soon!');
            setVisible(false); // hide on success
        } catch (error) {
            toast.error('Submission failed. Try again.');
            console.error('Form error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setVisible(false);
        setUserClosed(true);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4"
            >
                {/* Cross Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
                    aria-label="Close form"
                >
                    &times;
                </button>

                {/* Logo */}
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto -mt-14 border-4 bg-white border-cyan-200 p-2 shadow-lg">
                    <Image
                        src={logoImage}
                        alt="Form Icon"
                        width={800}
                        height={400}
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
                            <Loader color="white" />
                        </div>
                    ) : (
                        <>Get Details</>
                    )}
                </button>
                <div className="flex items-center gap-2 text-center justify-center ">
                    <Phone className="w-5 h-5" />
                    <p className="text-center font-black text-xl">9830947144</p>
                </div>
            </form>
        </div>
    );
}
