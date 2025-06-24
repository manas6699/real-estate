import React from 'react';
import { JSX } from 'react/jsx-dev-runtime';
import { Home, Wifi, Building2, ShieldCheck, Trees, ParkingCircle } from 'lucide-react';

interface iframeSourceType {
    iframesource: string;
}

interface FeatureItem {
    featureIcon: string[]; // ["home"]
    featureTitle: string;
    featureDescription: string;
    _id: string;
}

interface MapProps extends iframeSourceType {
    features: FeatureItem[];
}

const iconMap: Record<string, JSX.Element> = {
    home: <Home className="w-8 h-8 text-red-600" />,
    wifi: <Wifi className="w-8 h-8 text-red-600" />,
    building: <Building2 className="w-8 h-8 text-red-600" />,
    security: <ShieldCheck className="w-8 h-8 text-red-600" />,
    trees: <Trees className="w-8 h-8 text-red-600" />,
    parking: <ParkingCircle className="w-8 h-8 text-red-600" />,
};

const Map = ({ iframesource, features }: MapProps) => {
    return (
        <section>
            <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-12 w-full">
                {/* Map Section */}
                <div className="lg:w-1/2 w-full h-[500px] rounded-xl overflow-hidden shadow">
                    <iframe
                        src={iframesource}
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        className="w-full h-full border-0"
                    />
                </div>

                {/* Features Section */}
                <div className="lg:w-1/2 w-full bg-white rounded-xl shadow p-2 md:p-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-6">Key Features</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map((feature) => (
                            <div
                                key={feature._id}
                                className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg hover:shadow-md transition shadow-[0_4px_12px_rgba(255,221,0,0.6)]"
                            >
                                <div className="mb-2">
                                    {iconMap[feature.featureIcon[0]] ?? <Home className="w-8 h-8 text-gray-400" />}
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{feature.featureTitle}</h3>
                                <p className="text-sm text-gray-600">{feature.featureDescription}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Map;
