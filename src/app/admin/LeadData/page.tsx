// app/leads/page.tsx
import LeadTable from '@/components/LeadTable';
import Logo from '../../../../public/assets/logo-transparent.png'
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';


export default function LeadsPage() {
    return (
        <>
            <nav className="w-full bg-white shadow-md py-4">
                <div className="container mx-auto px-4 flex flex-row lg:flex-row items-center justify-between">

                    {/* Left: Logo */}
                    <div className="mb-2 lg:mb-0">
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            <Image src={Logo} alt="Logo" width={60} height={60} />
                        </Link>
                    </div>

                    {/* Center: Phone */}
                    <div className="md:flex lg:flex hidden items-center gap-2 text-gray-800 font-semibold mb-2 lg:mb-0">
                        <h2>
                            ADMIN PANEL
                        </h2>
                    </div>

                    
                </div>
            </nav>
            <main className="max-w-6xl mx-auto mt-6 mb-16">
                <h1 className="text-2xl font-semibold mb-4">All Leads</h1>
                <LeadTable />
            </main>
            <Footer phoneNumber='98309 47144'/>
        </>
    );
}
