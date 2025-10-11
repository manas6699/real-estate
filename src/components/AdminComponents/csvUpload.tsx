"use client";

import axios from "axios";
import Papa from "papaparse";
import { whoami } from "@/utils/whoami";
import React, { useState, useRef } from "react";

import { toast, ToastContainer } from "react-toastify";
import { ChevronDown, FileUp, Loader2, XCircle } from "lucide-react";
import { BULK_UPLOAD_AND_ASSIGN, BULK_UPLOAD_API, GET_ALL_TELECALLERS_API } from "@/config/api";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

type CSVRow = Record<string, string>;

export default function CsvUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<CSVRow[]>([]);
    const [phoneError, setPhoneError] = useState<string | null>(null);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telecallers, setTelecallers] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [uploadingAssign, setUploadingAssign] = useState(false);
    const [loadingTelecallers, setLoadingTelecallers] = useState(false);
    const [selectedTelecaller, setSelectedTelecaller] = useState<{ id: string; name: string } | null>(null);

    const resetForm = () => {
        setFile(null);
        setPreview([]);
        setError(null);
        setSelectedTelecaller(() => null)
        setPhoneError(() => null)
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = () => {
        // Trigger the download
        const link = document.createElement('a');
        link.href = '/sample/test-bulk.csv'; // Path in the public folder
        link.download = 'test-bulk.csv'; // Suggested filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleUploadAndAssign = async () => {
        const assigend_lead_by = whoami()
        if (!assigend_lead_by) {
            setError("Uploader ID not found. Please log in again.");
            return;
        }
        const formattedDate = new Date().toLocaleString();
        if (!file) {
            setError("Please select a file first.");
            return;
        }
        if (!selectedTelecaller) {
            setError("Please select a telecaller to assign leads.");
            return;
        }

        setUploadingAssign(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("assignee_id", selectedTelecaller.id);
            formData.append("assignee_name", selectedTelecaller.name);
            formData.append("upload_by", assigend_lead_by);
            formData.append("history", `This Lead is Bulk-Assigned to ${selectedTelecaller.name} at Date : ${formattedDate}`)

            const res = await axios.post(BULK_UPLOAD_AND_ASSIGN, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(
                `✅ ${res.data.successCount} leads uploaded & assigned to ${selectedTelecaller.name}`,
                {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                }
            );

            resetForm();
            setSelectedTelecaller(null);
            setDropdownOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
            toast.error(err.response?.data?.message || "❌ Upload & Assign failed", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        } finally {
            setUploadingAssign(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const f = e.target.files?.[0];
        if (!f) return;

        if (f.size > MAX_FILE_BYTES) {
            setError("File is too large. Max allowed size is 10 MB.");
            return;
        }

        if (!f.name.toLowerCase().endsWith(".csv")) {
            setError("Invalid file type. Please upload a .csv file.");
            return;
        }

        setFile(f);

        // parse CSV preview
        Papa.parse<CSVRow>(f, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data;
                setPreview(results.data.slice(0, 5)); // show only first 5 rows

                const firstRow = rows[0];

                // --- A. Header Mismatch / Missing Column Check ---
                // Check if 'phone' header is missing or if all rows are empty
                if (!firstRow || !results.meta.fields?.includes('PHONE')) {
                    setPhoneError("Error: Missing 'PHONE' column or invalid CSV header. Please ensure your CSV file has a column named 'PHONE'.");
                    return;
                }

                // validate phone numbers
                const invalidRows = rows.filter(
                    (row) => !/^\d{10}$/.test(row.PHONE?.trim() || "")
                );
                if (invalidRows.length > 0) {
                    setPhoneError(`${invalidRows.length} rows have invalid phone number format. Please ensure the phone number in the 'PHONE' column is exactly 10 digits.`)
                }
                else {
                    setPhoneError(null)
                }
            },
        });
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        const uploaderId = whoami()
        if (!uploaderId) {
            setError("Uploader ID not found. Please log in again.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_by", uploaderId);
            const res = await axios.post(BULK_UPLOAD_API, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(`✅ ${res.data.count} leads uploaded successfully`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            resetForm();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
            toast.error(err.response?.data?.message || "❌ Upload failed", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        } finally {
            setUploading(false);
        }
    };

    const fetchTelecallers = async () => {
        try {
            setLoadingTelecallers(true);
            const res = await axios.get(GET_ALL_TELECALLERS_API);
            if (res.data.success) {
                setTelecallers(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching telecallers:", err);
        } finally {
            setLoadingTelecallers(false);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        if (!dropdownOpen && telecallers.length === 0) {
            fetchTelecallers();
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Bulk Upload Leads</h1>
            <div>
                <p className="mb-2">
                    Download Sample CSV File &nbsp;
                    <button onClick={handleSubmit} className="text-blue-500 underline cursor-pointer" >
                        here
                    </button>
                </p>
            </div>
            {/* File input */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        handleFileChange({ target: { files: e.dataTransfer.files } } as any);
                    }
                }}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 transition bg-gray-50"
            >
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <FileUp size={80} className="mx-auto text-purple-500 mb-2" />
                {file ? (
                    <p className="text-sm text-gray-700">
                        Selected: <strong>{file.name}</strong>
                    </p>
                ) : (
                    <p className="text-sm text-gray-500">Click or drag & drop CSV here</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Max size: 10 MB</p>
                <p className="text-xs text-gray-400 mt-1">Or 15,000 records max</p>
            </div>

            {/* Phone Error */}
            {phoneError && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded flex items-center">
                    <XCircle className="mr-2" size={18} /> {phoneError}
                </div>
            )}

            {/* CSV Preview */}
            {preview.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-md font-semibold text-gray-700 mb-2">Preview (first 5 rows)</h2>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    {Object.keys(preview[0]).map((key) => (
                                        <th key={key} className="px-3 py-2 text-left border-b text-gray-700">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((row, i) => (
                                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} className="px-3 py-2 border-b text-gray-600">
                                                {val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded flex items-center">
                    <XCircle className="mr-2" size={18} /> {error}
                </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={resetForm}
                    disabled={!file && !error && !selectedTelecaller}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-medium rounded-lg transition disabled:opacity-50"
                >
                    Reset
                </button>

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading || !!phoneError || !!selectedTelecaller}
                    className="cursor-pointer ml-5 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={18} /> Uploading...
                        </>
                    ) : (
                        "Upload"
                    )}
                </button>
                {/* Upload & Assign trigger */}
                <div className="relative ml-5">
                    <div className="flex">
                        <button
                            onClick={handleUploadAndAssign}
                            disabled={!file || uploadingAssign || !selectedTelecaller || !!phoneError}
                            className="cursor-pointer px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-l-lg flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadingAssign ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} /> Assigning...
                                </>
                            ) : (
                                selectedTelecaller ? `Assign to ${selectedTelecaller.name}` : "Upload & Assign"
                            )}
                        </button>
                        <button
                            onClick={toggleDropdown}
                            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-r-lg flex items-center cursor-pointer"
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>

                </div>
                {/* Dropdown menu */}
                {dropdownOpen && (
                    <div className="absolute right-14 mt-12 bg-white rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                        {loadingTelecallers ? (
                            <div className="px-4 py-2 text-gray-500">Loading...</div>
                        ) : telecallers.length > 0 ? (
                            telecallers.map((t) => (
                                <div
                                    key={t.id}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${selectedTelecaller?.id === t.id ? "bg-orange-100 font-semibold" : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedTelecaller({ id: t.id, name: t.name });
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {t.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500">No telecallers found</div>
                        )}
                    </div>
                )}

                {/* Toast container */}
                <ToastContainer />
            </div>
        </div>
    );
}
