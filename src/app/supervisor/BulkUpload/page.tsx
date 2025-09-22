'use client';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/SupervisorComponents/Sidebar'
import BulkUpload from '@/components/SupervisorComponents/CsvUpload';



const BulkUploadPage = () => {


    return (
        <div>
            <main className="flex flex-col w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1 gap-4 lg:ml-64 p-6">
                    <div className="flex flex-col flex-1 gap-4">
                        <Navbar />
                        <div className="flex-1 p-4">
                            <BulkUpload />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default BulkUploadPage;
