import Image from "next/image";

import { developers } from "@/app/data/developers";
import Link from "next/link";

export default function DeveloperSection() {
    const topDevelopers = developers.slice(0, 4);
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                    Trusted Real Estate Developers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 cursor-pointer">
                    {topDevelopers.map((dev) => (
                        <Link href={`/developers/${dev.slug}`} key={dev.name}>
                            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
                                <div className="relative w-full h-48 rounded-2xl">
                                    <Image
                                        src={dev.image}
                                        alt={dev.name}
                                        fill
                                        className="p-4 object-contain rounded-2xl"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        {dev.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-4">
                                        {dev.description}
                                    </p>
                                    <p className="text-xs mt-2 text-blue-600 font-extrabold">
                                        See more
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


                
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-12">
                <Link href="/DevepoperPage">
                    <button className="bg-[#de3163] hover:bg-[#c42553] text-white font-semibold py-2 px-6 rounded-md transition cursor-pointer">
                        View All Popular Developers
                    </button>
                </Link>
            </div>
        
    
        </section>
    );
}