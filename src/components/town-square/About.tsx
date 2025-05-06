import Image from 'next/image'
import React from 'react'
import Logo from "../../../public/assets/slogo.svg"

const About = () => {
    return (
        <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-white">
            <h1 className="text-blue-400 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                About Srijan Realty
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                <div className="w-40 sm:w-52 md:w-64 flex-shrink-0">
                    <Image
                        alt="Srijan Realty logo"
                        src={Logo}
                        width={300}
                        height={300}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>
                <p className="text-justify text-base sm:text-lg leading-relaxed">
                    Srijan Realty is one of the leading Real Estate developers in Eastern India and parts of Southern India.
                    Srijan Realty Private Limited is one of the leading real estate companies of eastern India located in Kolkata.
                </p>
            </div>
        </section>
    )
}

export default About
