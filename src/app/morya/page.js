

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


export const metadata= {
  title: "4 & 3 BHK Apartments in Tolly gunge | Sugam Morya Phase 2",
  description: "Sugam Morya in Tollygunge offers premium 3, 3.5  & 4  BHK homes with lush open areas, elegant design, and top-tier amenities on the prestigious BL Shah Road.",
  verification: {
    google: 'Xy7W7IIbzhmM1foAbu7RHD7ZtvREjPomdnBe1dK467w', // Just the code, not full meta tag
  },
};

const page = () => {
  return (
    <div>
        <Navbar source="morya"/>
        <Hero/>
        <Info/>
        <Map/>
        <MagicCard/>
        <DownloadBrochure/>
        <Amenities/>
        <Gallery/>
        <Footer/>
    </div>
  )
}

export default page