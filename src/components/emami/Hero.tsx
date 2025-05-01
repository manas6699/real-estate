import React from 'react'

const Hero = () => {
    return (
        <section
            className="relative w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url("/assets/emami/Hero.jpg")' }}
        >
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center h-full p-4 md:p-10">
                {/* Heading */}
                <h1 className="text-white text-6xl sm:text-5xl md:text-6xl lg:text-8xl text-center font-extrabold">
                    <span className="block">EMAMI</span>
                    AAMOD
                </h1>
            </div>
        </section>


    )
}

export default Hero