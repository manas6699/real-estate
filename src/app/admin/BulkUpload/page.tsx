import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import BulkUpload from '@/components/AdminComponents/csvUpload';


const InsertLeadPage = () => {

    return (
        <div>
            <main className="flex flex-col w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 lg:ml-64 p-6">
                    <div className="mb-2">
                        <Navbar />
                    </div>
                    <BulkUpload />
                </div>
            </main>
        </div>
    )
}

export default InsertLeadPage;
