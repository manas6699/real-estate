// components/Activity.tsx
'use client';
import { ArrowDown } from 'lucide-react';

import React from 'react';

export default function Activity() {
    return (
        <aside className="bg-white rounded-xl shadow p-4 w-full md:w-1/4 lg:w-1/5">
            <h2 className="text-xl font-bold mb-4">Activity</h2>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="font-medium">Oscar Holloway</div>
                    <div className="text-sm text-gray-500">Telecaller</div>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className='text-xs'>In Call</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="font-medium">Emily Tyler</div>
                    <div className="text-sm text-gray-500">Sales Person</div>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                    <span className='text-xs'>Idle</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="font-medium">Oscar Holloway</div>
                    <div className="text-sm text-gray-500">Telecaller</div>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className='text-xs'>Idle</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="font-medium">Emily Tyler</div>
                    <div className="text-sm text-gray-500">Sales Person</div>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                    <span className='text-xs'>Idle</span>
                </div>
            </div>

            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full">
                <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Send Custom Alert
                </span>
            </button>

            <button className=" text-blue-500 font-extrabold px-4 py-2 rounded-lg w-full mt-4">
                <span className="flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 mr-2 " />
                    View More
                </span>
            </button>
        </aside>
    );
}
