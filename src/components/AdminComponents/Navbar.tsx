// Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { LogOut, UserCircle } from 'lucide-react'; // Added UserCircle
import { useRouter } from 'next/navigation';


const Navbar = () => {
    const router = useRouter();
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

    const handleLogout = async () => {
        try {
            // Local storage cleanup
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // --- Server Logout Logic (If needed) ---
            // await axios.post(`${API_BASE_URL}/auth/logout`, {}); 

            // Redirect to login after successful logout
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
            // Even if the server call fails, we clear local storage and redirect for security/UX
            router.push('/login');
        }
    };

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

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition duration-200 
                               bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">Log Out</span> {/* Hidden on mobile, shown on tablet/desktop */}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;