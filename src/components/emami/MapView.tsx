import React from 'react'

import {
    Building2,
    ShieldCheck,
    Trees,
    ParkingCircle,
    CalendarCheck,
    Sparkles,
    MapPin,
    UserCheck,
} from 'lucide-react';
import Image from 'next/image';

import MapImage from '../../../public/assets/map.png'

const MapView = () => {

    const features = [
        {
            icon: <Building2 className="w-8 h-8 text-emerald-600" />,
            title: 'Premium Construction',
            description: 'High-quality materials and modern design for long-lasting durability.',
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
            title: '24x7 Security',
            description: 'Advanced surveillance systems and secure gated community.',
        },
        {
            icon: <Trees className="w-8 h-8 text-emerald-600" />,
            title: 'Green Landscaping',
            description: 'Beautifully landscaped gardens and eco-friendly surroundings.',
        },
        {
            icon: <ParkingCircle className="w-8 h-8 text-emerald-600" />,
            title: 'Ample Parking',
            description: 'Spacious and well-organized parking for residents and guests.',
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-emerald-600" />,
            title: 'Timely Possession',
            description: 'Committed timelines with transparent construction progress updates.',
        },
        {
            icon: <Sparkles className="w-8 h-8 text-emerald-600" />,
            title: 'Luxury Amenities',
            description: 'State-of-the-art clubhouse, gym, pool, and recreation zones.',
        },
        {
            icon: <MapPin className="w-8 h-8 text-emerald-600" />,
            title: 'Prime Location',
            description: 'Centrally located with easy access to schools, hospitals, and markets.',
        },
        {
            icon: <UserCheck className="w-8 h-8 text-emerald-600" />,
            title: 'Trusted Developer',
            description: 'Delivered multiple landmark projects with a focus on quality and trust.',
        },
    ];


  return (
    <section>
          <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-12 w-full">
              {/* Map Section */}
              
                  <Image alt='map' src={MapImage} />
              

              {/* Features Section */}
              <div className="lg:w-1/2 w-full bg-white rounded-xl shadow p-2 md:p-6">
                  <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-6">Key Features</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                      {features.map((feature, idx) => (
                          <div
                              key={idx}
                              className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                          >
                              <div className="mb-2">{feature.icon}</div>
                              <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
    </section>
  )
}

export default MapView