'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileDown, X } from 'lucide-react';
import Image from 'next/image';
import { LEADS_ENDPOINT } from '@/config/api';

// Carousel image paths
const carouselImages = [
    '/assets/gb/1.jpg',
    '/assets/gb/2.jpg',
    '/assets/gb/3.jpg',
    '/assets/gb/4.jpg',
];

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

export default function DownloadBrochureButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [formData, setFormData] = useState<BrochureFormData>({
        name: '',
        email: '',
        phone: '',
        source: 'Godrej-Blue',
    });

    // Auto-change carousel images every 1 second
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(LEADS_ENDPOINT, formData);
            toast.success('Brochure request submitted successfully!');
            setFormData({ name: '', email: '', phone: '', source: 'Morya' });
            setIsOpen(false);

            const link = document.createElement('a');
            link.href = 'pdfs/GB-Brochure.pdf';
            link.download = 'Godrej-Blue-Brochure.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
        <>
            {/* Trigger Section */}
            <section id="brochure" className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-20 mb-10 pt-24 bg-yellow-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-3 px-10 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all w-fit"
                >
                    <FileDown className="w-7 h-7 md:w-9 md:h-9" />
                    <div className="flex flex-col leading-tight text-left">
                        <span className="text-[10px] md:text-xs font-medium text-white/80">Download</span>
                        <span className="text-sm md:text-base font-semibold">Brochure</span>
                    </div>
                </button>

                <div className="flex-1">
                    <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                        Inspired from the land that fosters fine luxury, Morya located in Tollygunge is
                        designed to match the world’s finest luxury apartments while remaining true to our
                        culture. A residential marvel that’s filled with the choicest lifestyle features is
                        one of the top condominiums in South Kolkata.
                    </p>
                </div>
            </section>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black p-1.5 rounded-full z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Carousel Section (75%) */}
                        <div className="relative flex-[3] w-full">
                            <div className="relative w-full h-72 sm:h-96">
                                <Image
                                    src={carouselImages[currentIndex]}
                                    alt={`Brochure Image ${currentIndex + 1}`}
                                    fill
                                    className="object-cover transition-all duration-500"
                                />
                            </div>

                            {/* Overlay & Caption */}
                            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
                            <div className="absolute bottom-4 left-5 text-white text-base sm:text-lg font-semibold z-10">
                                Preview: Morya Brochure
                            </div>
                        </div>

                        {/* Form Section (25%) */}
                        <div className="flex-[1] overflow-y-auto p-4  bg-white">
                            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-800">
                                Download the Full Brochure
                            </h2>
                            <p className="text-sm text-gray-600 mb-1 text-center">
                                Fill in your details to access the complete PDF.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-1 max-w-md mx-auto">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number (10 Digit)"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                />

                                <button
                                    type="submit"
                                    className="mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-all text-sm"
                                >
                                    Receive Full Brochure
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
}
