import React from 'react'

import { Phone, MessageCircle } from 'lucide-react';

import HeroImage from '../../public/assets/morya/1.jpg';
import Image from 'next/image';

const Hero = () => {
  return (
    <div>
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/assets/hero-morya.png")' }}>

        <section className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-12 py-8 md:py-16">
          {/* Image Section - 75% width on medium+ screens */}
          <div className="relative w-full md:w-3/4 h-64 md:h-[75vh] rounded-3xl overflow-hidden">
            <Image
              src={HeroImage}
              alt="Hero"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          {/* Text Section - 100% width on mobile, 25% on desktop */}
          <div className="w-full md:w-1/4 flex flex-col justify-center text-center md:text-left px-4 md:px-6 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-8xl font-bold text-gray-800 mb-4">Morya</h1>
            <p className="text-base md:text-lg text-gray-600">
              Discover luxurious living and elegant spaces with Morya. Your future home awaits in the heart of comfort and style.
            </p>
          </div>
        </section>
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
    </div>
  )
}

export default Hero