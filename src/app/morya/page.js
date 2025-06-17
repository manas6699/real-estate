'use client';

import React from 'react'
import Form from '@/components/Form'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'


import PopupForm from '@/components/PopupForm';
import Info from '@/components/componentsMorya/Info'
import Hero from '@/components/componentsMorya/Hero'
import About from '@/components/componentsMorya/About'
import Map from '@/components/componentsMorya/MapView'

import Overview from '@/components/componentsMorya/Overview'
import Amenities from '@/components/componentsMorya/Amenities'
import FloorPlans from '@/components/componentsMorya/FloorPlans'
import MagicCard from '@/components/componentsMorya/MagicCard'

import StickyButtonsRight from '@/components/StickyButtonsRight';
import PaymentPlan from '@/components/componentsMorya/PaymentPlan'
import GalleryMorya from '@/components/componentsMorya/GalleryMorya'
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm'
import DownloadBrochure from '@/components/componentsMorya/DownloadBrochure'
import FloorPlansDownload from '@/components/componentsMorya/FloorPlansDownload'

const page = () => {
  
  return (
    <>
        <div className="flex flex-col md:flex-row h-screen">
          <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
          <div className='lg:hidden block'>
              <PopupForm source='morya'  formHeading="Book a Site Visit" logoImage='/assets/morya/morya.png'/>
          </div>
              <Navbar source="morya"/>
              <Hero/>
              <StickyButtonsRight/>
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
          <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-purple-800 p-4 sm:p-6 sticky top-0 border-l border-gray-300">
            <Form source="morya"/>
          </div>
        </div>
    </>
  )
}

export default page