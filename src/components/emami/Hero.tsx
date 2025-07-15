import Image from 'next/image';
import React from 'react';

const Hero = () => {
    return (
        <section className="p-4 md:p-10 mt-14">
            <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-[3/2] sm:aspect-[16/9]">
                {/* Image */}
                <Image
                    src="/assets/emami/Hero.jpg"
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                />

            </div>
                {/* Text content */}
                <div className="flex flex-col p-2 mt-2">
                    <h1 className="text-pink-600 text-2xl sm:text-2xl md:text-4xl lg:text-4xl font-extrabold drop-shadow-md">
                    <span className="block">EMAMI AAMOD</span>
                    </h1>
                </div>
        </section>
    );
};

export default Hero;
