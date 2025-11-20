'use client';
import Navbar from '@/components/AdminComponents/Navbar';
import Sidebar from '@/components/AdminComponents/Sidebar';

const InsertInventoryLeadPage = () => {
    return (
        <div>
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1 gap-4 mb-2 lg:ml-64 p-6">
                    <Navbar />
                    {/* The title remains "Insert Inventory" */}
                    <h2 className="text-xl font-bold">Insert Inventory </h2>
                </div>
            </main>
        </div>
    );
};

export default InsertInventoryLeadPage;