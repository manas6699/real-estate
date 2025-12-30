'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CheckCircle2,
    CalendarDays,
    Archive,
    ArrowRightLeft,
    Menu,
    X,
    IceCream2,
    Search,
    LogOut
} from 'lucide-react';

const navItems = [
    { href: "/telecaller/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/telecaller/Calender", icon: CalendarDays, label: "My Calendar" },
    { href: "/telecaller/transfer", icon: ArrowRightLeft, label: "Transferred Leads" },
    { href: "/telecaller/processed", icon: CheckCircle2, label: "Processed Leads" },
    { href: "/telecaller/inventory", icon: IceCream2, label: "Inventory" },
    { href: "/telecaller/search", icon: Search, label: "Find Inventory" },
    { href: "/telecaller/OldReport", icon: Archive, label: "Old Leads" },
];



export default function TelecallerSidebar() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            // Local storage cleanup
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // --- Server Logout Logic (If needed) ---
            // await axios.post(`${API_BASE_URL}/auth/logout`, {}); 

            // Redirect to login after successful logout
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
            // Even if the server call fails, we clear local storage and redirect for security/UX
            router.push('/login');
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);

    interface LinkItemProps {
        href: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        label: string;
    }

    const LinkItem: React.FC<LinkItemProps> = ({ href, icon: Icon, label }) => {
        const isActive =
            pathname.toLowerCase() === href.toLowerCase() ||
            pathname.toLowerCase().startsWith(href.toLowerCase());


        return (
            <a
                href={href}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-150 ${isActive
                        ? 'bg-pink-100 text-pink-700 font-extrabold shadow-sm border-l-4 border-pink-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
            >
                <Icon className="w-5 h-5" />
                <span className="text-base">{label}</span>
            </a>
        );
    };

    // Close sidebar when clicking on a link (mobile)
    useEffect(() => {
        if (window.innerWidth < 1024 && isOpen) {
            setIsOpen(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ pathname]);

    return (
        <>
            {/* Mobile floating button */}
            <button
                className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-pink-600 text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
                onClick={toggleSidebar}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 w-64 z-40 flex flex-col`}
            >
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-wider">
                        <span className="text-pink-600">TC</span> Panel
                    </h2>
                </div>

                <nav className="flex flex-col p-4 space-y-2 flex-grow">
                    {navItems.map((item) => (
                        <LinkItem key={item.href} {...item} />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
                  
                        <button
                            onClick={handleLogout}
                            className="flex items-center cursor-pointer gap-2 px-9 py-2 text-sm font-semibold rounded-lg transition duration-200 
            w-full bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            <LogOut className="w-6 h-10" />
                            <span className='text-sm'>Log Out</span> {/* Hidden on mobile, shown on tablet/desktop */}
                        </button>
                  
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-40 z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}