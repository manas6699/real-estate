'use client';

import { useState } from 'react';
import { X } from 'lucide-react'; // Optional: Use lucide-react or any icon lib

import Link from 'next/link';
import { Phone } from 'lucide-react'; // Optional: Use lucide-react or any icon lib
import Image from 'next/image';
import Logo from '../../public/assets/logo.png'
export default function Navbar() {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle enquiry logic (API call etc.)
        console.log(formData);
        setOpen(false); // close modal after submission
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
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-[#de3163] text-white text-xs lg:text-lg px-5 py-2 rounded-md font-semibold hover:bg-[#c42553] transition"
                    >
                        Enquire Now
                    </button>

                    {/* Modal */}
                    {open && (
                        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
                            <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
                                {/* Close Icon */}
                                <button
                                    onClick={() => setOpen(false)}
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
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your Message"
                                        rows={3}
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
                </div>
            </div>
        </nav>
    );
}
