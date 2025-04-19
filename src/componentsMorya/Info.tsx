// components/PropertyInfoSection.js
export default function Info() {
    return (
        <section className="px-4 bg-green-50">
            <div className="bg-white rounded-2xl shadow-xl  mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                    <div>
                        <p className="text-gray-600 font-medium">Price Range</p>
                        <p className="text-lg font-semibold">₹ 2.40 - 3.80 Cr Onwards</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Configuration</p>
                        <p className="text-lg font-semibold">3, 3.5, 4 BHK</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Possession Date</p>
                        <p className="text-lg font-semibold">Dec 2025</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
