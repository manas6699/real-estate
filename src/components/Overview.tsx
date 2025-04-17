import React from 'react'

import Image from 'next/image'

import Underline from "../../public/assets/underline.png"
import Inside from "../../public/assets/inside.png"

const Overview = () => {
  return (
    <div>
          <section
              className="relative w-full h-screen bg-cover bg-center"
              style={{ backgroundImage: 'url("/assets/bg-2.png")' }}
          >
              {/* Overlay */}
              <div className="absolute"></div>

              {/* Centered Heading */}
              <div className="absolute inset-0 flex flex-col items-center mt-10 text-center">
                  <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg  text-green-500">
                      Overview
                  </h1>
                    <Image src={Underline} alt="underline" className="w-1/4 top-0.5" />

                    <p className='lg:w-2/3 p-2'>
                      The legacy continues with an elevated living experience at the heart of Action Area I, strategically located on Major Arterial Road, directly opposite to Novotel. This latest development in Newtown – the Smart Green City 
                    </p>

                  <Image src={Inside} alt="flat image" className="lg:w-1/3 w-full p-2" />
                  <p className='lg:w-2/3 p-2'>
                      – redefines modern aspirations with expansive living spaces, panoramic views and a thoughtfully curated selection of premium amenities. At its core lies a sanctuary of lush greenery, seamlessly blending nature with contemporary living. 
                  </p>
              </div>

             
          </section>
    </div>
  )
}

export default Overview