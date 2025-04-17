// components/Gallery.tsx

import Image from "next/image";

import { FileDown } from 'lucide-react';

const imageSizes = [
    "800x600", "600x800", "1200x600", "600x1200",
    "1000x700", "700x1000", "1080x720", "720x1080",
    "1024x768", "768x1024", "960x640", "640x960",
];

const Gallery = () => {
    return (
        <>
        <section className="w-full px-4 py-10 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Gallery</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {imageSizes.map((size, index) => (
                    <div key={index} className="relative w-full aspect-video overflow-hidden rounded-xl shadow-md">
                        <Image
                            src={`https://source.unsplash.com/random/${size}?sig=${index + 1}`}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3} // optional: prioritize loading first 3 images
                        />
                    </div>
                ))}
            </div>
            <div className="flex-1 mt-14">
                <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga blanditiis cumque
                    exercitationem nostrum illo nulla ad fugiat aliquam debitis magni. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Corporis, saepe fugit nesciunt
                    quasi aperiam cum repellendus accusamus ea molest
                </p>
            </div>
        </section>

        <section className="w-full px-4 py-10 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Floor Plans</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {imageSizes.map((size, index) => (
                    <div key={index} className="relative w-full aspect-video overflow-hidden rounded-xl shadow-md">
                        <Image
                            src={`https://source.unsplash.com/random/${size}?sig=${index + 1}`}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3} // optional: prioritize loading first 3 images
                        />
                    </div>
                ))}
            </div>
        </section>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-20 mb-10">
                <button className="inline-flex items-center gap-3 px-10 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all w-fit">
                    <FileDown className="w-7 h-7 md:w-9 md:h-9" />
                    <div className="flex flex-col leading-tight text-left">
                        <span className="text-[10px] md:text-xs font-medium text-white/80">Download</span>
                        <span className="text-sm md:text-base font-semibold">Floor Plans</span>
                    </div>
                </button>

                <div className="flex-1">
                    <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga blanditiis cumque
                        exercitationem nostrum illo nulla ad fugiat aliquam debitis magni. Lorem ipsum
                        dolor sit, amet consectetur adipisicing elit. Corporis, saepe fugit nesciunt
                        quasi aperiam cum repellendus accusamus ea molest
                    </p>
                </div>
            </div>
        
        </>
    );
};

export default Gallery;
