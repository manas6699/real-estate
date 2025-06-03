'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { API_BASE_URL } from '@/config/api';
import Logo from "../../../public/assets/logo-transparent.png";
import axios from 'axios';
import Loader from '@/components/loader';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!phone.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/auth/login`,
                // `http://localhost:8000/api/auth/login`,
                { phone, password },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (res.status === 200) {
                router.push('/admin/LeadData');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login failed');
            } else if (err instanceof Error) {
                setError(err.message || 'An unexpected error occurred');
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <div className='items-center justify-center w-full flex mb-6'>
                    <Image src={Logo} width={50} height={40} alt='logo' priority />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Panel Login</h2>

                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">
                        {error}
                    </p>
                )}

                <div className="mb-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                        pattern="[0-9]{10,15}"
                        title="Please enter a valid phone number"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Loader color='white' />
                            <span className="ml-2">Logging in...</span>
                        </div>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
        </div>
    );
}