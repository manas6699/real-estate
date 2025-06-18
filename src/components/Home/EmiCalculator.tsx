'use client';

import React, { useState, useEffect, useCallback } from 'react';

const EmiCalculator: React.FC = () => {
    const [loanAmount, setLoanAmount] = useState(500000); // ₹5,00,000
    const [interestRate, setInterestRate] = useState(8.5); // 8.5% annual
    const [tenure, setTenure] = useState(20); // 20 years

    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    const calculateEmi = useCallback(() => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 12 / 100;
        const numberOfMonths = tenure * 12;

        const emiCalc =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
            (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

        const total = emiCalc * numberOfMonths;
        const interest = total - principal;

        setEmi(emiCalc);
        setTotalInterest(interest);
        setTotalPayment(total);
    }, [loanAmount, interestRate, tenure]);

    useEffect(() => {
        calculateEmi();
    }, [calculateEmi]);

    return (
        <section className="bg-yellow-50 py-10">

        <div className="w-full max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">EMI Calculator</h2>

            {/* Loan Amount */}
            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Loan Amount (₹)</label>
                <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={10000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                />
                <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="mt-2 border rounded px-3 py-2 w-full"
                />
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Interest Rate (% p.a.)</label>
                <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full"
                />
                <input
                    type="number"
                    value={interestRate}
                    step={0.1}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="mt-2 border rounded px-3 py-2 w-full"
                />
            </div>

            {/* Tenure */}
            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Tenure (Years)</label>
                <input
                    type="range"
                    min={1}
                    max={30}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full"
                />
                <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="mt-2 border rounded px-3 py-2 w-full"
                />
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-6">
                <div className="bg-green-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Monthly EMI</p>
                    <p className="text-xl font-bold text-green-800">₹{emi.toFixed(0)}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-xl font-bold text-yellow-800">₹{totalInterest.toFixed(0)}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Total Payment</p>
                    <p className="text-xl font-bold text-blue-800">₹{totalPayment.toFixed(0)}</p>
                </div>
            </div>
        </div>
        </section>
    );
};

export default EmiCalculator;
