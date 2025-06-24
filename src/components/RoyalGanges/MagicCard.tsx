'use client';

import {
    LandPlot,
    House,
    TentTree,
    Cuboid,
    Copy,
    Check,
    Combine,
} from 'lucide-react';
import { useState } from 'react';

export default function MagicCard() {
    const progress = 20;
    const [copied, setCopied] = useState(false);
    const number = 'WBRERA/P/SOU/2025/002901';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <section className="p-5 lg:p-10 mx-auto max-w-6xl">
            <h1 className="text-xl md:text-4xl font-bold mb-6 text-gray-900">
               Primus Ganges  - Key Metrics
            </h1>

            <div className="w-full bg-white rounded-3xl shadow-[0_0_20px_rgba(139,69,19,0.5)] p-6 sm:p-8 transition-all">

                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        Project Status
                    </h2>
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm font-medium">
                        NEW
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Units Sold: <span className="font-semibold text-gray-800">20%</span>
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <StatItem
                        icon={<LandPlot className="text-green-600" />}
                        label="26.53  Acres"
                        subtext="Total Land Area"
                    />
                    <StatItem
                        icon={<House className="text-blue-600" />}
                        label="Residential"
                        subtext="Residence Typology"
                    />
                    <StatItem
                        icon={<TentTree className="text-yellow-600" />}
                        label="1292 - 1535 sq ft"
                        subtext="Super Builtup Area"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <StatItem
                        icon={<Cuboid className="text-purple-600" />}
                        label="136"
                        subtext="Total No. of Units"
                    />
                    {/* <StatItem
                        icon={<Boxes className="text-rose-600" />}
                        label="Villa G + 2 ,Villament G + 4, Apartment G + 27 & G + 29"
                        subtext=""
                    /> */}
                    <StatItem
                        icon={<Combine className="text-cyan-600" />}
                        label="G + 18"
                        subtext="No of floors"
                    />
                </div>

                {/* RERA Copy Box */}
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 max-w-md">
                    <label
                        htmlFor="number"
                        className="text-sm font-semibold text-gray-700"
                    >
                        RERA ID
                    </label>
                    <div className="relative w-full">
                        <input
                            id="number"
                            value={number}
                            readOnly
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            onClick={handleCopy}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                            aria-label="Copy RERA ID"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-600" />
                            ) : (
                                <Copy className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatItem({
    icon,
    label,
    subtext,
}: {
    icon: React.ReactNode;
    label: string;
    subtext: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
            <div>
                <p className="text-base font-semibold text-gray-800">{label}</p>
                <p className="text-sm font-extrabold text-gray-600">{subtext}</p>
            </div>
        </div>
    );
}
