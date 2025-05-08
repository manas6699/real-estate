'use client';
import { useState } from 'react';
import {  X } from 'lucide-react';

import { Phone, Download, MessageCircle } from 'lucide-react'; 


export default function HeroSection() {

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        setIsOpen(false); // Close modal after submission
    };
    return (
        <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/assets/town-square/g8.jpg")' }}>
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <h1 className="text-white text-4xl md:text-7xl text-center px-4">
                    <span className='font-extrabold'>
                        TOWN
                    SQUARE
                    </span>
                </h1>
            </div>

            {/* Sticky Buttons Bottom Right */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                {/* WhatsApp */}
                <a
                    href="https://wa.me/9830947144"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
                    title="Chat on WhatsApp"
                >
                    <MessageCircle size={24} />
                </a>

                {/* Download Brochure */}
                <a
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                    title="Download Brochure"
                >
                    <Download size={24} />
                </a>

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
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Download Brochure</h2>
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
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />

                                <button
                                    type="submit"
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-all cursor-pointer"
                                >
                                    Submit & Download
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Contact */}
                <a
                    href="tel:9830947144"
                    className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition"
                    title="Call Us"
                >
                    <Phone size={24} />
                </a>
            </div>
        </section>
    );
}
