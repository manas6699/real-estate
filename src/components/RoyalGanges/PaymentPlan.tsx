

import React from 'react';
import EnquireBtn from '@/components/EnquireBtn';

const PaymentPlan = () => {
  const plans = [
    {
      unitType: 'Apartments',
      size: '1,047 - 2,387 sq ft',
      price: '₹ 81.32 L Onwards',
    },
    {
      unitType: 'Villaments',
      size: '2,103 - 4,047 sq ft',
      price: '₹ 1.45 Cr Onwards',
    },
    {
      unitType: 'Bungalows',
      size: '2,492 - 2,842 sq ft',
      price: '₹ 2.45 Cr Onwards',
    },
  ];
  

  return (
    <section className="px-4 py-12 sm:px-8 md:px-16 lg:px-24 bg-yellow-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-amber-700 text-2xl sm:text-4xl md:text-5xl font-bold mb-10 mt-5">
          Primus Ganges - Payment Plans
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
        <EnquireBtn source="emami" btntext="Receive Payment Plans⚡" modalheading="Receive Payment Plans" />


        </div>
      </div>
    </section>
  );
};

export default PaymentPlan;
