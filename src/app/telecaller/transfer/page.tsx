import React from 'react'
import Navbar from '@/components/AdminComponents/Navbar'
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'

const page = () => {
    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <h1 className='text-xl text-gray-700 font-bold mb-4'>
                    My Transfered Leads
                </h1>

            </section>
        </>
    )
}

export default page