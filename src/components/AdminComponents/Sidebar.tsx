// components/Sidebar.tsx
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

import {
    Home,
    Users,
    BarChart2,
    ArrowDownLeft,
    BadgeAlert,
    MonitorCog,
    BadgeCheck,
    ArrowBigUpDash,
    X,
    Menu
} from 'lucide-react';

export default function Sidebar() {
    const [isOpen, setisOpen] = useState(false);

    const pathname = usePathname();
    const toggleSidebar = () => {
        setisOpen(!isOpen);
    };
    return (
        <div>
            {/* Mobile toggle button */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-100 rounded-md shadow-md"
                onClick={toggleSidebar}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />
                }
            </button>
            <></>
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-md transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-200 w-64 z-40`}
            >
                <div className='p-6'>
                    <div className="text-2xl font-bold mb-8">LEAD CRM</div>
                    <nav className="flex flex-col space-y-6">
                        <a
                            href="/admin/Dashboard"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/Dashboard' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <Home size={20} /> <span>Dashboard</span>
                        </a>
                        <a
                            href="/admin/InsertLead"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/InsertLead' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <ArrowDownLeft size={20} /> <span>Insert Data</span>
                        </a>
                        <a
                            href="/admin/BulkUpload"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/BulkUpload' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <ArrowBigUpDash size={20} /> <span>Bulk Data Upload</span>
                        </a>
                        <a
                            href="/admin/Campaign"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/Campaign' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <MonitorCog size={20} /> <span>Manage Campaign</span>
                        </a>
                        <a
                            href="/admin/ManageUser"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/ManageUser' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <Users size={20} /> <span>Manage User</span>
                        </a>
                        <a
                            href="/admin/Dashboard/ManageLeads"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/Dashboard/ManageLeads' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <BadgeAlert size={20} /> <span>Unassigned Leads</span>
                        </a>
                        <a
                            href="/admin/Dashboard/assigned"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/Dashboard/assigned' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <BadgeCheck size={20} /> <span>Assigned Leads</span>
                        </a>
                        <a
                            href="/admin/Dashboard/Report"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/Dashboard/Report' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <BarChart2 size={20} /> <span>View Report</span>
                        </a>
                        <a
                            href="/admin/Dashboard/Report/old"
                            className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/admin/Dashboard/Report/old' ? 'bg-blue-50 text-blue-600 rounded-lg px-2 py-1' : ''
                                }`}
                        >
                            <BarChart2 size={20} /> <span>View Old Leads</span>
                        </a>
                    </nav>
                </div>


            </aside>
        </div>
    );
}
