"use client";

import Footer from '@/components/Footer';
import LeadTable from '@/components/LeadTable';
import LeadCards from '@/components/LeadCards';
import MondrianButton from '@/components/MondrianButton';
import Navbar from '@/components/AdminComponents/Navbar';

export default function LeadsPage() {

    return (
        <>
            <Navbar />
            <main className="max-w-6xl mx-auto mt-6 mb-16">
                <MondrianButton />
                <LeadCards />
                <h1 className="text-2xl font-semibold  p-6">
                    All Leads
                </h1>
                <LeadTable />
            </main>
            <Footer phoneNumber='98309 47144' />
        </>
    );
}
