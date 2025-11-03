'use client';

import { useState } from 'react';

import {
    LayoutDashboard,
    ClipboardList,
    Menu,
    X,
    ArrowDownLeft,
    ArrowBigUpDash,
    BadgeAlert,
    Gauge
} from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function TelecallerSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-100 rounded-md shadow-md"
                onClick={toggleSidebar}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-md transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-200 w-64 z-40`}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-10">Supervisor Panel</h2>
                    <nav className="flex flex-col gap-10">
                        <a href="/supervisor/Dashboard" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/supervisor/Dashboard' ? 'text-orange-500 font-extrabold' : ''
                            }`} >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="text-base font-medium">Dashboard</span>
                        </a>
                        <a
                            href="/supervisor/InsertLead"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/supervisor/InsertLead' ? 'text-orange-500 font-extrabold' : ''
                                }`}
                        >
                            <ArrowDownLeft className="w-5 h-5" />
                            <span className="text-base font-medium">Insert Data</span>
                        </a>
                        <a
                            href="/supervisor/BulkUpload"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/supervisor/BulkUpload' ? 'text-orange-500 font-extrabold' : ''
                                }`}
                        >
                            <ArrowBigUpDash className="w-5 h-5" />
                            <span className="text-base font-medium">Bulk Data Upload</span>
                        </a>
                        <a
                            href="/supervisor/BulkAssign"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/supervisor/BulkAssign' ? 'text-orange-500 font-extrabold' : ''
                                }`}
                        >
                            <BadgeAlert className="w-5 h-5" />
                            <span className="text-base font-medium">Unassigned Leads</span>
                        </a>
                        <a href="/supervisor/Report" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/supervisor/Report' ? 'text-orange-500 font-extrabold' : ''
                            }`} >
                            <ClipboardList className="w-5 h-5" />
                            <span className="text-base font-medium">View Report</span>
                        </a>
                        <a href="/supervisor/Performance" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/supervisor/Performance' ? 'text-orange-500 font-extrabold' : ''
                            }`} >
                            <Gauge className="w-5 h-5" />
                            <span className="text-base font-medium">Performance</span>
                        </a>
                        {/* <a href="/telecaller/OldReport" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/OldReport' ? 'text-orange-500 font-extrabold' : ''
                            }`} >
                            <ClipboardList className="w-5 h-5" />
                            <span className="text-base font-medium">Old Leads</span>
                        </a> */}
                    </nav>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}



