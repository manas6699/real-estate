'use client'

import Navbar from '@/components/AdminComponents/Navbar'
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import InventoryLeadEditForm from '@/components/TelecallerComponents/InventoryLeadEditForm';


const InventoryPage = () => {

    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <h1 className='text-xl text-gray-700 font-bold mb-4'>
                    Inventory
                </h1>
                <InventoryLeadEditForm />
            </section>
        </>
    )
}

export default InventoryPage