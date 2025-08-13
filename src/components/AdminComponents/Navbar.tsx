'use client';


import React, { useEffect, useState } from 'react';

import { LogOut } from 'lucide-react';

import { useRouter } from 'next/navigation';


const Navbar = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    // ✅ Safely read localStorage on client
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUserName(parsedUser.name || null);
                } catch {
                    setUserName(null);
                }
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
           

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // await axios.post(
            //     `${API_BASE_URL}/auth/logout`,
            //     {},
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //         withCredentials: true,
            //     }
            // );

            // Redirect to login after successful logout
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <nav className="w-full bg-white shadow-md py-3">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* ADMIN PANEL text: hidden on small screens */}
                <div className="hidden lg:flex items-center gap-2 text-gray-800 font-semibold">
                    {userName ? `Hello ${userName} 🚀` : 'Loading...'}
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-400 hover:text-red-600 transition cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
