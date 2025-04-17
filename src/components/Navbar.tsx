import Link from 'next/link';
import { Phone } from 'lucide-react'; // Optional: Use lucide-react or any icon lib
import Image from 'next/image';
import Logo from '../../public/assets/logo.png'
export default function Navbar() {
    return (
        <nav className="w-full bg-white shadow-md py-4">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">

                {/* Left: Logo */}
                <div className="mb-2 lg:mb-0">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        <Image src={Logo} alt="Logo" width={60} height={60} />
                    </Link>
                </div>

                {/* Center: Phone */}
                <div className="flex items-center gap-2 text-gray-800 font-semibold mb-2 lg:mb-0">
                    <Phone className="w-5 h-5 text-red-500" />
                    <a href="tel:+1234567890" className="hover:underline">+1234567890</a>
                </div>

                {/* Right: Enquire Now button */}
                <div>
                    <Link
                        href="/contact"
                        className="bg-[#de3163] text-white px-5 py-2 rounded-md font-semibold hover:bg-[#c42553] transition"
                    >
                        Enquire Now
                    </Link>
                </div>
            </div>
        </nav>
    );
}
