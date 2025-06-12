'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'

const amenities = [
    '/assets/amenities/20.png',
    '/assets/amenities/21.png',
    '/assets/amenities/22.png',
    '/assets/amenities/23.png',
    '/assets/amenities/24.png',
    '/assets/amenities/25.png',
    '/assets/amenities/26.png',
    '/assets/amenities/27.png',
]

export default function Amenities() {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => scrollRef.current?.scrollBy({ left: 250, behavior: 'smooth' }),
        onSwipedRight: () => scrollRef.current?.scrollBy({ left: -250, behavior: 'smooth' }),
        trackMouse: true,
    })

    return (
        <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Amenities</h2>

            {/* Mobile Carousel */}
            <div className="sm:hidden" {...swipeHandlers}>
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar px-1"
                >
                    {amenities.map((src, idx) => (
                        <div
                            key={idx}
                            className="relative w-[230px] aspect-[9/16] bg-white rounded-2xl shadow-md overflow-hidden shrink-0"
                        >
                            <Image
                                src={src}
                                alt={`Amenity ${idx + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-2xl"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((src, idx) => (
                    <div
                        key={idx}
                        className="relative bg-white rounded-2xl shadow-md overflow-hidden aspect-[9/16]"
                    >
                        <Image
                            src={src}
                            alt={`Amenity ${idx + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-2xl"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
