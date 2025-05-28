'use client';

import React from 'react';
import { Sparkles } from 'lucide-react'; 

const GeminiButton: React.FC = () => {
    return (
        <a href="/admin/ManagePages">
            <button className="group relative  flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-700 via-violet-600 to-fuchsia-500 text-white font-semibold shadow-md hover:shadow-[0_0_15px_#a855f7] transition-all duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 cursor-pointer">
                <Sparkles className="w-5 h-5 text-white group-hover:animate-pulse transition-transform duration-300" />
                <span className="text-sm sm:text-base">Manage Pages</span>
                <span className="absolute -inset-0.5 rounded-lg blur-sm opacity-5  transition-all duration-300 bg-gradient-to-r from-blue-700 via-violet-600 to-fuchsia-500"></span>
            </button>
        </a>
    );
};

export default GeminiButton;
