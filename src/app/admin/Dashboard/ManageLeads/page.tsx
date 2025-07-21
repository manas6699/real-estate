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
                    <div className="flex">

                        <h1 className="text-2xl font-bold mb-4">Unassigned Leads</h1>
                        <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                            <text className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                                <span className="text-center">
                                    10
                                </span>
                            </text>
                        </div>
                    </div>
                    <LeadTable assignbtn='not-assigned' />
                </div>
            </main>
        </div>
    )
}

export default page