'use client';

import React, { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react'; 


const Navbar = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // State for loading user data

    // Safely read localStorage on client
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Set the username and capitalize the first letter for better UI
                    setUserName(parsedUser.name ? parsedUser.name.charAt(0).toUpperCase() + parsedUser.name.slice(1) : null);
                } catch {
                    setUserName(null);
                }
            }
            setIsLoading(false); // Finished checking localStorage
        }
    }, []);
    // UI Improvement: Placeholder for user name while loading
    const userDisplay = isLoading ? (
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div> // Skeleton loading effect
    ) : userName ? (
        <span className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <UserCircle className="w-6 h-6 text-blue-500" />
            <span className="hidden sm:inline">Hello, {userName}</span>
            <span className="sm:hidden">{userName.split(' ')[0]}</span> {/* Display first name only on small screen */}
        </span>
    ) : (
        <span className="text-gray-500">Guest User</span>
    );

    return (
        <nav className="w-full sticky top-0 bg-white z-40 border-b border-gray-200 rounded-lg">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

                {/* User Information */}
                <div className="flex items-center">
                    {userDisplay}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;