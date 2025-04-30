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
          <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-white p-4 sm:p-6 sticky top-0 border-l border-gray-300">
            <Form source="morya"/>
          </div>
        </div>

        <Footer/>
    </div>
  )
}

export default page