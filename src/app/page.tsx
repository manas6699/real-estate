'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/Herosection';
import PropertyInfoSection from '@/components/PropertyInfoSection';
import Overview from '@/components/Overview';
import MagicCard from '@/components/MagicCard';
import Highlights from '@/components/Highlights';
import Amenities from '@/components/Amenities';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import { X } from 'lucide-react';

import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import Loader from '@/components/loader'


const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const [loading , setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Town-Square',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post<{ message: string; lead: unknown }>(
        'https://split-wise-clone-085p.onrender.com/api/mmr/leads',
        formData
      );

      toast.success('Our Team will reach out to you very soon!');
      setFormData({ name: '', email: '', phone: '', source: "Town-Square" });
      setShowModal(false);

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
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar source="Town-square"/>
      <HeroSection />
      <PropertyInfoSection />
      <Overview />
      <MagicCard />
      <Highlights />
      <Amenities />
      <Gallery />
      <Footer />

      {/* Modal */}
      {
        showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-xl">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to MMR!</h2>

              <p className="text-sm text-gray-600 mb-4">Looking for more info or want to book a site visit?</p>
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
                  placeholder="Phone Number (10 digit)"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />


                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-[#de3163] hover:bg-[#c42553] w-full text-white py-2 rounded-md mt-2 flex items-center justify-center transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? <Loader size={20} color="border-white" /> : 'Enquire Now'}
                </button>

              </form>

            </div>
          </div>
        )
      }

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Home;
