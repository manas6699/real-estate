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

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  const handleSubmit = ()=> {
    console.log("Hi");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
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
        showModal &&(
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
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />

              
              <button
                onClick={() => {
                  // handle action here or route
                  setShowModal(false);
                }}
                className="bg-[#de3163] hover:bg-[#c42553] w-full text-white py-2 rounded-md mt-2"
              >
                Enquire Now
              </button>
              </form>

            </div>
          </div> 
        )
      }
    </>
  );
};

export default Home;
