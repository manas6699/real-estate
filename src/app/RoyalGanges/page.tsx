'use client';

import React from 'react'
import Form from '@/components/Form'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'


import PopupForm from '@/components/PopupForm';
import Info from '@/components/RoyalGanges/Info'
import Hero from '@/components/RoyalGanges/Hero'
import About from '@/components/RoyalGanges/About'
import Map from '@/components/RoyalGanges/Map'

// import Overview from '@/components/componentsMorya/Overview'
import Amenities from '@/components/Amenities'
import FloorPlans from '@/components/RoyalGanges/FloorPlans'
import MagicCard from '@/components/RoyalGanges/MagicCard'

import EmiCalculator from '@/components/Home/EmiCalculator';
import StickyButtonsRight from '@/components/StickyButtonsRight';
import PaymentPlan from '@/components/RoyalGanges/PaymentPlan'
import Gallery from '@/components/RoyalGanges/Gallery'
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm'
import DownloadBrochure from '@/components/RoyalGanges/DownloadBrochure'
import FloorPlansDownload from '@/components/componentsMorya/FloorPlansDownload'

const page = () => {

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
          <div className='lg:hidden block'>
            <PopupForm source='Primus Ganges' formHeading="Price's increasing soon" logoImage='/assets/morya/morya.png' />
          </div>
          <Navbar source="Primus Ganges" />
          <Hero />
          <StickyButtonsRight />
          <Info sourceName="Primus Ganges" possessionDate="DEC 2027" configuration="2, 3, 4 BHK" priceRange="₹ 56 L - 2.45 Cr" />
          <MobileMagicHiddenForm source="Primus Ganges" />
          <MagicCard />
          <Map />
          <About />
          {/* <Overview/> */}
          <PaymentPlan />
          <EmiCalculator />
          <DownloadBrochure />
          <Amenities
            amenities={[
              '/assets/amenities/20.png',
              '/assets/amenities/21.png',
              '/assets/amenities/32.png',
              '/assets/amenities/33.png',
              '/assets/amenities/34.png',
              '/assets/amenities/25.png',
              '/assets/amenities/26.png',
              '/assets/amenities/27.png',
            ]}
          />
          <Gallery />
          <FloorPlans />
          <FloorPlansDownload />
          <Footer phoneNumber="98309 47144" />
        </div>
        <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-yellow-50 p-4 sm:p-6 sticky top-0 border-l border-gray-300">
          <Form source="Primus Ganges" />
        </div>
      </div>
    </>
  )
}

export default page