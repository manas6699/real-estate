'use client'

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  priceRange: z.string(),
  backgroundImage: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'Background image is required',
    }),

  galleryImages: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList && val.length > 0, {
      message: 'At least one gallery image is required',
    }),
  configuration: z.string(),
  possessionDate: z.string(),
  unitsSold: z.coerce.number(),
  landArea: z.string(),
  propertyType: z.string(),
  propertySize: z.string(),
  noOfBlocks: z.coerce.number(),
  floors: z.coerce.number(),
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
  const {
    register,
    control,
    handleSubmit  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      features: [{ featureIcon: [''], featureTitle: '', featureDescription: '' }],
      paymentPlan: [{ unitType: '', size: '', price: '' }]
    }
  });

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
      const formData = new FormData();
      formData.append('backgroundImage', data.backgroundImage[0]);

      for (let i = 0; i < data.galleryImages.length; i++) {
        formData.append('galleryImages', data.galleryImages[i]);
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

      const res = await axios.post('http://localhost:8000/api/mmr/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Form submitted successfully');
      console.log(res.data);
    } catch (error) {
      alert('Error submitting form');
      console.error(error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-4xl mx-auto">
      <input {...register('title')} placeholder="Title" className="input" />
      <input {...register('description')} placeholder="Description" className="input" />

      <div className="mb-4">
        <label className="block font-semibold mb-1">Background Image</label>
        <input
          type="file"
          accept="image/*"
          {...register('backgroundImage', { required: true })}
          className="block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <input {...register('priceRange')} placeholder="Price Range" className="input" />
      <input {...register('configuration')} placeholder="Configuration" className="input" />
      <input {...register('possessionDate')} placeholder="Possession Date" className="input" />
      <input {...register('unitsSold')} placeholder="Units Sold" type="number" className="input" />
      <input {...register('landArea')} placeholder="Land Area" className="input" />
      <input {...register('propertyType')} placeholder="Property Type" className="input" />
      <input {...register('propertySize')} placeholder="Property Size" className="input" />
      <input {...register('noOfBlocks')} placeholder="No. of Blocks" type="number" className="input" />
      <input {...register('floors')} placeholder="Floors" type="number" className="input" />
      <input {...register('noOfUnits')} placeholder="No. of Units" type="number" className="input" />
      <input {...register('reraId')} placeholder="RERA ID" className="input" />
      <input {...register('iframeSource')} placeholder="Google Map Iframe Source" className="input" />

      <div className="mb-4">
        <label className="block font-semibold mb-1">Gallery Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          {...register('galleryImages')}
          className="block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold">Features</h3>
        {featureFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-3 gap-2">
            <input {...register(`features.${index}.featureIcon.0`)} placeholder="Icon" className="input" />
            <input {...register(`features.${index}.featureTitle`)} placeholder="Title" className="input" />
            <input {...register(`features.${index}.featureDescription`)} placeholder="Description" className="input" />
          </div>
        ))}
        <button type="button" onClick={() => appendFeature({ featureIcon: [''], featureTitle: '', featureDescription: '' })} className="btn">Add Feature</button>
      </div>

      <textarea {...register('developerDescription')} placeholder="Developer Description" className="input" />
      <textarea {...register('projectOverview')} placeholder="Project Overview" className="input" />

      <div>
        <h3 className="text-lg font-semibold">Payment Plan</h3>
        {paymentFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-3 gap-2">
            <input {...register(`paymentPlan.${index}.unitType`)} placeholder="Unit Type" className="input" />
            <input {...register(`paymentPlan.${index}.size`)} placeholder="Size" className="input" />
            <input {...register(`paymentPlan.${index}.price`)} placeholder="Price" className="input" />
          </div>
        ))}
        <button type="button" onClick={() => appendPayment({ unitType: '', size: '', price: '' })} className="btn">Add Payment Plan</button>
      </div>

      <textarea {...register('highlights')} placeholder="Highlights (HTML)" className="input" />
      <input {...register('unitsSoldPercentage')} placeholder="Units Sold %" type="number" className="input" />

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}


