'use client';

import { useState } from 'react';

const tabs = ['Buy',  'Rent'];
// const types = ['All Type', 'Apartment', 'Villa', 'Plot'];

export default function HomeSearchBar() {
    const [selectedTab, setSelectedTab] = useState('Buy');
    // const [keyword, setKeyword] = useState('');
    // const [selectedType, setSelectedType] = useState('All Type');

    return (
        <div className="flex flex-col items-center w-full px-4 py-8">
            {/* Heading */}
            <p className="text-sm text-gray-600 mb-1">
                We’ve more than 745,000 apartments, place & plot.
            </p>
            <h1 className="text-2xl md:text-4xl font-semibold text-green-800 mt-6 mb-6"> Find Your
                <span className=' text-green-700 px-4 text-6xl'>
                    Perfect
                </span>
                Home
            </h1>

            {/* Tabs */}
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-11 rounded-xl mr-3  py-2 font-medium transition cursor-pointer ${selectedTab === tab
                            ? 'bg-yellow-400 text-black'
                            : 'bg-black text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-stretch gap-4 w-full max-w-5xl mx-auto">
                {/* Location Filter */}
                <input
                    type="text"
                    placeholder="Location"
                    className="flex-1 px-5 py-3 text-black rounded-full border border-gray-300 outline-none text-sm"
                />

                {/* Custom Dropdowns */}
                {[
                    {
                        name: 'Price Range',
                        options: [
                            { label: '₹50L - ₹1Cr', value: '50-100' },
                            { label: '₹1Cr - ₹2Cr ', value: '101-200' },
                            { label: '₹2Cr - ₹3Cr ', value: '201-300' },
                            { label: '₹3Cr - ₹4Cr ', value: '301-400' },
                            { label: '₹4Cr - ₹5Cr ', value: '401-500' },
                            { label: '₹5Cr - ₹20Cr ', value: '501-2000' },
                        ],
                    },
                    {
                        name: 'Type of Property',
                        options: [
                            { label: 'Flat', value: 'flat' },
                            { label: 'Bungalaw', value: 'Bungalaw' },
                        ],
                    },
                   
                ].map((dropdown, idx) => (
                    <div className="relative w-full md:w-auto" key={idx}>
                        <select
                            className="appearance-none w-full md:w-auto px-5 py-3 rounded-full border border-gray-300 text-sm pr-10 bg-white text-gray-700"
                        >
                            <option value="">{dropdown.name}</option>
                            {dropdown.options.map((opt, i) => (
                                <option value={opt.value} key={i}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                ))}

               

                {/* Search Button */}
                <button className="bg-yellow-400 text-black font-medium px-5 py-2 rounded-md hover:bg-yellow-500 text-sm">
                    Search
                </button>
            </div>
        </div>
    );
}
