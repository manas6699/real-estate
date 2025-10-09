import React from 'react'
import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import LeadTable from '@/components/AdminComponents/LeadTable'

const page = () => {
    return (
        <div className="flex flex-col flex-1 gap-4 lg:ml-64 p-6">
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-4">
                    <LeadTable assignbtn='not-assigned' />
                </div>
            </main>
        </div>
    )
}

export default page