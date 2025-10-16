'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CheckCircle2,
    CalendarDays,
    Archive,
    ArrowRightLeft,
    Menu,
    X,
    Users
} from 'lucide-react';

const navItems = [
    { href: "/telecaller/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/telecaller/Calender", icon: CalendarDays, label: "My Calendar" },
    { href: "/telecaller/Transfer", icon: ArrowRightLeft, label: "Transferred Leads" },
    { href: "/telecaller/processed", icon: CheckCircle2, label: "Processed Leads" },
    { href: "/telecaller/OldReport", icon: Archive, label: "Old Leads" },
];

export default function TelecallerSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);

    interface LinkItemProps {
        href: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        label: string;
    }

    const LinkItem: React.FC<LinkItemProps> = ({ href, icon: Icon, label }) => {
        // Fixed active state logic - handles exact matches and nested routes
        const isActive = pathname === href ||
            (href !== "/telecaller/Dashboard" && pathname.startsWith(href));

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
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-pink-500" />
                        <span>Telecaller Role</span>
                    </div>
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