'use client';

import { useState } from 'react';

import {
    LayoutDashboard,
    ClipboardList,
    // CalendarClock,
    Calendar1Icon,
    // BarChart3,
    Menu,
    X
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
                    <h2 className="text-xl font-bold mb-10">Telecaller Panel</h2>
                    <nav className="flex flex-col gap-10">
                        <a href="/telecaller/Dashboard" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/Dashboard' ? 'text-pink-600 font-extrabold' : ''
                            }`} >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="text-base font-medium">Dashboard</span>
                        </a>
                        <a href="/telecaller/Calender" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/Calender' ? 'text-pink-600 font-extrabold' : ''
                            }`} >
                            <Calendar1Icon className="w-5 h-5" />
                            <span className="text-base font-medium">My Calendar</span>
                        </a>
                        <a href="/telecaller/processed" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/processed' ? 'text-pink-600 font-extrabold' : ''
                            }`} >
                            <ClipboardList className="w-5 h-5" />
                            <span className="text-base font-medium">Processed Leads</span>
                        </a>
                        <a href="/telecaller/OldReport" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/OldReport' ? 'text-pink-600 font-extrabold' : ''
                            }`} >
                            <ClipboardList className="w-5 h-5" />
                            <span className="text-base font-medium">Old Leads</span>
                        </a>
                      
                        {/* <a href="/telecaller/follow-ups" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/follow-ups' ? 'text-pink-600 font-extrabold' : ''
                            }`} >
                            <CalendarClock className="w-5 h-5" />
                            <span className="text-base font-medium">Follow-ups Due</span>
                        </a>
                        <a href="/telecaller/performance" className={`flex items-center space-x-2 text-lg font-medium ${pathname === '/telecaller/performance' ? 'text-pink-600 font-extrabold' : ''
                            }`} >
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-base font-medium">Performance</span>
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



