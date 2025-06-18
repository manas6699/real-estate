

import React from 'react';
import EnquireBtn from '@/components/EnquireBtn';

const PaymentPlan = () => {
    const plans = [
        {
            unitType: '3 BHK',
            size: '1,815 - 3,953 sq ft',
            price: '₹ 2.40 Cr',
        },
        {
            unitType: '3.5 BHK',
            size: '	2,184 - 2,652 sq ftt',
            price: '₹ 2.74 Cr - 3.48 Cr',
        },
        {
            unitType: '4 BHK',
            size: '2,583 - 3,953 sq ft',
            price: '₹ 3.06 Cr Onwards',
        },
    ];


    return (
        <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-white">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-blue-400 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
                    Town-Square - Payment Plans
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
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-700 border-b">
                                        {plan.unitType}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 border-b">
                                        {plan.size}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 border-b">
                                        {plan.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='mt-5'>
                    <EnquireBtn source="town-square" btntext="Instant Call Back ⚡" modalheading="Receive Payment Plans" />
                </div>
            </div>
        </section>
    );
};

export default PaymentPlan;
