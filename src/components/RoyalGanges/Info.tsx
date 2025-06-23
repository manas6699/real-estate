import React from 'react'
import EnquiryBtn from '@/components/EnquireBtn';
import { CalendarDays, IndianRupee, LayoutList } from 'lucide-react';

interface propdata {
    priceRange: string,
    configuration: string,
    possessionDate: string,
    sourceName : string
}

const Info = (prop : propdata) => {
  return (
    <>
          <section >
              <div className="bg-white rounded-2xl shadow-xl  mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                      {/* Price Range */}
                      <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                              <IndianRupee className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-600 font-medium">Price Range</p>
                              <p className="text-lg font-semibold">{prop.priceRange}</p>
                          </div>
                      </div>
                      {/* Configuration */}
                      <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                              <LayoutList className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-600 font-medium">Configuration</p>
                              <p className="text-lg font-semibold">{prop.configuration}</p>
                          </div>
                      </div>
                      {/* Possession Date */}
                      <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                              <CalendarDays className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-600 font-medium">Possession Date</p>
                              <p className="text-lg font-semibold">{prop.possessionDate}</p>
                          </div>
                      </div>
                      <div>
                          <EnquiryBtn source={prop.sourceName} btntext='Instant Call Back ⚡' modalheading="Contact Us" />
                      </div>

                  </div>
              </div>
          </section>
    </>
  )
}

export default Info