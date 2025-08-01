import React, { useState } from 'react';
import EnquireBtn from '@/components/EnquireBtn';

const PaymentPlan = () => {
    const [showAll, setShowAll] = useState(false);

    const plans = [
        {
            unitType: '3 BHK + 3T',
            size: '1,500 sq ft',
            price: '₹ 2.25 Cr Onwards',
        },
        {
            unitType: '3 BHK + 3T',
            size: '2000 sq ft',
            price: '₹ 3.80 Cr Onwards',
        },
        {
            unitType: '4 BHK  + 4T',
            size: '2,240 sq ft',
            price: '₹ 4.06 Cr Onwards',
        },
        {
            unitType: '4 BHK + 4T(Luxury)',
            size: '3000 sq ft',
            price: '₹ 4.48 Cr Onwards',
        },
    ];

    return (
        <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-yellow-50">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-amber-700 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                    Godrej Blue - Payment Plans
                </h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                                    Unit Type
                                </th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                                    Size (Sq. Ft.)
                                </th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                                    Price Range (₹)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan, index) => (
                                <tr key={index} className="transition-all">
                                    <td className="px-4 py-3 text-gray-700 border-b">
                                        {plan.unitType}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 border-b">
                                        {plan.size}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-gray-700 border-b transition-all ${!showAll && index !== 1e9 && index != 0
                                            ? 'blur-sm pointer-events-none opacity-60 select-none'
                                            : ''
                                            }`}
                                    >
                                        {plan.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="mt-5">
                    <EnquireBtn
                        source="Godrej-Blue"
                        btntext="View All Payment Plans⚡"
                        modalheading="View All Payment Plans"
                        clickevent={() => setShowAll(true)}
                    />
                </div>
            </div>
        </section>
    );
};

export default PaymentPlan;
