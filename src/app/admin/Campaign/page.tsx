"use client";

import axios from 'axios';
import Select from 'react-select';
import Loader from '@/components/loader';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import Navbar from '@/components/AdminComponents/Navbar'
import Sidebar from '@/components/AdminComponents/Sidebar'
import { CREATE_CAMPAIGN, GET_ALL_TELECALLERS_API } from '@/config/api';


type CampaignFormData = {
  name: string;
  source: string;
  telecallerIds: string[]; // ✅ should be string[]
  auto_assign: boolean;
};

type Telecaller = {
  id: string; // ✅ matches your API
  name: string;
  role: string;
  online: boolean;
};

const CampaignPage = () => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    source: "",
    telecallerIds: [],
    auto_assign: false,
  });

  const [telecallers, setTelecallers] = useState<Telecaller[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch telecallers on mount
  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        const response = await axios.get(GET_ALL_TELECALLERS_API);
        setTelecallers(response.data.data || []); // ✅ your API returns { success, data }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load telecallers");
      }
    };
    fetchTelecallers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const telecallerOptions = telecallers.map(tc => ({
    value: tc.id,
    label: tc.name,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTelecallerSelect = (selectedOptions: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setFormData(prev => ({
      ...prev,
      telecallerIds: selectedIds,
    }));
  };


  const toggleAutoAssign = () => {
    setFormData((prev) => ({ ...prev, auto_assign: !prev.auto_assign }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        source: formData.source,
        auto_assign: formData.auto_assign,
        telecallerIds: formData.telecallerIds,
      };

      await axios.post(CREATE_CAMPAIGN, payload);

      toast.success("Campaign created successfully!");

      setFormData({
        name: "",
        source: "",
        telecallerIds: [],
        auto_assign: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
        <Sidebar />
        <div className="p-6 text-xl font-semibold mb-4 flex-1 lg:ml-64">
          <div className="mb-2">
            <Navbar />
          </div>
          <h1 className='text-2xl font-bold  mb-6'>
            Start a New Campaign
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Campaign Name"
              required
              className="border px-3 py-2 rounded w-full text-sm"
            />

            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter Project Name"
              required
              className="border px-3 py-2 rounded w-full text-sm"
            />

            <div>
              <label className="block text-sm mb-1">Select Telecallers</label>
              <Select
                isMulti
                options={telecallerOptions}
                value={telecallerOptions.filter(option => formData.telecallerIds.includes(option.value))}
                onChange={handleTelecallerSelect}
                className="text-sm"
                classNamePrefix="react-select"
                placeholder="Select Telecallers..."
              />
            </div>


            <div className="flex items-center gap-3">
              <label className="text-sm">Auto Assign:</label>
              <button
                type="button"
                onClick={toggleAutoAssign}
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ${formData.auto_assign ? "bg-green-500" : ""
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${formData.auto_assign ? "translate-x-6" : ""
                    }`}
                ></div>
              </button>
              <span className="text-xs">
                {formData.auto_assign ? "ON" : "OFF"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white py-2 rounded hover:bg-orange-600 text-sm"
            >
              {loading ?
                <div className="flex justify-center items-center">
                  <Loader color="white" />
                </div>
                : "Create Campaign"}
            </button>
          </form>

          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
      </main>
    </div>
  );
};

export default CampaignPage;
