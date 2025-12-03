import React from "react";

type Telecaller = {
    id: string;
    name: string;
    role: string;
    online: boolean;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    telecallers: Telecaller[];
    onTransfer: (telecaller: Telecaller) => void;
    remarks: string;
    setRemarks: (val: string) => void;
};

const transferStatus = ["Agent Switch", "Cold", "Warm", "Refer", "Hot"];

const TransferLeadModal = ({ isOpen, onClose, telecallers, onTransfer, remarks, setRemarks }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">🔄 Transfer Lead</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transfer Reason</label>
                    <select
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="" disabled>Select reason</option>
                        {transferStatus.map((reason) => (
                            <option key={reason} value={reason}>{reason}</option>
                        ))}
                    </select>
                </div>

                <div className="max-h-60 overflow-y-auto border-t pt-3">
                    {telecallers.length > 0 ? (
                        telecallers.map((tc) => (
                            <div key={tc.id} className="flex justify-between items-center border-b py-2">
                                <span className="font-medium">{tc.name}</span>
                                <button
                                    type="button"
                                    onClick={() => onTransfer(tc)}
                                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                                >
                                    Transfer
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No telecallers available</p>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferLeadModal;