'use client'

import axios from 'axios';
import * as z from 'zod';
import Image from 'next/image';
import React, { useState } from 'react';
import Loader from '@/components/loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';


import { BACKEND_ADMIN_POST_API } from '@/config/api';
import Navbar from '@/components/AdminComponents/Navbar';
import { toast ,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// BUG
// add pdf fields .
// add a spinner in the submit button.
// remove display Images bug
// add html textbox
// replace the alart to toast.
// Reset the form after submitting .

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  priceRange: z.string(),
  backgroundImage: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'Background image is required',
    }),

  developerLogo: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'Developer logo is required',
    }),

  galleryImages: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'At least one gallery image is required',
    }),
  floorPlanImages: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'At least one floor plan image is required',
    }),

  brochurePdf: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'Brochure PDF is required',
    }),

  floorPlanPdf: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'Floor Plans PDF is required',
    }),

  configuration: z.string(),
  possessionDate: z.string(),
  unitsSold: z.coerce.number(),
  landArea: z.string(),
  propertyType: z.string(),
  propertySize: z.string(),
  noOfBlocks: z.coerce.number(),
  floors: z.string(),
  noOfUnits: z.coerce.number(),
  reraId: z.string(),
  iframeSource: z.string(),
  features: z.array(
    z.object({
      featureIcon: z.array(z.string()),
      featureTitle: z.string(),
      featureDescription: z.string()
    })
  ),
  developerDescription: z.string(),
  projectOverview: z.string(),
  paymentPlan: z.array(
    z.object({
      unitType: z.string(),
      size: z.string(),
      price: z.string()
    })
  ),
  highlights: z.string(),
  unitsSoldPercentage: z.coerce.number()
});

type ProjectFormData = z.infer<typeof projectSchema>;



