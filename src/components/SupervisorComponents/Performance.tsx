// components/AssignedLeadsTable.tsx
'use client';

import axios from 'axios';
import * as XLSX from 'xlsx';
import React, { useState, useEffect, useCallback } from 'react';

// START: Temporary Type Definitions (Keeping them local)
interface LeadDetails {
    name: string;
    email: string;
    phone: string;
    source: string;
    projectSource: string;
    status: string;
    lead_type?: string;
    createdAt: string;
    updatedAt: string;
    lead_status?: string;
    upload_type: string;
}
interface Assignment {
    lead_details: LeadDetails;
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    assign_mode: string;
    status: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface ApiResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    limit: number;
    data: Assignment[];
}

interface Telecaller {
    id: string;
    name: string;
}
// END: Temporary Type Definitions

import { GET_ALL_TELECALLERS_API, SHOW_ALL_ASSIGNS_API } from '@/config/api';


// --- Card Definitions ---
const STATUS_CARDS: { [key: string]: string } = {
    'Total Leads': 'ALL',
    'FollowUp': 'Under Follow Up',
    'Site Visit Fixed': 'Site Visit Fixed',
    'Site Visit Done': 'Site Visit Done',
    'Booked': 'Booked',
    'Visited Follow Up': 'Visited Followup',
    'Site Visit Rescheduled': 'Site Visit Rescheduled',
    'Site Visit Cancelled': 'Site Visit Cancelled',
    'Sold': 'Sold',
};

const TYPE_CARDS: { [key: string]: string } = {
    'Hot': 'Hot',
    'Cold ': 'Cold',
    "Warm": 'Warm',
    'Junk': 'Junk',
    'Retry': 'Retry',
};

const UPLOAD_TYPE_CARDS: { [key: string]: string } = {
    'In House Leads': 'single',
    'Bulk Leads': 'Bulk',
};

// Helper function to format date for API
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

interface Filters {
    updatedStartDate: string;
    updatedEndDate: string;
    assignee_id: string;
    selectedUsers: string[]; // New field for multiselect
    lead_status: string;
    lead_type: string;
    upload_type: string;
}

