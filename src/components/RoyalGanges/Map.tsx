// components/MapView.tsx
'use client';

import { Building2, ShieldCheck, Trees, ParkingCircle } from 'lucide-react';



const features = [
    {
        icon: <Building2 className="w-8 h-8 text-amber-700" />,
        title: 'Premium Construction',
        description: 'High-quality materials and modern design for long-lasting durability.',
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-amber-700" />,
        title: '24x7 Security',
        description: 'Advanced surveillance systems and secure gated community.',
    },
    {
        icon: <Trees className="w-8 h-8 text-amber-700" />,
        title: 'Green Landscaping',
        description: 'Beautifully landscaped gardens and eco-friendly surroundings.',
    },
    {
        icon: <ParkingCircle className="w-8 h-8 text-amber-700" />,
        title: 'Ample Parking',
        description: 'Spacious and well-organized parking for residents and guests.',
    },
];

export default function MapView() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-12 w-full">
            {/* Map Section */}
            <div className="lg:w-1/2 w-full h-[500px] rounded-xl overflow-hidden shadow">
                   
                   <iframe
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.5739837898145!2d88.23758097529893!3d22.520161579529145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027bffcef1950b%3A0x9421c7834177172!2sThe%20Royal%20Ganges%20-%20Srijan%20Realty!5e0!3m2!1sen!2sin!4v1750667086930!5m2!1sen!2sin"
                       width="600" height="450"
                       loading="lazy" >
                   </iframe>

            </div>

            {/* Features Section */}
            <div className="lg:w-1/2 w-full bg-white rounded-xl shadow p-2 md:p-6">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-6">Key Features</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col 
                              items-center text-center bg-gray-50 p-4 rounded-lg 
                              hover:shadow-md transition shadow-[0_4px_12px_rgba(255,221,0,0.6)]"
                        >
                            <div className="mb-2">{feature.icon}</div>
                            <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
