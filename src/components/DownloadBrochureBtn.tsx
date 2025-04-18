'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileDown, X } from 'lucide-react';

type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};


export default function DownloadBrochureButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<BrochureFormData>({ name: '', email: '', phone: '' , source:'town square' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

            toast.success('Brochure request submitted successfully!');
            setFormData({ name: '', email: '', phone: '', source: 'town square' });
            setIsOpen(false);

            // Trigger the download
            const link = document.createElement('a');
            link.href = 'pdfs/Brochure.pdf'; // Path in the public folder
            link.download = 'TownSquare-Brochure.pdf'; // Suggested filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
                                placeholder="Phone Number (10 Digit)"
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

            {/* Toast Messages */}
            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
}