export default function ProjectForm() {

  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState<string[]>([]);
  const [developerLogoPreview, setDeveloperLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      features: [{ featureIcon: [''], featureTitle: '', featureDescription: '' }],
      paymentPlan: [{ unitType: '', size: '', price: '' }]
    }
  });

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(urls);
  };

  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(file => URL.createObjectURL(file));
    setFloorPlanPreviews(urls);
  };

  const handleDeveloperLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDeveloperLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeFloorPlanImage = (index: number) => {
    setFloorPlanPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeBackgroundImage = () => {
    setBackgroundPreview(null);
  };

  const removeDeveloperLogo = () => {
    setDeveloperLogoPreview(null);
  };


  const { fields: featureFields, append: appendFeature } = useFieldArray({
    control,
    name: 'features'
  });

  const { fields: paymentFields, append: appendPayment } = useFieldArray({
    control,
    name: 'paymentPlan'
  });


  const onSubmit = async (data: ProjectFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('backgroundImage', data.backgroundImage[0]);
      formData.append('developerLogo', data.developerLogo[0]);

      for (let i = 0; i < data.galleryImages.length; i++) {
        formData.append('galleryImages', data.galleryImages[i]);
      }

      for (let i = 0; i < data.floorPlanImages.length; i++) {
        formData.append('floorPlanImages', data.floorPlanImages[i]);
      }

      for (let i = 0; i < data.brochurePdf.length; i++) {
        formData.append('brochurePdf', data.brochurePdf[i]);
      }
      for (let i = 0; i < data.floorPlanPdf.length; i++) {
        formData.append('floorPlanPdf', data.floorPlanPdf[i]);
      }

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('priceRange', data.priceRange);
      formData.append('configuration', data.configuration);
      formData.append('possessionDate', data.possessionDate);
      formData.append('unitsSold', String(data.unitsSold));
      formData.append('landArea', data.landArea);
      formData.append('propertyType', data.propertyType);
      formData.append('propertySize', data.propertySize);
      formData.append('noOfBlocks', String(data.noOfBlocks));
      formData.append('floors', String(data.floors));
      formData.append('noOfUnits', String(data.noOfUnits));
      formData.append('reraId', data.reraId);
      formData.append('iframeSource', data.iframeSource);
      formData.append('developerDescription', data.developerDescription);
      formData.append('projectOverview', data.projectOverview);
      formData.append('highlights', data.highlights);
      formData.append('unitsSoldPercentage', String(data.unitsSoldPercentage));

      // Convert arrays to JSON strings
      formData.append('features', JSON.stringify(data.features));
      formData.append('paymentPlan', JSON.stringify(data.paymentPlan));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axios.post(
        `${BACKEND_ADMIN_POST_API}/create`,
         formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      toast.success('Project created successfully!');
      // Reset form state
      setBackgroundPreview(null);
      setDeveloperLogoPreview(null);
      setGalleryPreviews([]);
      setFloorPlanPreviews([]);
      // Reset the form fields
      document.querySelector('form')?.reset();

      // Revoke object URLs to free memory
      if (backgroundPreview) URL.revokeObjectURL(backgroundPreview);
      if (developerLogoPreview) URL.revokeObjectURL(developerLogoPreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
      floorPlanPreviews.forEach(url => URL.revokeObjectURL(url));

    } catch (error) {
      setLoading(false);
      // toast in stead of alert
      toast.error('Error creating project');
      console.error(error);
    }
  };


  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-4xl mx-auto">
        <div>
          <label className="block font-semibold mb-1">Project Title</label>
          <input {...register('title')} placeholder="Title" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Project Description</label>
          <input {...register('description')} placeholder="Description" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Background Image</label>
          <input
            type="file"
            accept="image/*"
            {...register('backgroundImage')}
            onChange={handleBackgroundChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          {backgroundPreview && (
            <div className="mt-2 relative w-40">
              <Image
                width={160}
                height={90}
                src={backgroundPreview}
                alt="Preview"
                className="rounded shadow-md"
              />
              <button
                type="button"
                onClick={removeBackgroundImage}
                className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 text-xs rounded"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Developer Logo</label>
          <input
            type="file"
            accept="image/*"
            {...register('developerLogo')}
            onChange={handleDeveloperLogoChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          {developerLogoPreview && (
            <div className="mt-2 relative w-40">
              <Image
                width={160}
                height={90}
                src={developerLogoPreview}
                alt="Developer Logo Preview"
                className="rounded shadow-md"
              />
              <button
                type="button"
                onClick={removeDeveloperLogo}
                className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 text-xs rounded"
              >
                ✕
              </button>
            </div>
          )}
        </div>


        <div>
          <label className="block font-semibold mb-1">Price Range</label>
          <input {...register('priceRange')} placeholder="Price Range" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Configuration</label>
          <input {...register('configuration')} placeholder="Configuration" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Possession Date</label>
          <input {...register('possessionDate')} placeholder="Possession Date" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Units Sold</label>
          <input {...register('unitsSold')} placeholder="Units Sold" type="number" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Land Area</label>
          <input {...register('landArea')} placeholder="Land Area" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Property Type</label>
          <input {...register('propertyType')} placeholder="Property Type" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Property Size</label>
          <input {...register('propertySize')} placeholder="Property Size" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">No. of Blocks</label>
          <input {...register('noOfBlocks')} placeholder="No. of Blocks" type="number" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Floors</label>
          <input {...register('floors')} placeholder="Floors"  className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">No. of Units</label>
          <input {...register('noOfUnits')} placeholder="No. of Units" type="number" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">RERA ID</label>
          <input {...register('reraId')} placeholder="RERA ID" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Google Map Iframe Source</label>
          <input {...register('iframeSource')} placeholder="Google Map Iframe Source" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register('galleryImages')}
            onChange={handleGalleryChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {galleryPreviews.map((url, index) => (
              <div key={index} className="relative w-24">
                <Image
                  src={url}
                  alt={`Gallery ${index}`}
                  className="rounded shadow-md"
                  width={160}
                  height={90}
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 text-xs rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Floor Plan Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register('floorPlanImages')}
            onChange={handleFloorPlanChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {floorPlanPreviews.map((url, index) => (
              <div key={index} className="relative w-24">
                <Image
                  src={url}
                  alt={`Floorplan ${index}`}
                  className="rounded shadow-md"
                  width={160}
                  height={90}
                />
                <button
                  type="button"
                  onClick={() => removeFloorPlanImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 text-xs rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Features</h3>
          {featureFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold mb-1">Icon</label>
                <input {...register(`features.${index}.featureIcon.0`)} placeholder="Icon" className="input" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input {...register(`features.${index}.featureTitle`)} placeholder="Title" className="input" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input {...register(`features.${index}.featureDescription`)} placeholder="Description" className="input" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => appendFeature({ featureIcon: [''], featureTitle: '', featureDescription: '' })} className="btn mt-2">Add Feature</button>
        </div>

        <div>
          <label className="block font-semibold mb-1">Developer Description</label>
          <textarea {...register('developerDescription')} placeholder="Developer Description" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Project Overview</label>
          <textarea {...register('projectOverview')} placeholder="Project Overview" className="input" />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Payment Plan</h3>
          {paymentFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold mb-1">Unit Type</label>
                <input {...register(`paymentPlan.${index}.unitType`)} placeholder="Unit Type" className="input" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Size</label>
                <input {...register(`paymentPlan.${index}.size`)} placeholder="Size" className="input" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Price</label>
                <input {...register(`paymentPlan.${index}.price`)} placeholder="Price" className="input" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => appendPayment({ unitType: '', size: '', price: '' })} className="btn mt-2">Add Payment Plan</button>
        </div>

        <div>
          <label className="block font-semibold mb-1">Highlights (HTML)</label>
          <textarea {...register('highlights')} placeholder="Highlights (HTML)" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Units Sold %</label>
          <input {...register('unitsSoldPercentage')} placeholder="Units Sold %" type="number" className="input" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Brochure PDF</label>
          <input
            type="file"
            accept=".pdf"
            {...register('brochurePdf')}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Floor Plans PDF</label>
          <input
            type="file"
            accept=".pdf"
            {...register('floorPlanPdf')}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader color='white' />
            </div>
          ) : (
            <>Submit</>
          )}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}


