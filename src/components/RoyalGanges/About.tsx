import React from 'react'
import Image from 'next/image'
import Logo from '../../../public/assets/srijan-logo.png';

const About = () => {
  return (
    <div>
          <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-yellow-50">
              <h1 className="text-amber-700 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                  About Srijan
              </h1>
              

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                  <Image
                      alt="srijan logo"
                      width={100}
                      height={60}
                      src={Logo}
                      className="w-auto h-auto object-contain"
                  />
                  <p className="text-justify text-base sm:text-lg leading-relaxed">
                  Srijan Group stands at the forefront of Kolkata’s real estate landscape, emerging as a distinguished player with an impressive portfolio. Rooted in the vision to serve both people and the planet, we are committed to crafting spaces that embody the warmth of tradition and the comfort of a dream home.

Our approach is powered by a passionate in-house team, constantly driving innovation and design that seamlessly align with today’s urban lifestyles.
                  </p>
              </div>
          </section>
    </div>
  )
}

export default About