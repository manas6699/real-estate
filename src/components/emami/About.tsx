import Image from 'next/image'
import React from 'react'
// import Emami from '../../public/assets/emami/eami-logo.webp'
import Emami from '../../../public/assets/emami/eami-logo.webp'

const About = () => {
  return (
    <div>
          <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-white">
              <h1 className="text-blue-400 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                  About Emami Realty
              </h1>
              

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                  <Image
                      alt="emami logo"
                      width={200}
                      height={60}
                      src={Emami}
                      className="w-auto h-auto object-contain"
                  />
                  <p className="text-justify text-base sm:text-lg leading-relaxed">
                      Established in 2006, Emami Realty is the real estate division of the renowned Emami Group. 
                      Headquartered in Kolkata, the company has carved a niche for itself across residential, 
                      commercial, and retail sectors. Emami Realty stands as a testament to innovation, trust, and superior quality, 
                      reflecting the values of its parent group. Over the years, 
                      it has played a pivotal role in shaping the modern skyline of Kolkata, 
                      driving the city’s urban development with a forward-thinking approach and uncompromising standards.
                  </p>
              </div>
          </section>
    </div>
  )
}

export default About