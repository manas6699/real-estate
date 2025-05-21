'use client';

import React from 'react';
import { MapPin, Bed, Bath } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

const properties = [
    {
        id: 1,
        image: '/assets/emami/1.webp',
        offer: true,
        featured: false,
        title: 'XYZ',
        location: 'xyz, Kolkata',
        beds: 4,
        baths: 2,
        price: '2 Cr',
    },
    {
        id: 2,
        image: '/assets/emami/1.webp',
        offer: true,
        featured: false,
        title: 'XYZ',
        location: 'xyz, Kolkata',
        beds: 4,
        baths: 2,
        price: '4 Cr',
    },
    {
        id: 3,
        image: '/assets/emami/1.webp',
        offer: true,
        featured: true,
        title: 'XYZ',
        location: 'xyz, Kolkata',
        beds: 4,
        baths: 2,
        price: '2 Cr',
    },
    {
        id: 4,
        image: '/assets/emami/1.webp',
        offer: true,
        featured: true,
        title: 'XYZ',
        location: 'xyz, Kolkata',
        beds: 4,
        baths: 2,
        price: '2 Cr',
    },
    {
        id: 5,
        image: '/assets/emami/1.webp',
        offer: true,
        featured: true,
        title: 'XYZ',
        location: 'xyz, Kolkata',
        beds: 4,
        baths: 2,
        price: '2 Cr',
    },
];

export default function RecentProperties() {
    return (
        <section className="py-12 px-4 md:px-10">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Recent Properties for Sale</h2>
                <p className="text-gray-600 text-sm mt-2">
                    Explore our latest listings of prime properties available for sale. From modern apartments to spacious villas, 
                    each listing is handpicked to meet your lifestyle and investment needs.    
                </p>
            </div>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{ clickable: true }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                modules={[Pagination]}
                className="w-full"
            >
                {properties.map((property) => (
                    <SwiperSlide key={property.id}>
                        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                            <div className="relative w-full h-64">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority // optional for above-the-fold images
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{property.title}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={14} /> {property.location}
                                </p>

                                <div className="flex items-center gap-4 border-t mt-4 pt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Bed size={16} /> {property.beds}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Bath size={16} /> {property.baths}
                                    </div>
                                    
                                </div>

                                <div className="mt-3 text-right text-red-600 font-semibold text-sm">
                                    From {property.price}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
