import React from 'react'
import DownloadBrochureButton from '../DownloadBrochureBtn'

const Highlights = () => {
    return (
        <div>

            <DownloadBrochureButton />
            <section className="bg-white p-6 sm:p-10 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6 border-b pb-3">
                    Town Square - Key Highlights
                </h2>
                <ul className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed list-disc list-inside">
                    <li>
                        <span className="font-semibold">Premium Location:</span> Situated in New Town, Action Area I, offering excellent connectivity to major commercial and IT hubs.
                    </li>
                    <li>
                        <span className="font-semibold">Luxurious Apartments:</span> Spacious 3BHK, 3.5BHK, and 4BHK apartments ranging from 1,815 to 3,953 sq. ft.
                    </li>
                    <li>
                        <span className="font-semibold">Exclusive Towers:</span> Multiple towers with B+G+15, B+G+19, and B+G+24 floors, providing a luxurious living experience.
                    </li>
                    <li>
                        <span className="font-semibold">Affordable Luxury:</span> Apartments priced from ₹ 2.40 Cr, offering unmatched value in New Town.
                    </li>
                </ul>
            </section>


        </div>
    )
}

export default Highlights