// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Home, Users, ArrowDownLeft, BadgeAlert, MonitorCog, BadgeCheck, ArrowBigUpDash, X, Menu, LineChart, Clock,
    Gauge
} from 'lucide-react';

// --- Menu Item Definition with Colors ---
// We've added iconBg and iconColor to make each icon unique and colorful.
const navItems = [
    { href: '/admin/Dashboard', icon: Home, label: 'Dashboard', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { href: '/admin/InsertLead', icon: ArrowDownLeft, label: 'Insert Data', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { href: '/admin/InsertLead/Inventory', icon: ArrowDownLeft, label: 'Inventory', iconBg: 'bg-amber-100', iconColor: 'text-green-600' },
    { href: '/admin/BulkUpload', icon: ArrowBigUpDash, label: 'Bulk Upload', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
    { href: '/admin/Campaign', icon: MonitorCog, label: 'Campaigns', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { href: '/admin/ManageUser', icon: Users, label: 'Manage User', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { href: '/admin/Dashboard/ManageLeads', icon: BadgeAlert, label: 'Unassigned Leads', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    { href: '/admin/Dashboard/assigned', icon: BadgeCheck, label: 'Assigned Leads', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { href: '/admin/Dashboard/Report', icon: LineChart, label: 'Report', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { href: '/admin/Performance', icon: Gauge, label: 'Performance', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
    { href: '/admin/Dashboard/Report/old', icon: Clock, label: 'Old Leads', iconBg: 'bg-gray-200', iconColor: 'text-gray-600' },
];

// --- Component ---
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // --- Styling Definitions ---
    // Base styling for all links
    const baseLinkClasses = "flex items-center space-x-3 p-3 text-sm rounded-lg font-medium text-gray-700 transition-all duration-150 hover:bg-gray-100";
    // Active styling for the current link: subtle gradient, stronger font, and a left border
    const activeLinkClasses = "bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 font-semibold shadow-md border-l-4 border-orange-500";
    // Base styling for the icons
    const baseIconClasses = "p-1.5 rounded-lg shadow-sm";

    return (
        <>
            {/* Mobile toggle button (Hamburger/X) - Now with a gradient! */}
            <button
                className="lg:hidden fixed bottom-4 right-4 z-[60] p-3 text-white bg-gradient-to-br from-orange-400 to-pink-500 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay (Darkens background when sidebar is open) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden"
                    onClick={toggleSidebar} // Close sidebar on overlay click
                />
            )}

            {/* Sidebar Element */}
            {/* * CHANGE: I've replaced 'custom-scrollbar' with 'sexy-sidebar-scrollbar'
              * The styles for this new class are defined at the bottom of this file.
            */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 w-64 z-50 overflow-y-auto sexy-sidebar-scrollbar`}
            >
                <div className="p-6 h-full flex flex-col">

                    {/* Header/Logo - More stylized */}
                    <div className="text-2xl font-bold text-gray-800 mb-10">
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent text-4xl font-extrabold">C</span>
                        RM
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-2 flex-grow">
                        {navItems.map(item => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon; // Component from lucide-react

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
                                    onClick={() => { if (isOpen) toggleSidebar(); }} // Close sidebar on link click (mobile)
                                >
                                    <div className={`${baseIconClasses} ${isActive ? 'shadow-none' : item.iconBg}`}>
                                        <Icon
                                            size={22}
                                            className={isActive ? 'text-orange-600' : item.iconColor}
                                        />
                                    </div>
                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* * ADDED: Here are the scrollbar styles, applied "in place" as requested.
              * This <style jsx global> tag is a Next.js feature that will inject
              * these styles globally, allowing them to style the scrollbar.
            */}
            <style jsx global>{`
                /* For Webkit browsers (Chrome, Safari, Edge) */
                .sexy-sidebar-scrollbar::-webkit-scrollbar {
                  width: 8px; /* Width of the scrollbar - MADE THINNER */
                }

                .sexy-sidebar-scrollbar::-webkit-scrollbar-track {
                  background: transparent; /* Makes the track invisible */
                }

                .sexy-sidebar-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #fb923c; /* This is tailwind's orange-400 */
                  border-radius: 20px;
                  /* Adds a "padding" effect around the thumb - BORDER REDUCED */
                  border: 2px solid #ffffff; 
                }

                .sexy-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #f97316; /* This is tailwind's orange-500 */
                }

                /* For Firefox */
                .sexy-sidebar-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #fb923c #ffffff; /* thumb color track color */
                }
            `}</style>
        </>
    );
}