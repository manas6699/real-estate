'use client';

import React, { useState } from 'react';
import {
    Building2,       // Replaces BuildingOffice2Icon
    Home,            // Replaces HomeIcon
    MapPin,          // Replaces MapPinIcon
  
    FileUp,          // Replaces DocumentArrowUpIcon
   
    Sparkles         // Replaces SparklesIcon
} from 'lucide-react';
import Sidebar from '@/components/AdminComponents/Sidebar';
import Navbar from '@/components/AdminComponents/Navbar';

// --- TYPE DEFINITIONS ---

// Define the structure for the form's state
interface PropertyFormData {
    listingType: 'rent' | 'sale';
    propertyType: 'complex' | 'standalone' | 'individual';
    complexName: string;
    location: string;
    configuration: string;
    superBuiltUpArea: string;
    carpetArea: string;
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    totalFloors: string;
    propertyOnFloor: string;
    furnishing: 'unfurnished' | 'semifurnished' | 'furnished';
    vastuCompliant: boolean;
    liftAvailable: boolean;
    parking: string;
    view: string;
    price: string;
    rent: string;
    securityDeposit: string;
    maintenanceIncluded: boolean;
    nearbyLandmarks: string;
    amenities: {
        clubhouse: boolean;
        swimmingPool: boolean;
        gym: boolean;
        communityHall: boolean;
        badmintonCourt: boolean;
        cafeterIA: boolean;
        gasPipeline: boolean;
    };
    floorPlan: File | null;
}

// Define the initial empty state
const initialState: PropertyFormData = {
    listingType: 'rent',
    propertyType: 'complex',
    complexName: '',
    location: '',
    configuration: '2BHK',
    superBuiltUpArea: '',
    carpetArea: '',
    bedrooms: '2',
    bathrooms: '2',
    balconies: '1',
    totalFloors: '',
    propertyOnFloor: '',
    furnishing: 'unfurnished',
    vastuCompliant: false,
    liftAvailable: false,
    parking: 'none',
    view: '',
    price: '',
    rent: '',
    securityDeposit: '',
    maintenanceIncluded: false,
    nearbyLandmarks: '',
    amenities: {
        clubhouse: false,
        swimmingPool: false,
        gym: false,
        communityHall: false,
        badmintonCourt: false,
        cafeterIA: false,
        gasPipeline: false,
    },
    floorPlan: null,
};

// --- HELPER COMPONENTS ---

// A reusable component for each form field
const FormField: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-900">
            {label}
        </label>
        <div className="mt-2">
            {children}
        </div>
    </div>
);

// A reusable styled input
const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
);

// A reusable styled select
const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select
        {...props}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    >
        {props.children}
    </select>
);

// A reusable styled checkbox
const StyledCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="relative flex items-center gap-x-3">
        <div className="flex h-6 items-center">
            <input
                {...props}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
        </div>
        <div className="text-sm leading-6">
            <label htmlFor={props.id} className="font-medium text-gray-900">
                {label}
            </label>
        </div>
    </div>
);

// --- MAIN FORM COMPONENT ---

