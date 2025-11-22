'use client'

import { useParams } from 'next/navigation';
import Navbar from '@/components/AdminComponents/Navbar'
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar'
import InventoryLeadEditForm from '@/components/TelecallerComponents/InventoryLeadEditForm';

const EditInventoryPage = () => {
    // Get the params from the URL
    const params = useParams();
    // The property ID is available as `params.id` because the dynamic route is [id]
    const propertyId = params.slug as string;
    console.log(propertyId)
    return (
        <>
            <TelecallerSidebar />
            <div className='lg:ml-64'>
                <Navbar />
            </div>
            <section className='lg:ml-64 p-6'>
                <h1 className='text-xl text-gray-700 font-bold mb-4'>
                    Edit Inventory
                </h1>
                {/* Pass the propertyId from params */}
                <InventoryLeadEditForm
                    mode="edit"
                    propertyId={propertyId}
                />
            </section>
        </>
    )
}

export default EditInventoryPage