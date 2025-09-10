"use client";

import React, { useState, useRef } from "react";
import { FileUp, Loader2, XCircle } from "lucide-react";
import axios from "axios";
import Papa from "papaparse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BULK_UPLOAD_API } from "@/config/api";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

type CSVRow = Record<string, string>;

export default function BulkUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<CSVRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const resetForm = () => {
        setFile(null);
        setPreview([]);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
                setPreview(results.data.slice(0, 5)); // show only first 5 rows
            },
        });
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

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

    return (
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Bulk Upload Leads</h1>

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
                <FileUp size={80} className="mx-auto text-orange-500 mb-2" />
                {file ? (
                    <p className="text-sm text-gray-700">
                        Selected: <strong>{file.name}</strong>
                    </p>
                ) : (
                    <p className="text-sm text-gray-500">Click or drag & drop CSV here</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Max size: 10 MB</p>
            </div>

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
            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={resetForm}
                    disabled={!file && !error}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition disabled:opacity-50"
                >
                    Reset
                </button>
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={18} /> Uploading...
                        </>
                    ) : (
                        "Upload"
                    )}
                </button>
            </div>

            {/* Toast container */}
            <ToastContainer />
        </div>
    );
}
