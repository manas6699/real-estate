'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleClose = () => setSelectedIndex(null);

    const goNext = useCallback(() => {
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            return (prev + 1) % images.length;
        });
    }, [images.length]);

    const goPrev = useCallback(() => {
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            return (prev - 1 + images.length) % images.length;
        });
    }, [images.length]);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: goNext,
        onSwipedRight: goPrev,
        trackMouse: true,
    });

    useEffect(() => {
        if (selectedIndex !== null) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowLeft') goPrev();
                else if (e.key === 'ArrowRight') goNext();
                else if (e.key === 'Escape') handleClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedIndex, goNext, goPrev]);

    return (
        <div>
            {/* Desktop Grid View */}
            <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="cursor-pointer aspect-[4/3] relative overflow-hidden rounded-sm shadow-md"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <Image
                            src={src}
                            alt={`Image ${index + 1}`}
                            fill
                            className="rounded-sm object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Mobile Carousel View */}
            <div className="sm:hidden relative my-4">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 no-scrollbar"
                >
                    {images.map((src, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className="relative flex-shrink-0 w-[80%] aspect-[4/3] rounded-[10px] overflow-hidden snap-center shadow-md"
                        >
                            <Image
                                src={src}
                                alt={`Mobile Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            {/* <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 text-black px-3 py-1 text-sm rounded-md shadow">
                                Artistic Impression
                            </div> */}
                        </div>
                    ))}
                </div>

                {/* Optional scroll buttons for mobile carousel */}
                <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur"
                    onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur"
                    onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

            </div>

            {/* Fullscreen Modal Viewer */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    {...swipeHandlers}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    <button
                        onClick={goPrev}
                        className="absolute left-4 text-white text-3xl font-bold px-4"
                        aria-label="Previous"
                    >
                        &#8592;
                    </button>

                    <div className="max-w-4xl w-full flex justify-center px-4">
                        <Image
                            src={images[selectedIndex]}
                            alt={`Large Image ${selectedIndex + 1}`}
                            width={1000}
                            height={600}
                            className="rounded-lg object-contain w-full h-auto max-h-[90vh]"
                        />
                    </div>

                    <button
                        onClick={goNext}
                        className="absolute right-4 text-white text-3xl font-bold px-4"
                        aria-label="Next"
                    >
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
