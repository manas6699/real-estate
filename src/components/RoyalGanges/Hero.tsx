import Image from 'next/image';
import React from 'react';

const Hero = () => {
    return (
        <section className="p-4 md:p-10 mt-14">
            <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-[3/2] sm:aspect-[16/9]">
                {/* Image */}
                <Image
                    src="/assets/royalgangesgallery/10.png"
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                />

            <div className="absolute bottom-4 left-4 text-white text-xl sm:text-3xl font-semibold whitespace-nowrap overflow-hidden border-r-2 border-white animate-typewriter">
            PRIMUS  GANGES
            </div>
            </div>

               
        </section>
    );
};

export default Hero;
