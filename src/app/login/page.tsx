'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
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
    const [token, setToken] = useState<string | null>(null);

    // ✅ Safe localStorage access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (user) {
                const parsed = JSON.parse(user);
                setRole(parsed.role);
            }
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, []);

    // ✅ Redirect only in browser and with token check
    useRoleRedirect({ role, token });

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
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (res.status === 200) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
                setRole(res.data.user.role);
                setToken(res.data.token);
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
        <div className="flex min-h-screen justify-center items-center bg-gray-950">
            <form onSubmit={handleLogin} className="bg-white p-16 rounded-md shadow-md w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4"> Log-In</h2>
                {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

                <div className="mb-3">
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2"
                        required
                        pattern="[0-9]{10,15}"
                        title="Please enter a valid phone number"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-3 text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 mt-4 cursor-pointer rounded hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
