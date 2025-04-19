// components/MapView.tsx
'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import { Building2, ShieldCheck, Trees, ParkingCircle } from 'lucide-react';

const DynamicMap = dynamic(() => import('@/components/Map'), {
    ssr: false, // 👈 This ensures it's only rendered on the client
});

const features = [
    {
        icon: <Building2 className="w-8 h-8 text-red-600" />,
        title: 'Premium Construction',
        description: 'High-quality materials and modern design for long-lasting durability.',
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
        title: '24x7 Security',
        description: 'Advanced surveillance systems and secure gated community.',
    },
    {
        icon: <Trees className="w-8 h-8 text-red-600" />,
        title: 'Green Landscaping',
        description: 'Beautifully landscaped gardens and eco-friendly surroundings.',
    },
    {
        icon: <ParkingCircle className="w-8 h-8 text-red-600" />,
        title: 'Ample Parking',
        description: 'Spacious and well-organized parking for residents and guests.',
    },
];

export default function MapView() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-12 w-full">
            {/* Map Section */}
            <div className="lg:w-1/2 w-full h-[400px] rounded-xl overflow-hidden shadow">
                <DynamicMap />
            </div>

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
    );
}
