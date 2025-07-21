'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ASSIGN_API,  GET_ALL_TELECALLERS_API } from '@/config/api';

type Telecaller = {
    id: string;
    name: string;
    phone: string;
    role: string;
};

type AssignModalProps = {
    onClose: () => void;
    leadId: string;
};

export default function AssignModal({ onClose, leadId }: AssignModalProps) {
    const [telecallers, setTelecallers] = useState<Telecaller[]>([]);

    const [selectedTelecaller, setSelectedTelecaller] = useState<Telecaller | null>(null);
    const [remarks, setRemarks] = useState('');
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchTelecallers = async () => {
            try {
                const response = await axios.get(GET_ALL_TELECALLERS_API);
                console.log('Fetched telecallers:', response.data);
                setTelecallers(response.data.data);
            } catch (error) {
                console.error('Error fetching telecallers:', error);
            }
        };

        fetchTelecallers();
    }, []);

    const handleAssignClick = (telecaller: Telecaller) => {
        setSelectedTelecaller(telecaller);
        setAssigningId(telecaller.id);
    };

    const handleSubmit = async () => {
        if (!selectedTelecaller) {
            alert('Please select a telecaller.');
            return;
        }

        setSubmitLoading(true);

        const historyMessage = `${leadId} has been assigned to ${selectedTelecaller.name} (${selectedTelecaller.role}) at ${new Date().toISOString()} with remarks: "${remarks}"`;

        try {
            const response = await axios.post(ASSIGN_API, {
                lead_id: leadId,
                telecaller_id: selectedTelecaller.id,
                telecaller_name: selectedTelecaller.name,
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
                    <button className="flex-1 bg-orange-500 text-white py-2 rounded-l-full">
                        Assign a Telecaller
                    </button>
                    <button className="flex-1 bg-transparent text-gray-500 py-2 rounded-r-full border border-gray-200">
                        Assign a SalesPerson
                    </button>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full border border-gray-300 rounded-full pl-10 py-2"
                        />
                        <span className="absolute left-4 top-2.5 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>

                <div className="mb-4 max-h-48 overflow-y-auto">
                    <ul className="space-y-2">
                        {telecallers.map((telecaller) => (
                            <li
                                key={telecaller.id}
                                className={`flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer ${assigningId === telecaller.id ? 'bg-green-100' : ''
                                    }`}
                            >
                                <span>{telecaller.name}</span>
                                <button
                                    disabled={assigningId === telecaller.id}
                                    onClick={() => handleAssignClick(telecaller)}
                                    className={`${assigningId === telecaller.id
                                        ? 'bg-gray-400'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white px-3 py-1 rounded`}
                                >
                                    {assigningId === telecaller.id ? 'Selected' : 'Assign'}
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
                    disabled={!selectedTelecaller || submitLoading}
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
                >
                    {submitLoading ? 'Assigning...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}
