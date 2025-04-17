'use client';
import { useState } from 'react';
import { FileDown, X } from 'lucide-react';

export default function DownloadBrochureButton() {
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
                        <span className="text-sm md:text-base font-semibold">Brochure</span>
                    </div>
                </button>

                <div className="flex-1">
                    <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                        Download our brochure to explore the exquisite features and amenities of Town Square.
                        Discover the perfect blend of luxury and comfort in our thoughtfully designed spaces.
                        With a variety of layouts to choose from, find the one that suits your lifestyle best.
                        <br />
                        Explore the possibilities and envision your future in a home that reflects your aspirations.
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
        </>
    );
}
