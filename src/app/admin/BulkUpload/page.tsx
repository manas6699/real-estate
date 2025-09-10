import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import BulkUploadPage from '@/components/AdminComponents/csvUpload';


const InsertLeadPage = () => {

    return (
        <div>
            <Navbar />
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-4">
                    <BulkUploadPage />
                </div>
            </main>
        </div>
    )
}

export default InsertLeadPage;
