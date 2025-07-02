'use client';

import { LandPlot, House, TentTree, Cuboid, Boxes, Combine, Copy, Check } from 'lucide-react'
import Map from '@/dynamicComponents/Map'
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EnquiryBtn from '@/components/EnquireBtn';
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm';
import Image from 'next/image';


import { BACKEND_ADMIN_POST_API } from '@/config/api'
// import EnquireBtn from '@/components/EnquireBtn';
import Amenities from '@/dynamicComponents/Amenities';
import DownloadBrochureButton2 from '../components/DownloadBrochureButton2';
import Gallery from '@/dynamicComponents/Gallery';
import Footer from '@/components/Footer';
import Form from '@/components/Form';


interface tableMapType {
    _id: string,
    unitType: string,
    size: string,
    price: string,


}
export default function AllinOne({ id }: { id: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null); // Replace 'any' with a proper type later if desired
    const [loading, setLoading] = useState(true);

    const [copied, setCopied] = useState(false);

    const progress = 70;

    useEffect(() => {
        axios
            .get(`${BACKEND_ADMIN_POST_API}/${id}`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar source={id} />
                <div className="w-full h-screen flex items-center justify-center">
                    <p className="text-lg font-medium text-gray-600">Loading...</p>
                </div>
            </>
        );
    }

    if (!data || !data.backgroundImage) {
        return (
            <>
                <Navbar source={id} />
                <div className="w-full h-screen flex items-center justify-center text-red-600 font-semibold">
                    Failed to load data or background image.
                </div>
            </>
        );
    }

    const backgroundImageUrl = data.backgroundImage
    const developerLogo = data.developerLogo
    const brochurepdf = data.brochurePdf
    const floorPlanPdf = data.floorPlanPdf

    const number = data.reraId;
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(number)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy!', err)
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row h-screen">
                <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
            <Navbar source={data.title} />
            <section
                className="w-full h-[80vh] bg-cover bg-center flex items-center justify-center text-white text-center px-4 sm:px-6 md:px-12"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`
                }}
            >

                <div className="p-4 md:p-8 rounded-xl max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                        {data.title}
                    </h1>
                    <p className="mt-4 text-md sm:text-lg">{data.description}</p>
                </div>
            </section>

            <section >
                <div className="bg-white rounded-2xl shadow-xl  mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                        <div>
                            <p className="text-gray-600 font-medium">Price Range</p>
                            <p className="text-lg font-semibold">{data.priceRange}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Configuration</p>
                            <p className="text-lg font-semibold">{data.configuration}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Possession Date</p>
                            <p className="text-lg font-semibold">{data.possessionDate}</p>
                        </div>
                        <div>
                                    <EnquiryBtn source={id} btntext='Instant Call Back ⚡' modalheading="demo" />
                        </div>

                    </div>
                </div>
            </section>
            <MobileMagicHiddenForm source={id} />

            <section className='p-5 lg:p-10 mx-auto flex flex-col'>
                <h2 className='text-xl md:text-4xl font-bold mb-5'>
                    {data.title} - Key Metrics
                </h2>
                <div className="w-full max-w-8xl mx-auto rounded-3xl 
            bg-gradient-to-tr from-lime-400 to-green-600 
             p-4 md:p-6 text-white transition-transform duration-300 
            hover:scale-[1.02]">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 px-3 sm:px-5 pb-3">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Project Status</h2>
                        <div className="p-1.5 sm:p-2 bg-orange-600 rounded-md">
                            <p className="text-xs sm:text-sm font-semibold">NEW</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2.5 sm:h-3 mb-4 sm:mb-6 overflow-hidden mx-3 sm:mx-5">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="px-3 sm:px-5 mb-4">
                        <p className="text-sm sm:text-base">
                            Units Sold : <span className="font-semibold">70%</span>
                        </p>
                    </div>

                    {/* 3 Column Stats Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-3 sm:px-5 py-2">
                        <div className="flex flex-col gap-1">
                            <LandPlot className='text-white w-6 h-6 font-bold' />
                            <span className="text-base sm:text-lg font-semibold">{data.landArea}</span>
                            <span className="text-xs text-white/80">Total Land Area</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <House className='text-white w-6 h-6 font-bold' />
                            <span className="text-base sm:text-lg font-semibold">{data.propertyType}</span>
                            <span className="text-xs text-white/80">Residence Typology</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <TentTree className='text-white w-6 h-6 font-bold' />
                            <span className="text-base sm:text-lg font-semibold">{data.propertySize}</span>
                            <span className="text-xs text-white/80">Remaining</span>
                        </div>
                    </div>

                    {/* 3 Column Stats Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-3 sm:px-5 py-2">
                        <div className="flex flex-col gap-1">
                            <Cuboid className='text-white w-6 h-6 font-bold' />
                            <span className="text-base sm:text-lg font-semibold">{data.noOfBlocks}</span>
                            <span className="text-xs text-white/80">Total No. of Blocks</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Boxes className='text-white w-6 h-6 font-bold' />
                            <span className="text-base sm:text-lg font-semibold">{data.floors}</span>
                            <span className="text-xs text-white/80">Floors</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Combine className='text-white w-6 h-6 font-bold' />
                            <span className="text-base sm:text-lg font-semibold">{data.noOfUnits}</span>
                            <span className="text-xs text-white/80">No of Units</span>
                        </div>
                    </div>

                    {/* RERA ID Input with Copy Button */}
                    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3
                bg-white rounded-xl shadow-md p-4 mt-4 sm:max-w-md">
                        <label htmlFor="number" className="text-xs font-bold text-gray-700">
                            RERA ID
                        </label>
                        <div className="relative flex-1">
                            <input
                                id="number"
                                value={number}
                                readOnly
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs text-gray-800"
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                                aria-label="Copy to clipboard"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </section>

            <Map iframesource={data.iframeSource} features={data.features} />
            <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-white">
                <h1 className="text-blue-400 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                    About {data.title}
                </h1>


                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                    <Image
                        alt='Developer Logo'
                        width={200}
                        height={60}
                        src={developerLogo}
                        className="w-auto h-auto object-contain"
                    />
                    <p className="text-justify text-base sm:text-lg leading-relaxed">
                        {data.developerDescription}
                    </p>
                </div>
            </section>

            <section className="px-4 py-12 mb-8 sm:px-8 md:px-16 lg:px-24">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-400 mb-6">
                        {data.title} - Project Overview
                    </h2>
                    <p className="text-gray-600 mb-8 text-left leading-relaxed">
                        {data.projectOverview}
                    </p>
                </div>
            </section>

            <section className='px-4 py-12
             sm:px-8 md:px-16 lg:px-24'>
                <div className="overflow-x-auto w-full">
                    <h2 className='text-2xl sm:text-4xl md:text-5xl font-bold text-blue-400 mb-6'>
                        {data.title} Payment Plan
                    </h2>
                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit Type</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.paymentPlan.map((plan: tableMapType) => (
                                <tr key={plan._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-sm text-gray-800">{plan.unitType}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{plan.size}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{plan.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* <div className="mt-5 flex justify-between gap-5">

                    <EnquireBtn source={data.title} btntext="Instant Call Back ⚡" />
                    <DownloadBrochureButton2 source={data.title} pdfurl={brochurepdf} btnText="Brochure" />
                </div> */}
                <div className="mt-5">

                        <DownloadBrochureButton2 source={data.title} pdfurl={brochurepdf} btnText="Brochure" />
                </div>
                <Amenities />
                <h2 className='text-xl md:text-4xl font-bold mb-5'>
                    Gallery
                </h2>
                <Gallery images={data.galleryImages}/>
                <h2 className='text-xl md:text-4xl font-bold mt-5 mb-10'>
                    Floor Plans
                </h2>
                <Gallery images={data.floorPlanImages}/>
                <div className="mt-16">

                <DownloadBrochureButton2 source={data.title} pdfurl={floorPlanPdf} btnText="Floor-Plans" />
                </div>
            </section>
            <Footer phoneNumber='9830947144'/>
    </div>
    <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-white p-4 sm:p-6 sticky top-0 border-l border-gray-300">
                <Form source={data.title}/>
              </div>
              </div>
        </>
    );
}