const AssignedLeadsTable: React.FC = () => {
    // State for the full data set (used for card counts)
    const [fullData, setFullData] = useState<Assignment[]>([]);
    // State for the filtered data (used for the table display & export)
    const [data, setData] = useState<Assignment[]>([]);

    const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardCounts, setCardCounts] = useState<{ [key: string]: number }>({});
    const [totalLeadsCount, setTotalLeadsCount] = useState<number>(0);
    const [showGroupedPerformance, setShowGroupedPerformance] = useState<boolean>(false);
    interface UserPerformance {
        name: string;
        totalLeads: number;
        statusBreakdown: { [key: string]: number };
        typeBreakdown: { [key: string]: number };
        conversionRate: string | number;
        averageResponseTime: number;
    }
    const [groupedPerformanceData, setGroupedPerformanceData] = useState<{ [key: string]: UserPerformance }>({});
    console.log(totalLeadsCount)

    const today = formatDate(new Date());
    const [filters, setFilters] = useState<Filters>({
        updatedStartDate: today,
        updatedEndDate: today,
        assignee_id: '',
        selectedUsers: [], // Initialize empty array for multiselect
        lead_status: '', // Filter applied by Status Card click
        lead_type: '',   // Filter applied by Type Card click
        upload_type: '', // Filter applied by Upload Type Card click
    });

    // --- Count Calculation Logic ---
    // This now only depends on the fullData and runs once the main data is fetched.
    const calculateCardCounts = useCallback((currentFullData: Assignment[]) => {
        const counts: { [key: string]: number } = {};
        counts['Total Leads'] = currentFullData.length;

        // Count for Status Cards
        Object.entries(STATUS_CARDS).forEach(([label, statusValue]) => {
            if (statusValue !== 'ALL') {
                counts[label] = currentFullData.filter(
                    item => (item.lead_details.lead_status || '').toLowerCase() === statusValue.toLowerCase()
                ).length;
            }
        });

        // Count for Type Cards
        Object.entries(TYPE_CARDS).forEach(([label, typeValue]) => {
            counts[label] = currentFullData.filter(
                item => (item.lead_details.lead_type || '').toLowerCase() === typeValue.toLowerCase()
            ).length;
        });

        // Count for Upload Type Cards
        Object.entries(UPLOAD_TYPE_CARDS).forEach(([label, uploadValue]) => {
            counts[label] = currentFullData.filter(
                item => (item.lead_details.upload_type || '').toLowerCase() === uploadValue.toLowerCase()
            ).length;
        });

        setCardCounts(counts);
    }, []);

    // --- Grouped Performance Calculation Logic ---
    const calculateGroupedPerformance = useCallback((currentFullData: Assignment[], selectedUserIds: string[]) => {
        if (selectedUserIds.length === 0) {
            setGroupedPerformanceData({});
            return;
        }

        const groupedData: { [key: string]: UserPerformance } = {};

        selectedUserIds.forEach(userId => {
            const userTelecaller = telecallers.find(tc => tc.id === userId);
            const userName = userTelecaller?.name || `User ${userId}`;

            const userLeads = currentFullData.filter(item => item.assignee_id === userId);

            const userPerformance: UserPerformance = {
                name: userName,
                totalLeads: userLeads.length,
                statusBreakdown: {},
                typeBreakdown: {},
                conversionRate: 0,
                averageResponseTime: 0
            };

            // Calculate status breakdown
            Object.entries(STATUS_CARDS).forEach(([label, statusValue]) => {
                if (statusValue !== 'ALL') {
                    userPerformance.statusBreakdown[label] = userLeads.filter(
                        item => (item.lead_details.lead_status || '').toLowerCase() === statusValue.toLowerCase()
                    ).length;
                }
            });

            // Calculate type breakdown
            Object.entries(TYPE_CARDS).forEach(([label, typeValue]) => {
                userPerformance.typeBreakdown[label] = userLeads.filter(
                    item => (item.lead_details.lead_type || '').toLowerCase() === typeValue.toLowerCase()
                ).length;
            });

            // Calculate conversion rate (Booked + Sold / Total)
            const booked = userPerformance.statusBreakdown['Booked'] || 0;
            const sold = userPerformance.statusBreakdown['Sold'] || 0;
            userPerformance.conversionRate = userLeads.length > 0 ?
                parseFloat(((booked + sold) / userLeads.length * 100).toFixed(2)) : 0;

            groupedData[userId] = userPerformance;
        });

        setGroupedPerformanceData(groupedData);
    }, [telecallers]);


    // --- Fetch Telecallers (Dropdown Data) ---
    useEffect(() => {
        const fetchTelecallers = async () => {
            try {
                const res = await axios.get<{ data: Telecaller[] }>(GET_ALL_TELECALLERS_API);
                setTelecallers(res.data.data || []);
            } catch (err) {
                console.error("Error fetching telecallers:", err);
            }
        };
        fetchTelecallers();
    }, []);


    // --- Main Data Fetching Logic (Fetches the FULL data pool based on Date/Telecaller) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.updatedStartDate) params.append('updatedStartDate', filters.updatedStartDate);
            if (filters.updatedEndDate) params.append('updatedEndDate', filters.updatedEndDate);
            if (filters.assignee_id) params.append('assignee_id', filters.assignee_id);
            if (filters.upload_type) params.append('upload_type', filters.upload_type);

            const url = `${SHOW_ALL_ASSIGNS_API}?${params.toString()}`;
            const res = await axios.get<ApiResponse>(url);

            const fetchedData = res.data.data;

            // Set the FULL data and calculate counts
            setFullData(fetchedData);
            setTotalLeadsCount(res.data.total || fetchedData.length);
            calculateCardCounts(fetchedData);

            // Calculate grouped performance if users are selected
            if (filters.selectedUsers.length > 0) {
                calculateGroupedPerformance(fetchedData, filters.selectedUsers);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Error fetching assignments:", err);
            const message = err.response?.data?.message || err.message || 'Failed to fetch data';
            setError(message);
            setFullData([]);
            setData([]);
            setCardCounts({});
            setTotalLeadsCount(0);
        } finally {
            setIsLoading(false);
        }
        // Only depend on the filters that define the FULL data pool (Date, Telecaller, Upload Type)
    }, [filters.updatedStartDate, filters.updatedEndDate, filters.assignee_id, filters.upload_type, filters.selectedUsers, calculateCardCounts, calculateGroupedPerformance]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate grouped performance when selectedUsers changes
    useEffect(() => {
        if (fullData.length > 0) {
            calculateGroupedPerformance(fullData, filters.selectedUsers);
        }
    }, [fullData, filters.selectedUsers, calculateGroupedPerformance]);

    // --- Local Filtering Logic (To update the Table/Export data) ---
    // This runs whenever fullData or a card filter changes.
    useEffect(() => {
        let filtered = fullData;

        // 1. Filter by Lead Status (from STATUS_CARDS)
        if (filters.lead_status && filters.lead_status !== 'ALL') {
            filtered = filtered.filter(
                item => (item.lead_details.lead_status || '').toLowerCase() === filters.lead_status.toLowerCase()
            );
        }

        // 2. Filter by Lead Type (from TYPE_CARDS)
        if (filters.lead_type) {
            filtered = filtered.filter(
                item => (item.lead_details.lead_type || '').toLowerCase() === filters.lead_type.toLowerCase()
            );
        }

        setData(filtered);

    }, [fullData, filters.lead_status, filters.lead_type]);


    // --- Filter Handlers ---
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Reset card filters when master filters change
        setFilters(prev => ({
            ...prev,
            [name]: value,
            lead_status: '',
            lead_type: '',
            upload_type: '',
        }));
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Reset card filters when master filters change
        setFilters(prev => ({
            ...prev,
            assignee_id: e.target.value,
            lead_status: '',
            lead_type: '',
            upload_type: '',
        }));
    };

    // Handler for multiselect users
    const handleUserSelect = (userId: string) => {
        setFilters(prev => {
            const isSelected = prev.selectedUsers.includes(userId);
            const newSelectedUsers = isSelected
                ? prev.selectedUsers.filter(id => id !== userId)
                : [...prev.selectedUsers, userId];

            return {
                ...prev,
                selectedUsers: newSelectedUsers
            };
        });
    };

    const handleSelectAllUsers = () => {
        setFilters(prev => ({
            ...prev,
            selectedUsers: prev.selectedUsers.length === telecallers.length ? [] : telecallers.map(tc => tc.id)
        }));
    };

    const ExportTableData = () => {
        if (!XLSX) {
            console.error("XLSX library not loaded for table data export.");
            return;
        }

        if (data.length === 0) {
            // Use console.error instead of alert as per instructions
            console.error('No table data to export.');
            return;
        }

        // Prepare Leads Table Data
        const tableExportData = data.map(item => ({
            'Lead ID': item.lead_id,
            'Assignee Name': item.assignee_name,
            'Lead Status': item.lead_details.lead_status || 'N/A',
            'Lead Type': item.lead_details.lead_type || 'N/A',
            'Name': item.lead_details.name,
            'Phone': item.lead_details.phone,
            'Email': item.lead_details.email,
            'Source': item.lead_details.source,
            'Project Source': item.lead_details.projectSource,
            'Last Update': new Date(item.updatedAt).toLocaleDateString(),
            'Remarks': item.remarks,
            'Assign Mode': item.assign_mode,
        }));

        // Create Workbook and Worksheet
        const wb = XLSX.utils.book_new();
        const wsTable = XLSX.utils.json_to_sheet(tableExportData);
        XLSX.utils.book_append_sheet(wb, wsTable, "Filtered Leads");

        // Write File
        XLSX.writeFile(wb, `Filtered_Leads_Table_${Date.now()}.xlsx`);
    };

    const handleCardClick = (filterType: 'lead_status' | 'lead_type' | 'upload_type', value: string) => {
        const filterValue = value === 'ALL' ? '' : value;

        setFilters(prev => {
            const newFilters: Filters = { ...prev };

            // If the clicked card is already active, clear it.
            // This is the correct way to handle card toggling.
            if (newFilters[filterType] === filterValue) {
                newFilters[filterType] = '';
            } else {
                // If it's a lead_status or lead_type card, clear the OTHER type.
                if (filterType === 'lead_status') {
                    newFilters.lead_status = filterValue;
                    newFilters.lead_type = ''; // Only one can be active at a time for table filtering
                } else if (filterType === 'lead_type') {
                    newFilters.lead_type = filterValue;
                    newFilters.lead_status = ''; // Only one can be active at a time for table filtering
                } else if (filterType === 'upload_type') {
                    // Upload type is a master filter, so we set it and clear the status/type filters
                    newFilters.upload_type = filterValue;
                    newFilters.lead_type = '';
                    newFilters.lead_status = '';
                }
            }
            return newFilters;
        });
    };


    const exportToExcel = () => {
        const summaryLabels: { [key: string]: string } = {
            'Total Leads': 'Total Leads',
            'FollowUp': 'FollowUp',
            'Site Visit Fixed': 'Site Visit Fixed',
            'Site Visit Done': 'Site Visit Done',
            'Booked': 'Booked',
            'Visited Follow Up': 'Visited Follow Up',
            'Site Visit Rescheduled': 'Site Visit Rescheduled',
            'Site Visit Cancelled': 'Site Visit Cancelled',
            'Sold': 'Sold',
            'Hot': 'Hot Leads',
            'Cold ': 'Cold Leads',
            "Warm": 'Warm Leads',
            'Junk': 'Junk Leads',
            'Retry': 'Retry Leads',
            'Bulk Leads': 'Bulk Uploaded Leads',
            'In House Leads': 'In House Leads',
        };

        const cardSummaryData = Object.entries(summaryLabels).map(([key, label]) => ({
            'Metric': label,
            'Count': cardCounts[key] ?? 0,
        }));

        // Add Total Leads as the first item in the desired format
        const totalLeadsRow = [
            { 'Metric': `Total Leads : ${cardCounts['Total Leads'] ?? 0}`, 'Count': '' } // Value in A1, B1 empty
        ];

        // Combine the total leads header with the rest of the detailed counts
        const detailedCardData = [
            // Add a blank row for separation
            { 'Metric': '', 'Count': '' },
            // Add column headers for the detailed breakdown
            { 'Metric': 'Lead Metrics Breakdown', 'Count': 'Count' },
            // Filter out the 'Total Leads' entry as it's already in the header
            ...cardSummaryData.filter(item => item.Metric !== 'Total Leads')
        ];


        // --- 2. Prepare Leads Table Data for Leads Sheet ---
        if (data.length === 0) {
            alert('No table data to export.');
        }

        const tableExportData = data.map(item => ({
            'Lead ID': item.lead_id,
            'Assignee Name': item.assignee_name,
            'Lead Status': item.lead_details.lead_status || 'N/A',
            'Lead Type': item.lead_details.lead_type || 'N/A',
            'Name': item.lead_details.name,
            'Phone': item.lead_details.phone,
            'Email': item.lead_details.email,
            'Source': item.lead_details.source,
            'Project Source': item.lead_details.projectSource,
            'Last Update': new Date(item.updatedAt).toLocaleDateString(),
            'Remarks': item.remarks,
            'Assign Mode': item.assign_mode,
        }));

        // --- 3. Create Workbook and Worksheets ---
        const wb = XLSX.utils.book_new();

        // Create and append the Card Summary Worksheet
        const wsSummary = XLSX.utils.json_to_sheet([...totalLeadsRow, ...detailedCardData], { skipHeader: true });
        XLSX.utils.book_append_sheet(wb, wsSummary, "Dashboard Summary");

        // Create and append the Leads Table Worksheet
        const wsTable = XLSX.utils.json_to_sheet(tableExportData);
        XLSX.utils.book_append_sheet(wb, wsTable, "Assigned Leads Details");

        // --- 4. Write File ---
        XLSX.writeFile(wb, `Assigned_Leads_Report_of ${Date.now()}.xlsx`);
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold mb-6 text-gray-800">Assigned Leads Dashboard 📊</h1>

            {/* --- Filter Section --- */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap flex-col:6 gap-2 items-end">

                {/* Date Filters */}
                <div className="flex flex-col">
                    <label htmlFor="updatedStartDate" className="text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id="updatedStartDate"
                        name="updatedStartDate"
                        value={filters.updatedStartDate}
                        onChange={handleDateChange}
                        className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="updatedEndDate" className="text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        id="updatedEndDate"
                        name="updatedEndDate"
                        value={filters.updatedEndDate}
                        onChange={handleDateChange}
                        className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Telecaller Dropdown */}
                <div className="flex flex-col">
                    <label htmlFor="assignee-select" className="text-sm font-medium text-gray-700">Telecaller</label>
                    <select
                        id="assignee-select"
                        value={filters.assignee_id}
                        onChange={handleDropdownChange}
                        className="p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 lg:w-[180px] focus:border-blue-500"
                    >
                        <option value="">All Telecallers</option>
                        {telecallers.map((tc) => (
                            <option key={tc.id} value={tc.id}>
                                {tc.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Performance View Toggle */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">View Mode</label>
                    <button
                        onClick={() => setShowGroupedPerformance(!showGroupedPerformance)}
                        className={`p-2 rounded-md font-medium transition duration-300 ${showGroupedPerformance
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {showGroupedPerformance ? 'Show Leads View' : 'Show Performance View'}
                    </button>
                </div>

                {/* Refresh/Export Buttons */}
                <button
                    onClick={fetchData} // Re-fetch all data on click to ensure counts are current
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
                >
                    {isLoading ? 'Loading...' : 'Apply Filters'}
                </button>

                <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                    Export Stat Data ⬇️
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                    Clear Filter
                </button>
            </div>

            {/* Multiselect Users for Grouped Performance */}
            {showGroupedPerformance && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Select Users for Performance Comparison</h3>
                        <button
                            onClick={handleSelectAllUsers}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                            {filters.selectedUsers.length === telecallers.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {telecallers.map((telecaller) => (
                            <label key={telecaller.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedUsers.includes(telecaller.id)}
                                    onChange={() => handleUserSelect(telecaller.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{telecaller.name}</span>
                            </label>
                        ))}
                    </div>
                    {filters.selectedUsers.length > 0 && (
                        <div className="mt-3 text-sm text-gray-600">
                            Selected: {filters.selectedUsers.length} user(s)
                        </div>
                    )}
                </div>
            )}

            <hr className="my-6" />

            {/* Grouped Performance Visualization */}
            {showGroupedPerformance && filters.selectedUsers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Performance Comparison</h2>

                    {/* Performance Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {Object.entries(groupedPerformanceData).map(([userId, performance]) => (
                            <div key={userId} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{performance.name}</h3>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{performance.totalLeads}</div>
                                        <div className="text-sm text-gray-600">Total Leads</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{performance.conversionRate}%</div>
                                        <div className="text-sm text-gray-600">Conversion Rate</div>
                                    </div>
                                </div>

                                {/* Status Breakdown */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Status Breakdown</h4>
                                    <div className="space-y-1">
                                        {Object.entries(performance.statusBreakdown).map(([status, count]) => (
                                            (count as number) > 0 && (
                                                <div key={status} className="flex justify-between text-xs">
                                                    <span className="text-gray-600">{status}:</span>
                                                    <span className="font-medium">{count as number}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>

                                {/* Type Breakdown */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Type Breakdown</h4>
                                    <div className="space-y-1">
                                        {Object.entries(performance.typeBreakdown).map(([type, count]) => (
                                            (count as number) > 0 && (
                                                <div key={type} className="flex justify-between text-xs">
                                                    <span className="text-gray-600">{type}:</span>
                                                    <span className="font-medium">{count as number}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Leads</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Visits</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hot Leads</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.entries(groupedPerformanceData).map(([userId, performance]) => (
                                    <tr key={userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {performance.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {performance.totalLeads}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            {performance.conversionRate}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                            {performance.statusBreakdown['Booked'] || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                                            {performance.statusBreakdown['Sold'] || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                                            {(performance.statusBreakdown['Site Visit Done'] || 0) + (performance.statusBreakdown['Site Visit Fixed'] || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            {performance.typeBreakdown['Hot'] || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- Status Cards (Filters) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 mb-6">
                {/* Lead Status Cards */}
                {Object.entries(STATUS_CARDS).map(([label, statusValue]) => {
                    const count = cardCounts[label] ?? 0;
                    // Check if filter is active
                    const isActive = statusValue === filters.lead_status || (statusValue === 'ALL' && filters.lead_status === '');

                    return (
                        <div
                            key={label}
                            onClick={() => handleCardClick('lead_status', statusValue)}
                            className={`
                              p-4 rounded-lg shadow-md cursor-pointer text-center transition duration-300 border-l-8 border-blue-500
                              ${isActive
                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-800 '
                                    : 'bg-white hover:bg-gray-100 text-gray-700'
                                }
                            `}
                        >
                            <p className="text-xs font-bold">{label}</p>
                            <p className="text-sm font-extrabold mt-1">{isLoading ? '...' : count}</p>
                        </div>
                    );
                })}
            </div>

            {/* --- Type and Upload Cards --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Lead Type Cards */}
                {Object.entries(TYPE_CARDS).map(([label, typeValue]) => {
                    const count = cardCounts[label] ?? 0;
                    const isActive = typeValue === filters.lead_type || (typeValue === 'ALL' && filters.lead_status === '');

                    return (
                        <div
                            key={label}
                            onClick={() => handleCardClick('lead_type', typeValue)}
                            className={`
                              p-4 rounded-lg shadow-md cursor-pointer text-center transition duration-300 border-l-8 border-green-500
                              ${isActive
                                    ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                                    : 'bg-white hover:bg-gray-100 text-gray-700'
                                }
                            `}
                        >
                            <p className="text-md">{label}</p>
                            <p className="text-xl font-extrabold mt-1">{isLoading ? '...' : count}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
                {/* NEW: Upload Type Cards */}
                {Object.entries(UPLOAD_TYPE_CARDS).map(([label, typeValue]) => {
                    const count = cardCounts[label] ?? 0;
                    // Check if filter is active for the main fetch
                    const isActive = typeValue === filters.upload_type || (typeValue === 'ALL' && filters.upload_type === '')

                    return (
                        <div
                            key={label}
                            // Upload type changes the *full pool* so we trigger fetchData 
                            // by changing the `filters.upload_type` state.
                            onClick={() => handleCardClick('upload_type', typeValue)}
                            className={`
                                p-4 rounded-lg shadow-md cursor-pointer text-center transition duration-300 border-l-8 border-orange-500
                                ${isActive
                                    ? 'bg-orange-100 border-2 border-orange-500 text-orange-800'
                                    : 'bg-white hover:bg-gray-100 text-gray-700'
                                }
                            `}
                        >
                            <p className="text-md">{label}</p>
                            <p className="text-xl font-extrabold mt-1">{isLoading ? '...' : count}</p>
                        </div>
                    );
                })}


            </div>


            <hr className="my-6" />
            <button
                onClick={ExportTableData}
                className='bg-purple-700 px-4 py-2 border-l-8 border-yellow-500 shadow-amber-300 cursor-pointer hover:bg-amber-400 rounded mb-4 text-white font-extrabold'
            >
                Export Table Data to exel
            </button>

            {/* --- Data Table --- */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">Error: {error}</div>}

            <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Name', 'Phone', 'Assignee', 'Status', 'Type', 'Project', 'Last Update', 'Remarks'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading && data.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    Loading leads...
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.lead_details.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.lead_details.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.assignee_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                                        {item.lead_details.lead_status || item.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                                        {item.lead_details.lead_type || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.lead_details.projectSource || item.lead_details.projectSource}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.remarks}>
                                        {item.remarks || '-'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    No assigned leads found for the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedLeadsTable;