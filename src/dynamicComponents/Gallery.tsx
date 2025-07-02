'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
}

const Gallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleClose = () => setSelectedIndex(null);

    useEffect(() => {
        if (selectedIndex !== null) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowLeft') {
                    setSelectedIndex((prev) =>
                        prev !== null ? (prev - 1 + images.length) % images.length : null
                    );
                } else if (e.key === 'ArrowRight') {
                    setSelectedIndex((prev) =>
                        prev !== null ? (prev + 1) % images.length : null
                    );
                } else if (e.key === 'Escape') {
                    handleClose();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedIndex, images.length]);

    return (
        <div className="w-full">
            {/* Grid Display */}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((filename, index) => (
                    <div
                        key={index}
                        className="cursor-pointer aspect-[4/3] relative overflow-hidden rounded-lg shadow-md"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <Image
                            src={filename}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                ))}
            </div>

            {/* Modal Viewer */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white text-3xl"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    <button
                        onClick={() =>
                            setSelectedIndex(
                                (selectedIndex - 1 + images.length) % images.length
                            )
                        }
                        className="absolute left-4 md:left-8 text-white text-4xl px-2"
                        aria-label="Previous"
                    >
                        &#8592;
                    </button>

                    <div className="max-w-5xl w-full flex justify-center items-center">
                        <Image
                            src={images[selectedIndex]}
                            alt={`Large Image ${selectedIndex + 1}`}
                            width={1200}
                            height={800}
                            className="object-contain w-full h-auto max-h-[90vh] rounded-xl"
                        />
                    </div>

                    <button
                        onClick={() =>
                            setSelectedIndex((selectedIndex + 1) % images.length)
                        }
                        className="absolute right-4 md:right-8 text-white text-4xl px-2"
                        aria-label="Next"
                    >
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gallery;
