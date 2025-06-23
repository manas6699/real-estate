'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'

type AmenitiesProps = {
    amenities: string[];
  };

export default function Amenities({ amenities } : AmenitiesProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            scrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' })
        },
        onSwipedRight: () => {
            scrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' })
        },
        trackMouse: true,
    })

    return (
        <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Amenities</h2>

            <div className="sm:hidden" {...swipeHandlers}>
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-6 snap-x snap-mandatory"
                >
                    {amenities.map((src, idx) => (
                        <div
                            key={idx}
                            className="relative snap-center shrink-0 w-[200px] aspect-[9/16] bg-white rounded-2xl shadow-md overflow-hidden"
                        >
                            <Image
                                src={src}
                                alt={`Amenity ${idx + 1}`}
                                fill
                                className="rounded-2xl object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>


            <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((src, idx) => (
                    <div
                        key={idx}
                        className="relative bg-white rounded-2xl shadow-md overflow-hidden aspect-[9/16]"
                    >
                        <Image
                            src={src}
                            alt={`Amenity ${idx + 1}`}
                            fill
                            className="rounded-2xl object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
