import React from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/Herosection'
import PropertyInfoSection from '@/components/PropertyInfoSection'
import Overview from '@/components/Overview'
import MagicCard from '@/components/MagicCard'
import Highlights from '@/components/Highlights'
import Amenities from '@/components/Amenities'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

const Home = () => {
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
    </>
  )
}

export default Home