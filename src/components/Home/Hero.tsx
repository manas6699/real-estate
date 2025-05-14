'use client';
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
    return (
        <section
            className="relative w-full h-screen bg-cover bg-center flex items-center justify-center px-4 bg-black/50"
            style={{ backgroundImage: "url('assets/morya/morya-gallery-1.webp')" }}
        >
            <div className="absolute inset-0 bg-black/25 z-0"></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-4xl w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                    The #1 Site for Real Estate You Trust
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-8">
                    Discover premium flats, villas, and commercial properties for rent or sale.
                </p>

                {/* Search Box */}
                <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-stretch gap-4 w-full max-w-5xl mx-auto">
                    {/* Location Filter */}
                    <input
                        type="text"
                        placeholder="Location"
                        className="flex-1 px-5 py-3 text-black rounded-full border border-gray-300 outline-none text-sm"
                    />

                    {/* Custom Dropdowns */}
                    {[
                        {
                            name: 'Price Range',
                            options: [
                                { label: 'Below ₹50L', value: '0-50' },
                                { label: '₹50L - ₹1Cr', value: '50-100' },
                                { label: 'Above ₹1Cr', value: '100+' },
                            ],
                        },
                        {
                            name: 'Flat/Villa',
                            options: [
                                { label: 'Flat', value: 'flat' },
                                { label: 'Villa', value: 'villa' },
                            ],
                        },
                        {
                            name: 'Type',
                            options: [
                                { label: 'Residential', value: 'residential' },
                                { label: 'Commercial', value: 'commercial' },
                                { label: 'Rental', value: 'rental' },
                            ],
                        },
                    ].map((dropdown, idx) => (
                        <div className="relative w-full md:w-auto" key={idx}>
                            <select
                                className="appearance-none w-full md:w-auto px-5 py-3 rounded-full border border-gray-300 text-sm pr-10 bg-white text-gray-700"
                            >
                                <option value="">{dropdown.name}</option>
                                {dropdown.options.map((opt, i) => (
                                    <option value={opt.value} key={i}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    ))}

                    {/* Search Button */}
                    <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all text-sm">
                        Search
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
