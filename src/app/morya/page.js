'use client';

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Hero from '@/componentsMorya/Hero'

import Info from '@/componentsMorya/Info'


import Map from '@/componentsMorya/MapView'

import About from '@/componentsMorya/About'

import DownloadBrochure from '@/componentsMorya/DownloadBrochure'

import MagicCard from '@/componentsMorya/MagicCard'
import PaymentPlan from '@/componentsMorya/PaymentPlan'
import Overview from '@/componentsMorya/Overview'
import Amenities from '@/componentsMorya/Amenities'
import GalleryMorya from '@/componentsMorya/GalleryMorya'
import FloorPlans from '@/componentsMorya/FloorPlans'
import FloorPlansDownload from '@/componentsMorya/FloorPlansDownload'
import Form from '@/components/Form'
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm'



const page = () => {
  return (
    <div>
        <div className="flex flex-col md:flex-row h-screen">
          <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
              <Navbar source="morya"/>
              <Hero/>
              <Info/>
              <MobileMagicHiddenForm source="morya"/>
              <MagicCard/>
              <Map/>
              <About/>
              <Overview/>
              <PaymentPlan/>
              <DownloadBrochure/>
              <Amenities/>
              <GalleryMorya/>
              <FloorPlans/>
              <FloorPlansDownload/>
              <Footer phoneNumber="98309 47144" />
          </div>
          <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-white p-4 sm:p-6 sticky top-0 border-l border-gray-300">
            <Form source="morya"/>
          </div>
        </div>
    </div>
  )
}

export default page