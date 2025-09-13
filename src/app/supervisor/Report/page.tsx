'use client';


import React from 'react';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/SupervisorComponents/Sidebar'


const InsertLeadPage = () => {




    return (
        <div>
            <main className="flex flex-col w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1 gap-4 lg:ml-64 p-6">
                    <div className="flex flex-col flex-1 gap-4">
                        <Navbar />
                        <h1 className='text-2xl font-extrabold ml-8'>
                            Supervisor Report
                        </h1>
                        <div className='flex justify-center text-center h-95 items-center'>
                            <p className='text-2xl text-orange-400' >
                                Nothing to see for now
                            </p>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default InsertLeadPage;
