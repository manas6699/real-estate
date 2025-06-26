'use client';

import axios from 'axios';
import { X } from 'lucide-react'
import React, { useState } from 'react'
import Loader from '@/components/loader';
import { LEADS_ENDPOINT } from '@/config/api';
import { toast, ToastContainer } from 'react-toastify'


type BrochureFormData = {
    name: string;
    email: string;
    phone: string;
    source: string;
};

type EnquireBtnProps = {
    source: string;
    btntext: string;
    modalheading: string;
    clickevent?: (() => void);
};

const EnquireBtn = ({ source, btntext, modalheading , clickevent }: EnquireBtnProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BrochureFormData>({ name: '', email: '', phone: '', source: source });

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
            setFormData({ name: '', email: '', phone: '', source: source });
            setIsOpen(false);
            setLoading(false);
            // removing blur
            if (clickevent) clickevent();

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
      <div>
          <button
              onClick={() => setIsOpen(true)}
              className="bg-[#de3163] text-white text-xs lg:text-lg px-5 py-6  rounded-md font-semibold hover:bg-[#000000] transition"
          >
              {btntext}
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

                      <h2 className="text-xl font-bold mb-2 text-gray-800">{modalheading}</h2>
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
  )
}

export default EnquireBtn