'use client';

import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';

import Image from 'next/image';
import { X, Phone, Menu } from 'lucide-react';
import Loader from '@/components/loader';

import 'react-toastify/dist/ReactToastify.css';
import { LEADS_ENDPOINT } from '@/config/api';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../../public/assets/logo-transparent.png'

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
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState<BrochureFormData>({ name: '', email: '', phone: '', source: source.source });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true)
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

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav className="w-full shadow-md py-4 fixed bg-white z-50 top-0">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Left: Logo */}
                <div>
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        <Image src={Logo} alt="Logo" width={60} height={60} />
                    </Link>
                </div>

                {/* Center: Navigation Links */}
                <div className="hidden md:flex gap-6 text-gray-800 font-medium text-sm lg:text-base">
                    {/* {['About', 'Overview', 'Brochure', 'Gallery', 'FloorPlans'].map((item) => ( */}
                    {['Overview', 'Brochure', 'Gallery'].map((item) => (
                        <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="hover:text-pink-600 transition cursor-pointer">
                            {item.replace('FloorPlans', 'Floor Plans')}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Right: Phone + Button */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-800 font-semibold">
                        <Phone className="w-5 h-5" />
                        <a href="tel:+919830947144" className="hover:underline text-sm lg:text-lg">+91 98309 47144</a>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#de3163] text-white text-xs lg:text-lg px-5 py-2 rounded-md font-semibold hover:bg-[#c42553] transition"
                    >
                        Enquire Now
                    </button>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white px-4 py-3 shadow-sm flex flex-col gap-3">
                    {['About', 'Overview', 'Brochure', 'Gallery', 'FloorPlans'].map((item) => (
                        <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-left hover:text-pink-600 transition">
                            {item.replace('FloorPlans', 'Floor Plans')}
                        </button>
                    ))}
                    <a href="tel:+919830947144" className="text-sm font-semibold text-gray-800 mt-2">+91 98309 47144</a>
                    <button
                        onClick={() => { setIsOpen(true); setMobileMenuOpen(false); }}
                        className="bg-[#de3163] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c42553] transition cursor-pointer"
                    >
                        Enquire Now
                    </button>
                </div>
            )}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
                        {/* Close Icon */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
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
                                placeholder="Your phone number (10 Digit)"
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                            <button
                                type="submit"
                                className="bg-[#de3163] hover:bg-[#c42553] text-white py-2 rounded-md transition-all cursor-pointer"
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

            <ToastContainer position="top-center" autoClose={3000} />
        </nav>
    );
}
