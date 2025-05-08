import Image from 'next/image'
import React from 'react'
import Logo from "../../../public/assets/srijan-logo.png"

const About = () => {
    return (
        <section className="p-6 sm:p-10">
            <h1 className="text-blue-400  text-3xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                About Srijan Realty Pvt. Ltd
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                <Image
                    alt="srijan logo"
                    width={200}
                    height={60}
                    src={Logo}
                    className="w-auto h-auto object-contain"
                />
                <p className="text-justify text-base sm:text-lg leading-relaxed">
                    Srijan Realty, established in 1996, is one of the leading real estate developers
                    in Eastern India, with a strong presence in Kolkata, Asansol, and expanding
                    footprints in Chennai, Southern India. With over two decades of experience,
                    Srijan has become a driving force in shaping the urban landscape, known for its
                    innovation, quality craftsmanship, and customer-centric approach.
                    <br /><br />
                    The company’s portfolio includes modern apartments, luxurious villas, and
                    strategically located commercial spaces—each designed with precision and a deep
                    understanding of evolving lifestyle needs. Srijan’s developments are a seamless
                    blend of contemporary aesthetics and functional design, offering spaces that
                    elevate both living and working experiences.
                    <br /><br />
                    With a legacy built on trust and excellence, Srijan Realty continues to redefine
                    real estate standards, crafting spaces that inspire and stand the test of time.
                </p>
            </div>
        </section>
    )
}

export default About
