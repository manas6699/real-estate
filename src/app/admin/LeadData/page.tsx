"use client";

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import LeadTable from '@/components/LeadTable';
import Logo from '../../../../public/assets/logo-transparent.png'
import Footer from '@/components/Footer';

import LeadCards from '@/components/LeadCards';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function LeadsPage() {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            if (!token) {
                throw new Error('Token not found in cookies');
            }

            await axios.post(
               `${API_BASE_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            // Redirect to login after successful logout
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };
    

    return (
        <>
            <nav className="w-full bg-white shadow-md py-3">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image src={Logo} alt="Logo" width={50} height={50} />
                    </Link>

                    {/* ADMIN PANEL text: hidden on small screens */}
                    <div className="hidden lg:flex items-center gap-2 text-gray-800 font-semibold">
                        ADMIN PANEL
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
            <main className="max-w-6xl mx-auto mt-6 mb-16">
                <LeadCards />
                <h1 className="text-2xl font-semibold  p-6">All Leads</h1>
                <LeadTable />
            </main>
            <Footer phoneNumber='98309 47144' />
        </>
    );


}
