'use client';

import axios from 'axios';
import React, { useState } from 'react'

import 'react-toastify/dist/ReactToastify.css';

import Loader from '@/components/loader';
import { EDIT_LEAD_FORM } from '@/config/api';
import { ToastContainer, toast } from 'react-toastify';


type leadIdType = {
    leadId: string;
}

const priceRanges = [
    'Below ₹10 Lakh',
    '₹10 Lakh - ₹20 Lakh',
    '₹20 Lakh - ₹50 Lakh',
    '₹50 Lakh - ₹1 Cr',
    '₹1 Cr - ₹2 Cr',
    '₹2 Cr - ₹5 Cr',
    'Above ₹5 Cr',
];

const leadStatuses = [
    'Busy',
    'Not responding',
    'Network Error',
    'Not Valid',
    'Asked Follow-Up',
    'Redirection to voice-mail',
    'Site Visit Fixed',
    'Sold',
    'Connected with Whatsapp and sent Brochure',
    'Site Visit Done',
    'Site Visit Cancelled',
    'Site Visit Rescheduled',
];

const preferredConfigs = [
    '1 BHK',
    '1.5 BHK',
    '2 BHK',
    '2.5 BHK',
    '3 BHK',
    '3.5 BHK',
    '4 BHK',
    '4.5 BHK',
    '5 BHK',
    '5.5 BHK',
    '6 BHK',
    '6.5 BHK',
    '7 BHK',
    '7.5 BHK',
    '8 BHK',
    '8.5 BHK',
    '9 BHK',
    '9.5 BHK',
    '10 BHK',
    'Duplex',
    'Penthouse',
    'Villa',
    'Plot',
    'Suite',
    'Studio Apartment',
    'Commercial Space',
    'Office Space',
]

const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const propertyStatusOptions = ['Under Construction', 'Ready to Move'];

const LeadEditForm = ({ leadId }: leadIdType) => {
    const [alternate_phone, setAlternatePhone] = useState('');
    const [client_budget, setClientBudget] = useState('');
    const [interested_project, setInterestedProject] = useState('');
    const [lead_status, setLeadStatus] = useState('');
    const [location, setLocation] = useState('');
    const [preferred_floor, setPreferredFloor] = useState('');
    const [preferred_configuration, setPreferredConfig] = useState('');
    const [furnished_status, setFurnishedStatus] = useState('');
    const [property_status, setPropertyStatus] = useState('');
    const [comments, setComments] = useState('');
    const [schedule_date, setScheduleDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [schedule_time, setScheduleTime] = useState("");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1️⃣ Get user data from localStorage
        const userDataString = localStorage.getItem("user");
        let assignee_id = "";

        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                assignee_id = userData._id || ""; // extract _id
               
            } catch (err) {
                console.error("Error parsing token from localStorage", err);
            }
        }

        // 2️⃣ Prepare form data
        const formData = {
            alternate_phone,
            client_budget,
            interested_project,
            lead_status,
            location,
            preferred_floor,
            preferred_configuration,
            furnished_status,
            property_status,
            comments,
            schedule_date,
            schedule_time,
            assignee_id // added from localStorage
        };

        console.log("Form Data:", formData);

        try {
            const response = await axios.put(EDIT_LEAD_FORM(leadId), formData);

            console.log("Lead updated successfully:", response.data);

            toast.success("Lead updated successfully!");
           
            // ✅ Reset form fields
            setAlternatePhone("");
            setClientBudget("");
            setInterestedProject("");
            setLeadStatus("");
            setLocation("");
            setPreferredFloor("");
            setPreferredConfig("");
            setFurnishedStatus("");
            setPropertyStatus("");
            setComments("");
            setScheduleDate("");
            setScheduleTime("");
            setLoading(false);

        } catch (error) {
            console.error("Error updating lead:", error);
            toast.error("Error updating lead!");
            setLoading(false);
        }
    };



    return (
        <>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alternate Phone Number */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Alternate Phone Number
                    </label>
                    <input
                        type="number"
                        value={alternate_phone}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 10) {
                                setAlternatePhone(val);
                            }
                        }}
                        placeholder="Enter alternate phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    />

                </div>

                {/* Client Budget */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Client Budget
                    </label>
                    <select
                        value={client_budget}
                        onChange={(e) => setClientBudget(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"

                    >
                        <option value="" disabled>Select budget range</option>
                        {priceRanges.map((range) => (
                            <option key={range} value={range}>{range}</option>
                        ))}
                    </select>
                </div>

                {/* Interested Project */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Interested Project
                    </label>
                    <input
                        type="text"
                        value={interested_project}
                        onChange={(e) => setInterestedProject(e.target.value)}
                        placeholder="Enter project name"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"

                    />
                </div>


                {/* Location */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"

                    />
                </div>

                {/* Preferred Floor */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Preferred Floor
                    </label>
                    <input
                        type="text"
                        value={preferred_floor}
                        onChange={(e) => setPreferredFloor(e.target.value)}
                        placeholder="Enter preferred floor"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                {/* Preferred Configuration */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Preferred Configuration
                    </label>
                    <select
                        value={preferred_configuration}
                        onChange={(e) => setPreferredConfig(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"

                    >
                        <option value="" disabled>Select preferred configuration</option>
                        {preferredConfigs.map((config) => (
                            <option key={config} value={config}>{config}</option>
                        ))}
                    </select>
                </div>

                {/* Furnished / Unfurnished */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Furnished Status
                    </label>
                    <select
                        value={furnished_status}
                        onChange={(e) => setFurnishedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    >
                        <option value="" disabled>Select furnished status</option>
                        {furnishedOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Under Construction / Ready to Move */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Property Status
                    </label>
                    <select
                        value={property_status}
                        onChange={(e) => setPropertyStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    >
                        <option value="" disabled>Select property status</option>
                        {propertyStatusOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Disposition Status */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Disposition Status
                    </label>
                    <select
                        value={lead_status}
                        onChange={(e) => setLeadStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-orange-200 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring"
                        required
                    >
                        <option value="" disabled>Select Disposition status</option>
                        {leadStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Schedule Call Date
                    </label>
                    <input
                        type="date"
                        value={schedule_date}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Schedule Call Time
                    </label>
                    <input
                        type="time"
                        value={schedule_time}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                {/* Comments */}
                <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Comments
                    </label>
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter any additional comments"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-900 transition"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <Loader color="white" />
                                <span className="ml-2">Submitting...</span>
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </>
    )
}

export default LeadEditForm