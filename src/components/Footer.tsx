
import { Facebook, Instagram } from "lucide-react";

import Image from 'next/image';
import Logo from '../../public/assets/logo-transparent.png'
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-black text-white px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Company Info */}
                <div>
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        <Image src={Logo} alt="Logo" width={100} height={100} />
                    </Link>
                    <p className="text-sm text-gray-400">
                        Real Estate Leader in Kolkata, India. We provide the best properties for your needs.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white">Home</a></li>
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Services</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Contact</h4>
                    <p className="text-sm text-gray-400">Email: Info@mmrrealty.in</p>
                    <p className="text-sm text-gray-400">Phone: +91 98309 47144</p>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/profile.php?id=61573050645360" className="hover:text-blue-500">
                            <Facebook />
                        </a>
                        <a href="https://www.instagram.com/mmrrealtyllp/" className="hover:text-pink-500"><Instagram /></a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} MMR . All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
