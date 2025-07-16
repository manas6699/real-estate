// components/Overview.tsx
'use client';

import React from 'react';

export default function Overview() {
    return (
        <section className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="text-gray-600">Total Leads</div>
                <div className="text-2xl font-bold">121</div>
                <div className="text-green-500">↑ 8.5%</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="text-gray-600">Total Leads Today</div>
                <div className="text-2xl font-bold">11</div>
                <div className="text-red-500">↓ 8.5%</div>
            </div>
        </section>
    );
}
