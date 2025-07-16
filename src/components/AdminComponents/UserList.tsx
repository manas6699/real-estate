// components/Users.tsx
'use client';

import React from 'react';

const users = [
    { name: 'Shawn Stone', role: 'Telecaller' },
    { name: 'Randy Delgado', role: 'Telecaller' },
    { name: 'Emily Tyler', role: 'Sales Person' },
    { name: 'Louis Castro', role: 'Sales Person' },
    { name: 'Blake Silva', role: 'Sales Person' },
    { name: 'Joel Phillips', role: 'Telecaller' },
    { name: 'Wayne Marsh', role: 'Telecaller' },
    { name: 'Oscar Holloway', role: 'Telecaller' },
];

export default function UserList() {
    return (
        <section className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Users</h2>
                <button className="text-blue-600">Assign Leads</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {users.map(user => (
                    <div key={user.name} className="bg-gray-100 rounded p-4 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
