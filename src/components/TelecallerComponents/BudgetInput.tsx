"use client";
import React, { useState, useEffect } from "react";

type BudgetInputProps = {
    value: string;
    onChange: (val: string) => void;
};

export default function BudgetInput({ value, onChange }: BudgetInputProps) {
    const [amount, setAmount] = useState("");
    const [unit, setUnit] = useState<"Lakh" | "Cr">("Lakh");

    // Sync if value comes from parent (edit case)
    useEffect(() => {
        if (value) {
            const [num, unitFromValue] = value.split(" ");
            if (num) setAmount(num);
            if (unitFromValue === "Lakh" || unitFromValue === "Cr") {
                setUnit(unitFromValue);
            }
        }
    }, [value]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAmount(val);
        onChange(`${val} ${unit}`);
    };

    const handleUnitChange = (newUnit: "Lakh" | "Cr") => {
        setUnit(newUnit);
        onChange(`${amount} ${newUnit}`);
    };

    return (
        <div className="flex items-center gap-3">
            {/* Amount Input */}
            <input
                type="number"
                min="0"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter budget"
                className="w-32 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />

            {/* Toggle Switch */}
            <div className="flex rounded-full bg-gray-100 p-1 shadow-inner">
                {["Lakh", "Cr"].map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => handleUnitChange(opt as "Lakh" | "Cr")}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${unit === opt
                                ? "bg-orange-500 text-white shadow"
                                : "text-gray-600 hover:text-black"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
