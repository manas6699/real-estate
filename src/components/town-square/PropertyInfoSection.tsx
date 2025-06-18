import EnquiryBtn from '@/components/EnquireBtn';
// components/PropertyInfoSection.js
export default function PropertyInfoSection() {
    return (
        <section>
            <div className="bg-white rounded-2xl shadow-xl  mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                    <div>
                        <p className="text-gray-600 font-medium">Price Range</p>
                        <p className="text-lg font-semibold">₹ 2.40 - 3.80 Cr</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Configuration</p>
                        <p className="text-lg font-semibold">3.5, 4 BHK</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Possession Date</p>
                        <p className="text-lg font-semibold">Dec 2027</p>
                    </div>
                    <div>
                        <EnquiryBtn source="town-square" btntext='Instant Call Back ⚡' modalheading="Contact Us" />
                    </div>
                </div>
            </div>
        </section>
    );
}
