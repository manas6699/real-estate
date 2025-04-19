

import React from 'react'
import Navbar from '@/components/Navbar'

import Hero from '@/componentsMorya/Hero'

import Info from '@/componentsMorya/Info'



export const metadata= {
  title: "4 & 3 BHK Apartments in Tolly gunge | Sugam Morya Phase 2",
  description: "Sugam Morya in Tollygunge offers premium 3, 3.5  & 4  BHK homes with lush open areas, elegant design, and top-tier amenities on the prestigious BL Shah Road.",
};

const page = () => {
  return (
    <div>
        <Navbar source="morya"/>
        <Hero/>
        <Info/>
    </div>
  )
}

export default page