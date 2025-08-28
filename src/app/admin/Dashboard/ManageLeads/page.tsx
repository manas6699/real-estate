import LeadTable from '@/components/AdminComponents/LeadTable'
import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import React from 'react'

const page = () => {
    return (
        <div>
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