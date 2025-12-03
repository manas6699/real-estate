import React from "react";

type Props = {
    scheduleDate: string;
    scheduleTime: string;
    setScheduleDate: (val: string) => void;
    setScheduleTime: (val: string) => void;
    error?: string;
};

const ScheduleSection = ({ scheduleDate, scheduleTime, setScheduleDate, setScheduleTime, error }: Props) => {
    return (
        <>
            {/* Date Input */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <label className="mb-2 text-sm font-bold text-blue-800 flex items-center">
                    📅 Schedule Call Date
                    {scheduleDate && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Set</span>}
                </label>
                <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
            </div>

            {/* Time Input */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <label className="mb-2 text-sm font-bold text-blue-800 flex items-center">
                    🕐 Schedule Call Time
                </label>
                <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${scheduleDate && !scheduleTime ? "border-red-500" : "border-blue-300"
                        }`}
                />
                {scheduleDate && scheduleTime && (
                    <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                        <p className="text-xs text-green-800 font-medium">
                            ✅ Complete schedule: {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
    );
};

export default ScheduleSection;