'use client';

import React from 'react'
import Form from '@/components/Form'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

import Amenities from '@/components/Amenities'
import Info from '@/components/GodrejBlue/Info'
import Map from '@/components/GodrejBlue/Map'

import Hero from '@/components/GodrejBlue/Hero'
import PopupForm from '@/components/PopupForm';

import ImageGallery from '@/components/ImageGallery';
import Overview from '@/components/GodrejBlue/Overview'
import MagicCard from '@/components/GodrejBlue/MagicCard'
import EmiCalculator from '@/components/Home/EmiCalculator';

import StickyButtonsRight from '@/components/StickyButtonsRight';
import PaymentPlan from '@/components/GodrejBlue/PaymentPlan'
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm'
import DownloadBrochure from '@/components/GodrejBlue/DownloadBrochure';


const images = [
  '/assets/gb/1.jpg',
  '/assets/gb/2.jpg',
  '/assets/gb/3.jpg',
  '/assets/gb/4.jpg'
];

const page = () => {

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
          <div className='lg:hidden block'>
            <PopupForm source='Godrej-Blue' formHeading="Price's increasing soon" logoImage='/assets/logo-transparent.png' />
          </div>
          <Navbar source="Godrej-Blue" />
          <Hero />
          <StickyButtonsRight />
          <Info />
          <MobileMagicHiddenForm source="Godrej-Blue" />
          <MagicCard />
          <Map />
          <Overview />
          <PaymentPlan />
          <EmiCalculator />
          <DownloadBrochure />
          <Amenities
            amenities={[
              '/assets/amenities/1.png',
              '/assets/amenities/2.png',
              '/assets/amenities/32.png',
              '/assets/amenities/23.png',
              '/assets/amenities/24.png',
              '/assets/amenities/25.png',
              '/assets/amenities/26.png',
              '/assets/amenities/27.png',
            ]}
          />
          <section id="gallery" className="p-6 pt-24">
            <h1 className="text-4xl  font-bold mb-10">Gallery</h1>
            <ImageGallery images={images} />
            <p className=' p-6 mt-4 text-gray-600  mb-4 space-y-2'>
              Explore the stunning visuals of Godrej Blue, showcasing its luxurious interiors, modern architecture, and serene surroundings. Each image captures the essence of upscale living in South Kolkata.
              Experience the blend of elegance and comfort that defines this premium residential project.
              Dive into the gallery to see why Godrej Blue is the epitome of luxury living and a perfect choice for your dream home.
            </p>
          </section>
          
          <Footer phoneNumber="98309 47144" />
        </div>
        <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-yellow-50 p-4 sm:p-6 sticky top-0 border-l border-gray-300">
          <Form source="Godrej-Blue" />
        </div>
      </div>
    </>
  )
}

export default page