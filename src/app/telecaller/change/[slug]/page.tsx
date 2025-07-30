
import React from 'react';

import Navbar from '@/components/AdminComponents/Navbar';
import FixCard from '@/components/TelecallerComponents/FixCard';
import LeadEditForm from '@/components/TelecallerComponents/LeadEditForm';
import TelecallerSidebar from '@/components/TelecallerComponents/TelecallerSidebar';


export default async function LeadDetailsForm({
    params,
}: {
    params: Promise<{ slug: string }>
}) {

    const { slug } = await params;

    return (
        <>
            <TelecallerSidebar />
            <div className="lg:ml-64">
                <Navbar />
                <FixCard leadId={slug} />
                <div className="max-w-5xl p-4">
                    <LeadEditForm leadId={slug} />
                </div>
            </div>
        </>
    );
}
