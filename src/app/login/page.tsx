'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { API_BASE_URL } from '@/config/api';

import Logo from "../../../public/assets/logo-transparent.png"

import axios from 'axios';

import Loader from '@/components/loader';

export default function LoginPage() {
    const [loading , setLoading] = useState(false);
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await  axios.post(
            `${API_BASE_URL}/auth/login`,
            { phone, password },
            {
                withCredentials: true, // ✅ Very important to receive cookies
                headers: {
                    'Content-Type': 'application/json',
                },
            }
          );

          // set cookies
        console.log('token from login page : ', res.data.token);
        document.cookie = `token=${res.data.token}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict`;


        if (res.status === 200) {
            // Login successful, redirect to admin panel
            router.push('/admin/LeadData');

        }
        else {
            // Handle login error
            setError('Login failed. Please check your credentials.');
        }

    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <div className='items-center justify-center w-full flex mb-6'>
                    <Image src={Logo} width={50} height={40} alt='logo'/>
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Panel Login</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input
                    type="number"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Loader color='white' />
                        </div>
                    ) : (
                        <>Submit</>
                    )}
                </button>
            </form>
        </div>
    );
}
