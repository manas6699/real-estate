import axios from 'axios';
import React from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { LogOut } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import Logo from '../../../public/assets/logo-transparent.png'

const Navbar = () => {

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
    </>
  )
}

export default Navbar