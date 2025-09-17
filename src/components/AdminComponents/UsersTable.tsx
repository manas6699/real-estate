'use client';

import React from 'react';
import {
    
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';

type User = {
    _id: string;
    name: string;
    role: string;
    online: boolean;
    phone?: string;
    createdAt?: string;
};

interface Props {
    data: User[];
}

export default function UsersTable({ data }: Props) {
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'username',
            header: 'User Name',
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {table.getRowModel().rows.map(row => {
                const user = row.original;

                return (
                    <div
                        key={user._id}
                        className="flex flex-wrap justify-between items-center bg-white rounded-2xl shadow p-6"
                    >
                        <div className="flex flex-col text-xs text-gray-500 mb-2">
                            <span className="font-medium text-black">User Name</span>
                            <span>{user.name}</span>
                        </div>

                        <div className="flex flex-col text-xs text-gray-500 mb-2">
                            <span className="font-medium text-black">Role</span>
                            <span>{user.role}</span>
                        </div>

                        <div className="flex flex-col text-xs text-gray-500 mb-2">
                            <span className="font-medium text-black">Phone</span>
                            <span>{user.phone}</span>
                        </div>

                        <div className="flex flex-col text-xs text-gray-500 mb-2">
                            <span className="font-medium text-black">Password</span>
                            <span>
                                *********
                                </span>
                        </div>
                        <button className="px-6 py-0.5 font-extrabold text-xs rounded-md bg-yellow-400 text-white">
                            Change Password
                        </button>
                        <button className="px-6 py-0.5 font-extrabold text-xs rounded-md bg-red-500 text-white">
                            Delete User
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
