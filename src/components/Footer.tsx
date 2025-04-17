// components/Footer.tsx

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black text-white px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Company Info */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">YourCompany</h3>
                    <p className="text-sm text-gray-400">
                        Empowering your digital journey with innovation and precision.
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
                    <p className="text-sm text-gray-400">Email: info@yourcompany.com</p>
                    <p className="text-sm text-gray-400">Phone: +91 98765 43210</p>
                    <p className="text-sm text-gray-400">Address: New Town, Kolkata, India</p>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-blue-500"><Facebook /></a>
                        <a href="#" className="hover:text-sky-400"><Twitter /></a>
                        <a href="#" className="hover:text-pink-500"><Instagram /></a>
                        <a href="#" className="hover:text-blue-300"><Linkedin /></a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} YourCompany. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
