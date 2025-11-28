'use client';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { GET_FILTERED_DATA } from '@/config/api';

type LeadDetails = {
    name: string;
    email: string;
    phone: string;
    source: string;
    projectSource: string;
    lead_status: string;
    lead_type: string;
};

type LeadItem = {
    _id: string;
    lead_details: LeadDetails;
    assignee_name: string;
    remarks: string;
    updatedAt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history: any[];
};

type DayEndStats = {
    booked: number;
    visitedFollowUp: number;
    visitFixed: number;
    followUp: number;
    callback: number
};

const initialDayEndStats: DayEndStats = {
    booked: 0,
    visitedFollowUp: 0,
    visitFixed: 0,
    followUp: 0,
    callback: 0
};

// ✅ Helper: format today's date (YYYY-MM-DD) in IST
const getTodayDate = (): string => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    return istDate.toISOString().split('T')[0];
};

const DayEndReport: React.FC = () => {
    const [stats, setStats] = useState<DayEndStats>(initialDayEndStats);
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<Record<string, LeadItem[]>>({});
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const fetchDayEndStats = useCallback(async () => {
        try {
            setLoading(true);
            const today = getTodayDate();

            const queries = [
                { key: 'booked', label: 'Booked', url: `${GET_FILTERED_DATA}?lead_status=Booked&updatedStartDate=${today}&updatedEndDate=${today}` },
                { key: 'visitedFollowUp', label: 'Visited Followup', url: `${GET_FILTERED_DATA}?lead_status=Visited Followup&updatedStartDate=${today}&updatedEndDate=${today}` },
                { key: 'visitFixed', label: 'Site Visit Fixed', url: `${GET_FILTERED_DATA}?lead_status=Site Visit Fixed&updatedStartDate=${today}&updatedEndDate=${today}` },
                { key: 'followUp', label: 'Under Follow Up', url: `${GET_FILTERED_DATA}?lead_status=Under Follow Up&updatedStartDate=${today}&updatedEndDate=${today}` },
                { key: 'callback', label: 'callback', url: `${GET_FILTERED_DATA}?lead_status=Call Back&updatedStartDate=${today}&updatedEndDate=${today}` },
            ];

            const results = await Promise.all(
                queries.map(async ({ key, url }) => {
                    try {
                        const res = await axios.get(url);
                        if (res.data.success) {
                            return { key, count: res.data.count, data: res.data.data };
                        }
                        return { key, count: 0, data: [] };
                    } catch {
                        return { key, count: 0, data: [] };
                    }
                })
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newStats: any = {};
            const newDetails: Record<string, LeadItem[]> = {};

            results.forEach(({ key, count, data }) => {
                newStats[key] = count;
                newDetails[key] = data;
                // new details -> data results details -> count data
            });
            setStats(newStats);
            setDetails(newDetails);
        } catch (error) {
            console.error('Error fetching day end report:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDayEndStats();
    }, [fetchDayEndStats]);

    const handleCardClick = (key: string) => {
        if (details[key]?.length > 0) setSelectedKey(key);
    };

    const closeModal = () => setSelectedKey(null);

    return (
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Day End Report ({getTodayDate()})
            </h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-sm font-medium">Fetching todays Report...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(stats).map(([key, value]) => (
                        <div
                            key={key}
                            onClick={() => handleCardClick(key)}
                            className="cursor-pointer border border-gray-300 rounded-xl p-4 bg-green-50 hover:bg-blue-50 transition-shadow hover:shadow-md"
                        >
                            <p className="text-gray-500 text-sm uppercase font-semibold">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
                            </p>
                            <p className="text-4xl font-bold text-green-800">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Section */}
            {selectedKey && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {selectedKey
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, (c) => c.toUpperCase())}{' '}
                                Details
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 text-lg font-bold"
                            >
                                ❌
                            </button>
                        </div>

                        {details[selectedKey]?.length > 0 ? (
                            <div className="space-y-4">
                                {details[selectedKey].map((item) => (
                                    <div
                                        key={item._id}
                                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                    >
                                        <p>
                                            <span className="font-semibold">Name:</span>{' '}
                                            {item.lead_details.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Phone:</span>{' '}
                                            {item.lead_details.phone}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Email:</span>{' '}
                                            {item.lead_details.email}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Source:</span>{' '}
                                            {item.lead_details.source}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Assignee:</span>{' '}
                                            {item.assignee_name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Remarks:</span>{' '}
                                            {item.remarks || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Last Updated:</span>{' '}
                                            {new Date(item.updatedAt).toLocaleString()}
                                        </p>

                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-blue-600 font-semibold">
                                                Show History
                                            </summary>
                                            <div className="mt-2 bg-white border border-gray-100 rounded-md p-2 text-sm">
                                                {item.history.map((h, idx) => (
                                                    <div key={idx} className="border-b border-gray-100 py-1">
                                                        {typeof h === 'string' ? (
                                                            <p>{h}</p>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <span className="font-semibold">Status:</span>{' '}
                                                                    {h.status}
                                                                </p>
                                                                <p>
                                                                    <span className="font-semibold">Updated At:</span>{' '}
                                                                    {new Date(h.updatedAt).toLocaleString()}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No details available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DayEndReport;
