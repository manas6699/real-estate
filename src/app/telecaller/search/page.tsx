'use client'

import Navbar from '@/components/AdminComponents/Navbar'
import InventoryTable from '@/components/TelecallerComponents/InventoryTable'
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'


const InventoryPage = () => {

    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <h1 className='text-xl text-gray-700 font-bold mb-4'>
                    Search Inventory
                </h1>
                <InventoryTable/>
            </section>
        </>
    )
}

export default InventoryPage