'use client'
import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UsersTable from '@/components/AdminComponents/UsersTable';
import { SHOW_ALL_USERS_API } from '@/config/api';

type User = {
    _id: string;
    name: string;
    role: string;
    online: boolean;
    password: string;
    phone?: string;
    createdAt?: string;
};

const Manageuserpage = () => {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get<{ [key: string]: Omit<User, '_id'> }>(
                    SHOW_ALL_USERS_API,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data) {
                    const usersArray: User[] = Object.entries(res.data).map(
                        ([id, user]) => ({
                            _id: id,
                            ...user, // ✅ Now TS knows user is an object
                        })
                    );

                    setUsers(usersArray);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-4 lg:ml-64">
                    <div className="mb-2">

                        <Navbar />
                    </div>
                    <div className="flex">

                        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
                    </div>
                    <h1 className="text-xl font-semibold mb-6 text-gray-600">
                        Create a user
                        <button className="ml-2 inline-block  bg-gray-200 rounded-full px-2">
                            +
                        </button>
                    </h1>
                    <UsersTable data={users} />

                </div>
            </main>
        </div>
    )
}

export default Manageuserpage