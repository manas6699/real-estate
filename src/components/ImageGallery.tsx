'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleClose = () => {
        setSelectedIndex(null);
    };

    useEffect(() => {
        if (selectedIndex !== null) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowLeft') {
                    setSelectedIndex(prev =>
                        prev !== null ? (prev - 1 + images.length) % images.length : null
                    );
                } else if (e.key === 'ArrowRight') {
                    setSelectedIndex(prev =>
                        prev !== null ? (prev + 1) % images.length : null
                    );
                } else if (e.key === 'Escape') {
                    handleClose();
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [selectedIndex, images.length]); // dependencies are now minimal and stable

    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="cursor-pointer aspect-[4/3] relative overflow-hidden rounded-lg shadow-md"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <Image
                            src={src}
                            alt={`Image ${index + 1}`}
                            fill
                            className="rounded-lg object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Modal Viewer */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                        onClick={handleClose}
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
                        className="absolute left-4 text-white text-3xl font-bold px-4"
                        aria-label="Previous"
                    >
                        &#8592;
                    </button>

                    <div className="max-w-4xl w-full flex justify-center">
                        <Image
                            src={images[selectedIndex]}
                            alt={`Large Image ${selectedIndex + 1}`}
                            width={1000}
                            height={600}
                            className="rounded-lg object-contain w-full h-auto max-h-[90vh]"
                        />
                    </div>

                    <button
                        onClick={() =>
                            setSelectedIndex((selectedIndex + 1) % images.length)
                        }
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
