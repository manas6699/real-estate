'use client';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import Performance from '@/components/SupervisorComponents/Performance'

const ReportPage = () => {
    return (
        <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 lg:ml-64 p-6 overflow-x-hidden">
                <Navbar />
                {/* Header */}
                <div className="flex mt-4 mb-4">
                    <h1 className="text-2xl font-bold">🚀 Performance</h1>
                </div>
                <Performance />
            </div>
        </main>
    );
};

export default ReportPage;
