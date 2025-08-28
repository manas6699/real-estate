// components/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';

import React from 'react';
import { Home, Users, BarChart2, HelpCircle, ArrowDownLeft, BadgeAlert, MonitorCog, BadgeCheck } from 'lucide-react';

export default function Sidebar() {

    const pathname = usePathname();
    return (
        <aside className="flex flex-col justify-between w-full md:w-1/4 lg:w-1/5 rounded-xl m-4 bg-white shadow-md p-4">
            <div>
                <div className="text-2xl font-bold mb-8">LEAD CRM</div>
                <nav className="flex flex-col space-y-8">
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
                        <ArrowDownLeft size={20} /> <span>Insert Lead</span>
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

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-400 text-white mt-4">
                <HelpCircle size={20} /> <span>Support</span>
            </button>
        </aside>
    );
}
