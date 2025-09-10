'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import sortTelecallerList from '@/utils/sortTelecallerList';
import { ASSIGN_API, GET_ALL_TELECALLERS_API, GET_ALL_SALES_PERSONS_API } from '@/config/api';

type User = {
    id: string;
    name: string;
    // phone: string;
    role: string;
};

type AssignModalProps = {
    onClose: () => void;
    leadId: string;
};

export default function AssignModal({ onClose, leadId }: AssignModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [remarks, setRemarks] = useState('');
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'telecaller' | 'salesperson'>('telecaller');


    const fetchUsers = React.useCallback(async () => {
        try {
            const apiUrl =
                activeTab === 'telecaller' ? GET_ALL_TELECALLERS_API : GET_ALL_SALES_PERSONS_API;
            const response = await axios.get(apiUrl);
            console.log(`Fetched ${activeTab}s:`, response.data);
            setUsers(sortTelecallerList(response.data.data));
            // Clear previous selection when switching tabs
            setSelectedUser(null);
            setAssigningId(null);
        } catch (error) {
            console.error(`Error fetching ${activeTab}s:`, error);
        }
    }, [activeTab]);
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAssignClick = (user: User) => {
        setSelectedUser(user);
        setAssigningId(user.id);
    };

    const handleSubmit = async () => {
        if (!selectedUser) {
            alert('Please select someone to assign.');
            return;
        }

        setSubmitLoading(true);

        const historyMessage = `${leadId} has been assigned to ${selectedUser.name} (${selectedUser.role}) at ${new Date().toISOString()} with remarks: "${remarks}"`;

        try {
            const response = await axios.post(ASSIGN_API, {
                lead_id: leadId,
                assignee_id: selectedUser.id,
                assignee_name: selectedUser.name,
                remarks,
                history: [historyMessage],
            });

            console.log('Assign response:', response.data);

            alert('Lead assigned successfully!');
            window.location.reload();
            onClose();
        } catch (error) {
            console.error('Error assigning lead:', error);
            alert('Error assigning lead.');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 text-xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4">Assign Lead to someone</h2>

                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 rounded-l-full ${activeTab === 'telecaller'
                            ? 'bg-orange-500 text-white'
                            : 'bg-transparent text-gray-500 border border-gray-200'
                            }`}
                        onClick={() => setActiveTab('telecaller')}
                    >
                        Assign a Telecaller
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-r-full ${activeTab === 'salesperson'
                            ? 'bg-orange-500 text-white'
                            : 'bg-transparent text-gray-500 border border-gray-200'
                            }`}
                        onClick={() => setActiveTab('salesperson')}
                    >
                        Assign a SalesPerson
                    </button>
                </div>
                <div className="mb-4 max-h-48 overflow-y-auto">
                    <ul className="space-y-2">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className={`flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer ${assigningId === user.id ? 'bg-green-100' : ''
                                    }`}
                            >
                                <span>{user.name}</span>
                                <button
                                    disabled={assigningId === user.id}
                                    onClick={() => handleAssignClick(user)}
                                    className={`${assigningId === user.id
                                        ? 'bg-gray-400'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white px-3 py-1 rounded`}
                                >
                                    {assigningId === user.id ? 'Selected' : 'Assign'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-600 mb-1 block">Add Remarks</label>
                    <textarea
                        className="w-full border border-gray-200 rounded p-2"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter remarks (optional)"
                    ></textarea>
                </div>

                <button
                    disabled={!selectedUser || submitLoading}
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
                >
                    {submitLoading ? 'Assigning...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}
