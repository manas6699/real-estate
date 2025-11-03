// components/Sidebar.tsx
'use client';

import Link from 'next/link'; 
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Home, Users, ArrowDownLeft, BadgeAlert, MonitorCog, BadgeCheck, ArrowBigUpDash, X, Menu, LineChart, Clock,
    Gauge
} from 'lucide-react';

// --- Menu Item Definition for cleaner code ---
const navItems = [
    { href: '/admin/Dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/InsertLead', icon: ArrowDownLeft, label: 'Insert Data' },
    { href: '/admin/BulkUpload', icon: ArrowBigUpDash, label: 'Bulk Upload' },
    { href: '/admin/Campaign', icon: MonitorCog, label: 'Campaigns' },
    { href: '/admin/ManageUser', icon: Users, label: 'Manage User' },
    { href: '/admin/Dashboard/ManageLeads', icon: BadgeAlert, label: 'Unassigned Leads' },
    { href: '/admin/Dashboard/assigned', icon: BadgeCheck, label: 'Assigned Leads' },
    { href: '/admin/Dashboard/Report', icon: LineChart, label: 'Report' },
    { href: '/admin/Performance', icon: Gauge, label: 'Performance' },
    { href: '/admin/Dashboard/Report/old', icon: Clock, label: 'Old Leads' },
];

// --- Component ---
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Base styling for all links
    const baseLinkClasses = "flex items-center space-x-3 p-3 rounded-xl font-semibold text-gray-600 transition-colors duration-150 hover:bg-yellow-100 hover:text-gray-900";
    // Active styling for the current link
    const activeLinkClasses = "text-gray-700 bg-gray-100 shadow border-l-4 border-r-4 border-orange-400";

    return (
        <>
            {/* Mobile toggle button (Hamburger/X) */}
            <button
                className="lg:hidden fixed bottom-4 right-4 z-[60] p-2 text-gray-800 bg-white rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay (Darkens background when sidebar is open) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-50 lg:hidden"
                    onClick={toggleSidebar} // Close sidebar on overlay click
                />
            )}

            {/* Sidebar Element */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 w-64 z-50 overflow-y-auto`}
            >
                <div className="p-6 h-full flex flex-col">

                    {/* Header/Logo */}
                    <div className="text-xl font-extrabold text-slate-500 mb-8">
                        <span className="text-gray-900 text-4xl">C</span> RM
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-1 flex-grow">
                        {navItems.map(item => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon; // Component from lucide-react

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
                                    onClick={toggleSidebar} // Close sidebar on link click (mobile)
                                >
                                    <Icon
                                        size={25}
                                        className="bg-gray-800 shadow-2xl rounded-full text-white"
                                    />
                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}