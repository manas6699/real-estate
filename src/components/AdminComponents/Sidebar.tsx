// components/Sidebar.tsx
'use client';

import React from 'react';
import { Home, Users, BarChart2,  HelpCircle } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="flex flex-col justify-between w-full md:w-1/4 lg:w-1/5 rounded-xl m-4 bg-white shadow-md h-screen p-4">
            <div>
                <div className="text-2xl font-bold mb-8">MMR CRM</div>
                <nav className="flex flex-col space-y-8">
                    <a href="#" className="flex items-center space-x-2 text-lg font-medium">
                        <Home size={20} /> <span>Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-lg font-medium">
                        <Users size={20} /> <span>Manage User</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-lg font-medium">
                        <Users size={20} /> <span>Manage Leads</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-lg font-medium">
                        <BarChart2 size={20} /> <span>View Report</span>
                    </a>
                </nav>
                
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-400 text-white mt-4">
                <HelpCircle size={20} /> <span>Support</span>
            </button>
        </aside>
    );
}
