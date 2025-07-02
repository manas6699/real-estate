'use client';

import axios from 'axios';
import Link from 'next/link';
import { X } from 'lucide-react'; 
import { useState } from 'react';

import Image from 'next/image';
import Loader from '@/components/loader';
import 'react-toastify/dist/ReactToastify.css';
import { LEADS_ENDPOINT } from '@/config/api';
import { Facebook, Instagram } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../../../public/assets/logo-transparent.png'

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

type sourceType = {
    source: string;
}

export default function Navbar(source: sourceType) {

    const [isOpen, setIsOpen] = useState(false);
    const [loading , setLoading] = useState(false);
    const [formData, setFormData] = useState<BrochureFormData>({ name: '', email: '', phone: '', source: source.source });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await axios.post<{ message: string; lead: unknown }>(
                LEADS_ENDPOINT,
                formData
            );

            toast.success('Our Team will reach out to you very soon!');
            setFormData({ name: '', email: '', phone: '', source: source.source });
            setIsOpen(false);
            setLoading(false);

        } catch (error: unknown) {
            setLoading(false);
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
        <nav className="w-full bg-white shadow-sm py-4">
            <div className="container mx-auto px-4 flex flex-row lg:flex-row items-center justify-between">

                {/* Left: Logo */}
                <div className="mb-2 lg:mb-0">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        <Image src={Logo} alt="Logo" width={60} height={60} />
                    </Link>
                </div>

                {/* Center: logo */}
                <div className="md:flex lg:flex hidden items-center gap-4 text-gray-800 font-semibold mb-2 lg:mb-0">
                    <a
                        href="https://www.facebook.com/profile.php?id=61573050645360"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors duration-300"
                    >
                        <Facebook className="w-5 h-5 lg:w-6 lg:h-6" />
                    </a>
                    <a
                        href="https://www.instagram.com/mmr_realty_lpp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition-colors duration-300"
                    >
                        <Instagram className="w-5 h-5 lg:w-6 lg:h-6" />
                    </a>

                    <a
                        href="https://wa.me/919830947144"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-500 transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 lg:w-6 lg:h-6 fill-current text-gray-800 hover:text-green-500"
                            viewBox="0 0 24 24"
                        >
                            <path d="M16.7 13.3c-.3-.1-1.7-.9-2-1s-.5-.1-.7.2c-.2.3-.8 1-1 1.1s-.4.2-.7.1c-.3-.1-1.3-.5-2.4-1.6s-1.6-2.1-1.7-2.4c-.1-.3 0-.5.1-.7.1-.1.9-1 1.1-1.3.1-.2.2-.4.2-.6s-.1-.4-.2-.6c-.1-.1-.7-1.7-1-2.3s-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.6 1.2 3.2 1.4 3.4.2.3 2.3 3.6 5.6 4.8.8.3 1.4.5 1.8.6.8.3 1.5.3 2 .2.6-.1 1.7-.7 2-1.3.3-.6.3-1.1.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                        </svg>
                    </a>


                </div>

                {/* Right: Enquire Now button */}
                <div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#de3163] text-white text-xs lg:text-lg px-5 py-2 rounded-md font-semibold hover:bg-[#c42553] transition"
                    >
                        Enquire Now
                    </button>

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
                        </div>
                    )}

                    {/* Toast Messages */}
                    <ToastContainer position="top-center" autoClose={3000} />
                </div>
            </div>
        </nav>
    );
}
