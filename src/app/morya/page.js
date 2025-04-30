'use client';

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Hero from '@/componentsMorya/Hero'

import Info from '@/componentsMorya/Info'


import Map from '@/componentsMorya/MapView'

import DownloadBrochure from '@/componentsMorya/DownloadBrochure'

import MagicCard from '@/componentsMorya/MagicCard'
import Amenities from '@/componentsMorya/Amenities'
import Gallery from '@/componentsMorya/Gallery'
import Form from '@/components/Form'



const page = () => {
  return (
    <div>
        <div className="flex flex-col md:flex-row h-screen">
        {/* Left scrollable content */}
          <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
              <Navbar source="morya"/>
              <Hero/>
              <Info/>
              <Map/>
              <MagicCard/>
              <DownloadBrochure/>
              <Amenities/>
              <Gallery/>
              
          </div>
          <div className="hidden md:block md:w-1/4 md:h-screen md:bg-white md:p-6 md:sticky md:top-0 md:border-l md:border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <Form source="morya"/>
          </div>
        </div>

        <Footer/>
    </div>
  )
}

export default page