const PropertyForm: React.FC = () => {
    const [formData, setFormData] = useState<PropertyFormData>(initialState);

    // --- EVENT HANDLERS ---

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            amenities: { ...prev.amenities, [name]: checked },
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setFormData(prev => ({ ...prev, floorPlan: file }));
        }
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // Here you would typically send the data to your API endpoint
        // e.g., await fetch('/api/properties', { method: 'POST', body: JSON.stringify(formData) });
        alert("Form submitted! Check the console for the form data.");
    };

    // --- RENDER ---

    return (
        <div className="bg-gray-50 min-h-screen p-8 sm:p-8">
            <Navbar/>
            <Sidebar/>
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-lg"
            >
                {/* Header */}
                <div className="">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">List New Property</h1>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        Please fill in all details about the property.
                    </p>
                </div>

                {/* Form Sections */}
                <div className="mt-10 space-y-12">

                    {/* --- Section 1: Basic Information --- */}
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 flex items-center gap-x-2">
                            <Home className="w-6 h-6 text-indigo-600" />
                            Basic Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Key details about the property listing and type.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Listing Type</label>
                                <div className="mt-2 flex gap-x-6">
                                    <div className="flex items-center gap-x-2">
                                        <input id="rent" name="listingType" type="radio" value="rent" checked={formData.listingType === 'rent'} onChange={handleRadioChange} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label htmlFor="rent" className="block text-sm font-medium leading-6 text-gray-900">For Rent</label>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <input id="sale" name="listingType" type="radio" value="sale" checked={formData.listingType === 'sale'} onChange={handleRadioChange} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label htmlFor="sale" className="block text-sm font-medium leading-6 text-gray-900">For Sale</label>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Property Type" htmlFor="propertyType">
                                    <StyledSelect id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                                        <option value="complex">Apartment Complex</option>
                                        <option value="standalone">Standalone Building</option>
                                        <option value="individual">Individual House / Villa</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            {formData.propertyType === 'complex' && (
                                <div className="sm:col-span-6">
                                    <FormField label="Complex / Society Name" htmlFor="complexName">
                                        <StyledInput id="complexName" name="complexName" type="text" value={formData.complexName} onChange={handleChange} />
                                    </FormField>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Section 2: Location & Price --- */}
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 flex items-center gap-x-2">
                            <MapPin className="w-6 h-6 text-indigo-600" />
                            Location & Pricing
                        </h2>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <FormField label="Location / Address" htmlFor="location">
                                    <StyledInput id="location" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="e.g., 123 Main St, Kolkata" />
                                </FormField>
                            </div>

                            <div className="sm:col-span-6">
                                <FormField label="Nearby Landmarks" htmlFor="nearbyLandmarks">
                                    <StyledInput id="nearbyLandmarks" name="nearbyLandmarks" type="text" value={formData.nearbyLandmarks} onChange={handleChange} placeholder="e.g., Near City Centre Mall, 5 min from Metro" />
                                </FormField>
                            </div>

                            {/* Conditional Price/Rent Fields */}
                            {formData.listingType === 'sale' ? (
                                <div className="sm:col-span-3">
                                    <FormField label="Total Price" htmlFor="price">
                                        <div className="relative">
                                            <StyledInput id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g., 5000000" />
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">₹</span>
                                            </div>
                                        </div>
                                    </FormField>
                                </div>
                            ) : (
                                <>
                                    <div className="sm:col-span-3">
                                        <FormField label="Monthly Rent" htmlFor="rent">
                                            <div className="relative">
                                                <StyledInput id="rent" name="rent" type="number" value={formData.rent} onChange={handleChange} placeholder="e.g., 25000" />
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                                </div>
                                            </div>
                                        </FormField>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <FormField label="Security Deposit" htmlFor="securityDeposit">
                                            <div className="relative">
                                                <StyledInput id="securityDeposit" name="securityDeposit" type="number" value={formData.securityDeposit} onChange={handleChange} placeholder="e.g., 50000" />
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                                </div>
                                            </div>
                                        </FormField>
                                    </div>
                                    <div className="sm:col-span-6">
                                        <StyledCheckbox id="maintenanceIncluded" name="maintenanceIncluded" label="Maintenance charge included in rent" checked={formData.maintenanceIncluded} onChange={handleCheckboxChange} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- Section 3: Property Details --- */}
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 flex items-center gap-x-2">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                            Property Details
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Specifics about the property&apos;s layout and size.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormField label="Configuration" htmlFor="configuration">
                                    <StyledSelect id="configuration" name="configuration" value={formData.configuration} onChange={handleChange}>
                                        <option>1 BHK</option>
                                        <option>2 BHK</option>
                                        <option>3 BHK</option>
                                        <option>4 BHK</option>
                                        <option>5+ BHK</option>
                                        <option>Studio</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Furnishing Status" htmlFor="furnishing">
                                    <StyledSelect id="furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange}>
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="semifurnished">Semi-Furnished</option>
                                        <option value="furnished">Fully-Furnished</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Super Built-up Area (sqft)" htmlFor="superBuiltUpArea">
                                    <StyledInput id="superBuiltUpArea" name="superBuiltUpArea" type="number" value={formData.superBuiltUpArea} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Carpet Area (sqft)" htmlFor="carpetArea">
                                    <StyledInput id="carpetArea" name="carpetArea" type="number" value={formData.carpetArea} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-2">
                                <FormField label="Bedrooms" htmlFor="bedrooms">
                                    <StyledInput id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-2">
                                <FormField label="Bathrooms" htmlFor="bathrooms">
                                    <StyledInput id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-2">
                                <FormField label="Balconies" htmlFor="balconies">
                                    <StyledInput id="balconies" name="balconies" type="number" value={formData.balconies} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Total Floors in Building" htmlFor="totalFloors">
                                    <StyledInput id="totalFloors" name="totalFloors" type="number" value={formData.totalFloors} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Property on Floor" htmlFor="propertyOnFloor">
                                    <StyledInput id="propertyOnFloor" name="propertyOnFloor" type="number" value={formData.propertyOnFloor} onChange={handleChange} />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Balcony View" htmlFor="view">
                                    <StyledInput id="view" name="view" type="text" value={formData.view} onChange={handleChange} placeholder="e.g., Garden facing, Road side" />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Parking" htmlFor="parking">
                                    <StyledSelect id="parking" name="parking" value={formData.parking} onChange={handleChange}>
                                        <option value="none">No Parking</option>
                                        <option value="bike">Bike Only</option>
                                        <option value="1car">1 Car</option>
                                        <option value="2car">2 Cars</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            <div className="sm:col-span-3 flex items-end">
                                <StyledCheckbox id="vastuCompliant" name="vastuCompliant" label="Vastu Compliant" checked={formData.vastuCompliant} onChange={handleCheckboxChange} />
                            </div>

                            <div className="sm:col-span-3 flex items-end">
                                <StyledCheckbox id="liftAvailable" name="liftAvailable" label="Lift Available" checked={formData.liftAvailable} onChange={handleCheckboxChange} />
                            </div>

                        </div>
                    </div>

                    {/* --- Section 4: Amenities --- */}
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 flex items-center gap-x-2">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                            Amenities
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Select all available amenities.</p>

                        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                            <StyledCheckbox id="clubhouse" name="clubhouse" label="Clubhouse" checked={formData.amenities.clubhouse} onChange={handleAmenityChange} />
                            <StyledCheckbox id="swimmingPool" name="swimmingPool" label="Swimming Pool" checked={formData.amenities.swimmingPool} onChange={handleAmenityChange} />
                            <StyledCheckbox id="gym" name="gym" label="Gym" checked={formData.amenities.gym} onChange={handleAmenityChange} />
                            <StyledCheckbox id="communityHall" name="communityHall" label="Community Hall" checked={formData.amenities.communityHall} onChange={handleAmenityChange} />
                            <StyledCheckbox id="badmintonCourt" name="badmintonCourt" label="Badminton Court" checked={formData.amenities.badmintonCourt} onChange={handleAmenityChange} />
                            <StyledCheckbox id="cafeterIA" name="cafeterIA" label="Cafeteria" checked={formData.amenities.cafeterIA} onChange={handleAmenityChange} />
                            <StyledCheckbox id="gasPipeline" name="gasPipeline" label="Gas Pipeline" checked={formData.amenities.gasPipeline} />
                        </div>
                    </div>

                    {/* --- Section 5: Floor Plan Upload --- */}
                    <div>
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 flex items-center gap-x-2">
                            <FileUp className="w-6 h-6 text-indigo-600" />
                            Uploads
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Upload the property&apos;s floor plan.</p>
                        <div className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <FileUp className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="floorPlan"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="floorPlan" name="floorPlan" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
                                {formData.floorPlan && (
                                    <p className="mt-2 text-sm font-medium text-green-600">
                                        File selected: {formData.floorPlan.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Form Submission --- */}
                <div className="mt-12 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit Property
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;