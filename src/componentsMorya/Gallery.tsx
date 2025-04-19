"use client";

import React, { useState } from "react";
import Image from "next/image";

import { FileDown, X } from 'lucide-react';


const localImages = [
    '/assets/morya/1.jpg',
    '/assets/morya/2.jpg',
    '/assets/morya/3.jpg',
    '/assets/morya/4.jpg',
    '/assets/morya/5.jpg',
    '/assets/morya/6.jpg',
    '/assets/morya/7.jpg',
    '/assets/morya/8.jpg',
    '/assets/morya/9.jpg'
];


const floorplans = [
    '/assets/floorplanmorya/1a.jpg',
    '/assets/floorplanmorya/2a.jpg',
    '/assets/floorplanmorya/3a.jpg',
    '/assets/floorplanmorya/4a.jpg',
    '/assets/floorplanmorya/5a.jpg',
    '/assets/floorplanmorya/6a.jpg',
    '/assets/floorplanmorya/7a.jpg',
    '/assets/floorplanmorya/8a.jpg',
    '/assets/floorplanmorya/9a.jpg'
]


const Gallery = () => {

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
        <>
            <section className="w-full px-4 py-10">
                <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Gallery</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {localImages.map((src, index) => (
                        <div key={index} className="relative w-full aspect-video overflow-hidden rounded-xl shadow-md">
                            <Image
                                src={src}
                                alt={`Gallery ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={index < 3} // optional: prioritize loading first 3 images
                            />
                        </div>
                    ))}
                </div>
                <div className="flex-1 mt-14">
                    <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed text-center">
                        Morya has been thoughtfully curated to create an ideal escape where contemporary meets family-friendly.
                        It is home to 384 families with world class amenities and great connectivity
                    </p>
                </div>
            </section>

            <section className="w-full px-4 py-10 bg-gray-100">
                <h2 className="text-6xl font-bold text-center mb-8 text-gray-800">Floor Plans</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-5 gap-8">
                    {floorplans.map((src, index) => (
                        <div key={index} className="relative w-full aspect-video overflow-hidden rounded-xl shadow-md">
                            <Image
                                src={src}
                                alt={`Gallery ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={index < 3} // optional: prioritize loading first 3 images
                            />
                        </div>
                    ))}
                </div>
            </section>

            <div>
                {/* Main Section */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-20 mb-10">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center gap-3 px-10 py-2
                    cursor-pointer bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all w-fit"
                    >
                        <FileDown className="w-7 h-7 md:w-9 md:h-9" />
                        <div className="flex flex-col leading-tight text-left">
                            <span className="text-[10px] md:text-xs font-medium text-white/80">Download</span>
                            <span className="text-sm md:text-base font-semibold">Floor Plans</span>
                        </div>
                    </button>

                    <div className="flex-1">
                        <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                            Morya offers you to discover spacious layouts designed with purpose and perfection.
                            The floor plans at Town Square blend intelligent design with indulgent comfort, offering
                            expansive living spaces tailored to elevate every moment.
                            Choose a layout that matches your lifestyle — where every square foot speaks luxury.
                        </p>
                    </div>
                </div>

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
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Download Floor Plans</h2>
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
            </div>

        </>
    );
};

export default Gallery;
