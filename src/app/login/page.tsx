'use client';

import axios from 'axios';

import { useState , useEffect } from 'react';

import Loader from '@/components/loader';
import { API_BASE_URL } from '@/config/api';
import useRoleRedirect from '../hooks/useRoleRedirect';

interface User {
    _id: string;
    name: string;
    phone: string;
    role: 'admin' | 'telecaller' | 'salesperson';
}

export default function LoginPage() {
    
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    

    const [role, setRole] = useState<User['role'] | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsed = JSON.parse(user);
            setRole(parsed.role);
        }
    }, []);

    useRoleRedirect({ role });


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/auth/login`,
                { phone, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                // ✅ Update role to trigger redirect
                setRole(res.data.user.role);
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

                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Panel Login</h2>

                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
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
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            required

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
                            <Loader color="white" />
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
