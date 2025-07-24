// components/Overview.tsx
'use client';

import React from 'react';

export default function Overview() {
    return (
        <>
        <h1 className='text-2xl text-gray-700 font-bold mb-4'>
            Overview
        </h1>
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Leads</div>
                    <div className="text-2xl font-bold">8121</div>
                    <div className="text-green-500">↑ 8.5%</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Not Allotted</div>
                    <div className="text-2xl font-bold">521</div>
                    <div className="text-green-500">↑ 8.5%</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Allotted</div>
                    <div className="text-2xl font-bold">521</div>
                    <div className="text-green-500">↑ 8.5%</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                    <a href="/admin/Dashboard/ManageLeads">Call Pending
                        <div className="text-2xl font-bold">121</div>
                        <div className="text-green-500">↑ 8.5%</div>
                    </a>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Overdue</div>
                    <div className="text-2xl font-bold">11</div>
                    <div className="text-red-500">↓ 8.5%</div>
                </div>
            </section>
            <section className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Hot Leads</div>
                    <div className="text-2xl font-bold">21</div>
                    <div className="text-green-500">↑ 8.5%</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Cold Leads</div>
                    <div className="text-2xl font-bold">521</div>
                    <div className="text-green-500">↑ 8.5%</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Site Visits</div>
                    <div className="text-2xl font-bold">521</div>
                    <div className="text-green-500">↑ 8.5%</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer">
                    Booked
                    <div className="text-2xl font-bold">121</div>
                    <div className="text-green-500">↑ 8.5%</div>

                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="text-gray-600">Sell Closed</div>
                    <div className="text-2xl font-bold">11</div>
                    <div className="text-red-500">↓ 8.5%</div>
                </div>
            </section>
        </>
    );
}
