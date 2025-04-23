import React from 'react'

const Hero = () => {
    return (
        <section
            className="relative w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url("/assets/hero-emami.png")' }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center h-full p-4 md:p-10">
                {/* Heading */}
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-center md:text-left font-extrabold mb-8 md:mb-0">
                    <span className="block">EMAMI</span>
                    AAMOD
                </h1>

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl shadow-lg w-full sm:w-3/4 md:max-w-md p-6 text-white">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                        Discover Refined Living in the heart of NEW ALIPORE
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed">
                        Located in the prestigious James Long Sarani near New Alipore,
                        Emami Aamod offers an exclusive collection of 3 BHK and 4 BHK residential apartments with servant rooms,
                        spread across four magnificent Towers on 4 acres of Lush Greenery.
                    </p>
                    <div className="mt-4">
                        <button className="bg-white text-black rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-100 transition">
                            KNOW MORE
                        </button>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Hero