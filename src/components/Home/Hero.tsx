import React from 'react'

const Hero = () => {
  return (
      <section
          className="relative w-full h-screen bg-cover bg-center flex items-center justify-center px-4  bg-black/50"
          style={{ backgroundImage: "url('assets/morya/morya-gallery-1.webp')" }}
      >
          <div className="absolute inset-0 bg-black/25  z-0"></div>

          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-4xl w-full">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  The #1 Site for Real Estate You Trust
              </h1>
              <p className="text-lg md:text-xl mb-8">
                  Discover premium flats, villas, and commercial properties for rent or sale.
              </p>

              {/* Search Box */}
              <div className="bg-white 
              rounded-full p-4 shadow-lg flex flex-col md:flex-row items-stretch gap-4 w-full max-w-5xl mx-auto">
                  {/* Location Filter */}
                  <input
                      type="text"
                      placeholder="Location"
                      className="flex-1 px-5 py-3 text-black rounded-full border border-gray-300 outline-none text-sm"
                  />

                  {/* Custom Select Dropdowns */}
                  <div className="relative">
                      <select className="appearance-none px-5 py-3 rounded-full border border-gray-300 text-sm pr-10 bg-white text-gray-700">
                          <option value="">Price Range</option>
                          <option value="0-50">Below ₹50L</option>
                          <option value="50-100">₹50L - ₹1Cr</option>
                          <option value="100+">Above ₹1Cr</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ▼
                      </div>
                  </div>

                  <div className="relative">
                      <select className="appearance-none px-5 py-3 rounded-full border border-gray-300 text-sm pr-10 bg-white text-gray-700">
                          <option value="">Flat/Villa</option>
                          <option value="flat">Flat</option>
                          <option value="villa">Villa</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ▼
                      </div>
                  </div>

                  <div className="relative">
                      <select className="appearance-none px-5 py-3 rounded-full border border-gray-300 text-sm pr-10 bg-white text-gray-700">
                          <option value="">Type</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="rental">Rental</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ▼
                      </div>
                  </div>

                  {/* Search Button */}
                  <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all text-sm">
                      Search
                  </button>
              </div>
          </div>
      </section>


  )
}

export default Hero