

import React from 'react';

const Overview = () => {
  return (
    <section id="overview" className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 pt-24 bg-yellow-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-700 mb-6">
          Morya - Project Overview
        </h1>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Introducing Sugam Morya: A Luxurious Residential Project in Tollygunge, South Kolkata
        </h2>

        <p className="text-gray-600 mb-8 text-left leading-relaxed">
            Sugam Morya is an upscale residential project by the renowned Sugam Group, 
            strategically located on B L Shah Road, in the heart of Tollygunge, South Kolkata. 
            This premium development offers the perfect blend of modern luxury and traditional 
            Indian values, creating an elevated living experience inspired by global standards yet 
            rooted in culture.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                Prime Location in Tollygunge with Excellent Connectivity
            </h3>
            <p className="text-gray-600 leading-relaxed">
                Set in one of South Kolkata’s most sought-after neighborhoods, 
                Sugam Morya enjoys unmatched connectivity. 
                Located near Tollygunge Metro Station, the project is well-connected via buses, 
                auto-rickshaws, and major roads, ensuring smooth access to Dum Dum, 
                Park Street, Esplanade, and other key city areas.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                Spacious Luxury Apartments in South Kolkata
            </h3>
            <p className="text-gray-600 leading-relaxed">
                Spread over 5.2 acres, Sugam Morya features elegantly designed 3 BHK, 3.5 BHK, and 4 BHK apartments, ranging from 1,529 sq. ft. to 3,755 sq. ft. The project consists of two G+18 residential towers housing 172 exclusive units, ensuring privacy and a low-density environment.

                A key highlight is the 80% open space, thoughtfully curated with landscaped gardens, serene water bodies, and recreational zones, providing residents with a tranquil lifestyle within the city’s buzz.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                A High-Value Real Estate Investment in Kolkata
            </h3>
            <p className="text-gray-600 leading-relaxed">
                With 95% of the units already sold, Sugam Morya is among the fastest-selling luxury real estate projects in Kolkata. Priced from ₹1.46 Cr onwards, these apartments present an excellent opportunity for both end-users and investors. The project is scheduled for possession in June 2027, giving homeowners ample time to plan their future in this premium gated community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
