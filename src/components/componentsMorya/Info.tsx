import EnquiryBtn from '@/components/EnquireBtn';
import { CalendarDays, IndianRupee, LayoutList } from 'lucide-react';

export default function Info() {
    return (
        <section >
            <div className="bg-white rounded-2xl shadow-xl  mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                    {/* Price Range */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Price Range</p>
                            <p className="text-lg font-semibold">₹ 1.46 - 2.4 Cr</p>
                        </div>
                    </div>
                    {/* Configuration */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                            <LayoutList className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Configuration</p>
                            <p className="text-lg font-semibold">3, 3.5, 4 BHK & Penthouse</p>
                        </div>
                    </div>
                    {/* Possession Date */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Possession Date</p>
                            <p className="text-lg font-semibold">January 2028</p>
                        </div>
                    </div>
                    <div>
                        <EnquiryBtn source="morya" btntext='Instant Call Back ⚡' modalheading="Contact Us"/>
                    </div>

                </div>
            </div>
        </section>
    );
}
