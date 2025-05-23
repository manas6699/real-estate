import EnquiryBtn from '@/components/EnquireBtn';
export default function Info() {
    return (
        <section >
            <div className="bg-white rounded-2xl shadow-xl  mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                    <div>
                        <p className="text-gray-600 font-medium">Price Range</p>
                        <p className="text-lg font-semibold">₹ 1.46 - 2.4 Cr</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Configuration</p>
                        <p className="text-lg font-semibold">3, 3.5, 4 BHK & Penthouse</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Possession Date</p>
                        <p className="text-lg font-semibold">January 2028</p>
                    </div>
                    <div>
                        <EnquiryBtn source="morya" btntext='Instant Call Back ⚡'/>
                    </div>

                </div>
            </div>
        </section>
    );
}
