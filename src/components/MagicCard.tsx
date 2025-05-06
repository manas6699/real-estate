'use client'


import { LandPlot, House, TentTree, Cuboid, Boxes, Combine } from 'lucide-react'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function MagicCard() {
    const progress = 70 // Example progress percentage

    const [copied, setCopied] = useState(false)
    const number = 'WBRERA/P/NOR/2023/000063'

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
        <section className='p-5 lg:p-10 mx-auto flex flex-col'>
            <h1 className='text-xl md:text-4xl font-bold mb-5'>
                Town Square - Key Metrics
            </h1>
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
                        <LandPlot className="text-white w-6 h-6 font-bold" />
                        <span className="text-base sm:text-lg font-semibold">6.29 Acre</span>
                        <span className="text-xs text-white/80">Total Land Area</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <House className="text-white w-6 h-6 font-bold" />
                        <span className="text-base sm:text-lg font-semibold">Apartment</span>
                        <span className="text-xs text-white/80">Residence Typology</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <TentTree className="text-white w-6 h-6 font-bold" />
                        <span className="text-base sm:text-lg font-semibold">1,815 - 3,953 sq ft</span>
                        <span className="text-xs text-white/80">Remaining</span>
                    </div>
                </div>

                {/* 3 Column Stats Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-3 sm:px-5 py-2">
                    <div className="flex flex-col gap-1">
                        <Cuboid className="text-white w-6 h-6 font-bold" />
                        <span className="text-base sm:text-lg font-semibold">7</span>
                        <span className="text-xs text-white/80">Total No. of Blocks</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Combine className="text-white w-6 h-6 font-bold" />
                        <span className="text-base sm:text-lg font-semibold">B+G+15, B+G+19, B+G+24</span>
                        <span className="text-xs text-white/80">Floors</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Boxes className="text-white w-6 h-6 font-bold" />
                        <span className="text-base sm:text-lg font-semibold">300</span>
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
    )
}
