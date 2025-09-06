'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/AdminComponents/Navbar';
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar';
import 'react-toastify/dist/ReactToastify.css';
import { GET_LEAD_DETAILS } from '@/config/api';

const LeadDetailsPage = () => {
    const { slug } = useParams();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [lead, setLead] = useState<any>(null);

    useEffect(() => {
        const fetchLeadDetails = async () => {
            try {
                if (!slug) {
                    console.error('Lead slug not found in params');
                    return;
                }

                const res = await axios.get(GET_LEAD_DETAILS(slug as string));
                setLead(res.data.lead);
            } catch (error) {
                console.error('Error fetching lead:', error);
            }
        };

        fetchLeadDetails();
    }, [slug]);

    const handleDisposeLead = () => {
        if (!slug) return;
        router.push(`/telecaller/change/${slug}`); // ✅ Redirect
    };

    const displayValue = (val: string | undefined) =>
        val && val.trim() !== '' ? val : 'Empty';

    return (
        <>
            <TelecallerSidebar />

            <div className="lg:ml-64">
                <Navbar />
            </div>

            <section className="lg:ml-64 p-6">
                {lead ? (
                    <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{displayValue(lead.name)}</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Email:</strong> {displayValue(lead.email)}</p>
                            <p><strong>Phone:</strong> {displayValue(lead.phone)}</p>
                            <p><strong>Alternate Phone:</strong> {displayValue(lead.alternate_phone)}</p>
                            <p><strong>Source:</strong> {displayValue(lead.source)}</p>
                            <p><strong>Schedule Date:</strong> {displayValue(lead.schedule_date)}</p>
                            <p><strong>Schedule Time:</strong> {displayValue(lead.schedule_time)}</p>
                            <p><strong>Status:</strong> {displayValue(lead.status)}</p>
                            <p><strong>Client Budget:</strong> {displayValue(lead.client_budget)}</p>
                            <p><strong>Comments:</strong> {displayValue(lead.comments)}</p>
                            <p><strong>Furnished Status:</strong> {displayValue(lead.furnished_status)}</p>
                            <p><strong>Interested Project:</strong> {displayValue(lead.interested_project)}</p>
                            <p><strong>Lead Status:</strong> {displayValue(lead.lead_status)}</p>
                            <p><strong>Location:</strong> {displayValue(lead.location)}</p>
                            <p><strong>Preferred Configuration:</strong> {displayValue(lead.preferred_configuration)}</p>
                            <p><strong>Preferred Floor:</strong> {displayValue(lead.preferred_floor)}</p>
                            <p><strong>Property Status:</strong> {displayValue(lead.property_status)}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading lead details...</p>
                )}
                <button
                    className='bg-black mt-5 cursor-pointer p-2 rounded text-white'
                    onClick={handleDisposeLead}
                >
                    📞 Dispose This Lead
                </button>
            </section>
        </>
    );
};

export default LeadDetailsPage;
