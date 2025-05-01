'use client';

import { useState } from 'react';
import { X } from 'lucide-react'; // Optional: Use lucide-react or any icon lib
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Phone } from 'lucide-react'; // Optional: Use lucide-react or any icon lib
import Image from 'next/image';
import Logo from '../../public/assets/logo.png'

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

type sourceType = {
    source : string;
}

export default function Navbar(source: sourceType) {

    const [isOpen, setIsOpen] = useState(false);
        const [formData, setFormData] = useState<BrochureFormData>({ name: '', email: '', phone: '' , source:source.source });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await axios.post<{ message: string; lead: unknown }>(
                'https://split-wise-clone-085p.onrender.com/api/mmr/leads',
                formData
            );

            toast.success('Our Team will reach out to you very soon!');
            setFormData({ name: '', email: '', phone: '', source: source.source });
            setIsOpen(false);

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
        <nav className="w-full bg-white shadow-md py-4">
            <div className="container mx-auto px-4 flex flex-row lg:flex-row items-center justify-between">

                {/* Left: Logo */}
                <div className="mb-2 lg:mb-0">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        <Image src={Logo} alt="Logo" width={60} height={60} />
                    </Link>
                </div>

                {/* Center: Phone */}
                <div className="md:flex lg:flex hidden items-center gap-2 text-gray-800 font-semibold mb-2 lg:mb-0">
                    <Phone className="w-5 h-5" />
                    <a href="tel:+91 98309 47144" className="hover:underline text-sm lg:text-2xl">+91 98309 47144</a>
                </div>

                {/* Right: Enquire Now button */}
                <div>
                    {/* <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#de3163] text-white text-xs lg:text-lg px-5 py-2 rounded-md font-semibold hover:bg-[#c42553] transition"
                    >
                        Enquire Now
                    </button> */}

                    {/* Modal */}
                    {isOpen && (
                        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
                            <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
                                {/* Close Icon */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h2 className="text-xl font-bold mb-2 text-gray-800">Get in Touch</h2>
                                <p className="text-sm text-gray-600 mb-5">We’ll get back to you shortly!</p>

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
                                        placeholder="Your phone number(10 Digit)"
                                        required
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                                    />

                                    <button
                                        type="submit"
                                        className="bg-[#de3163] hover:bg-[#c42553] text-white py-2 rounded-md transition-all"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Toast Messages */}
                    <ToastContainer position="top-center" autoClose={3000} />
                </div>
            </div>
        </nav>
    );
}
