'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Building2,
    User2Icon,
    Home,
    MapPin,
    Sparkles,
} from 'lucide-react';
import { ADD_INVENTORY_API, GET_INVENTORY_API } from '@/config/api';

interface Amenities {
    clubhouse: boolean;
    swimmingPool: boolean;
    gym: boolean;
    communityHall: boolean;
    badmintonCourt: boolean;
    cafeteria: boolean;
    gasPipeline: boolean;
}

interface PropertyFormData {
    ownerName: string;
    ownerPhone: string;
    ownerAltPhone: string;
    ownerEmail: string;
    ownerType: string;
    ownerNotes: string;

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
    amenities: Amenities;
}

// API Response Type
interface ApiResponse {
    success: boolean;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    errors?: string[];
}

// Props Type
interface PropertyFormProps {
    mode?: 'add' | 'edit';
    initialData?: PropertyFormData;
    propertyId?: string;
}

// --- HELPER COMPONENTS ---

const FormField: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            {label}
        </label>
        <div>
            {children}
        </div>
    </div>
);

const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:bg-white"
    />
);

const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select
        {...props}
        className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:bg-white"
    >
        {props.children}
    </select>
);

const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:bg-white resize-none"
    />
);

const StyledCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="relative flex items-center gap-x-3 group">
        <div className="flex h-6 items-center">
            <input
                {...props}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200 cursor-pointer group-hover:scale-110"
            />
        </div>
        <div className="text-sm leading-6">
            <label htmlFor={props.id} className="font-medium text-gray-900 cursor-pointer">
                {label}
            </label>
        </div>
    </div>
);

const RadioOption: React.FC<{ id: string; name: string; value: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string }> =
    ({ id, name, value, checked, onChange, label }) => (
        <div className="flex items-center gap-x-2 group">
            <input
                id={id}
                name={name}
                type="radio"
                value={value}
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200 cursor-pointer group-hover:scale-110"
            />
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 cursor-pointer">
                {label}
            </label>
        </div>
    );

// Initial form state
const initialFormData: PropertyFormData = {
    ownerName: "",
    ownerPhone: "",
    ownerAltPhone: "",
    ownerEmail: "",
    ownerType: "owner",
    ownerNotes: "",
    listingType: 'rent',
    propertyType: 'complex',
    complexName: '',
    location: '',
    configuration: '2 BHK',
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
        cafeteria: false,
        gasPipeline: false,
    },
};

// Transform backend data to frontend form data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformBackendToFormData = (backendData: any): PropertyFormData => {
    return {
        ownerName: backendData.ownerDetails?.ownerName || "",
        ownerPhone: backendData.ownerDetails?.ownerPhone || "",
        ownerAltPhone: backendData.ownerDetails?.ownerAltPhone || "",
        ownerEmail: backendData.ownerDetails?.ownerEmail || "",
        ownerType: backendData.ownerDetails?.ownerType || "owner",
        ownerNotes: backendData.ownerDetails?.ownerNotes || "",

        listingType: backendData.listingType || 'rent',
        propertyType: backendData.propertyType || 'complex',
        complexName: backendData.complexName || '',
        location: backendData.location || '',
        configuration: backendData.configuration || '2 BHK',
        superBuiltUpArea: backendData.superBuiltUpArea?.toString() || '',
        carpetArea: backendData.carpetArea?.toString() || '',
        bedrooms: backendData.bedrooms?.toString() || '2',
        bathrooms: backendData.bathrooms?.toString() || '2',
        balconies: backendData.balconies?.toString() || '1',
        totalFloors: backendData.totalFloors?.toString() || '',
        propertyOnFloor: backendData.propertyOnFloor?.toString() || '',
        furnishing: backendData.furnishing || 'unfurnished',
        vastuCompliant: backendData.vastuCompliant || false,
        liftAvailable: backendData.liftAvailable || false,
        parking: backendData.parking || 'none',
        view: backendData.view || '',
        price: backendData.price?.toString() || '',
        rent: backendData.rent?.toString() || '',
        securityDeposit: backendData.securityDeposit?.toString() || '',
        maintenanceIncluded: backendData.maintenanceIncluded || false,
        nearbyLandmarks: backendData.nearbyLandmarks || '',
        amenities: {
            clubhouse: backendData.amenities?.clubhouse || false,
            swimmingPool: backendData.amenities?.swimmingPool || false,
            gym: backendData.amenities?.gym || false,
            communityHall: backendData.amenities?.communityHall || false,
            badmintonCourt: backendData.amenities?.badmintonCourt || false,
            cafeteria: backendData.amenities?.cafeteria || false,
            gasPipeline: backendData.amenities?.gasPipeline || false,
        },
    };
};

// --- MAIN FORM COMPONENT ---

const PropertyForm: React.FC<PropertyFormProps> = ({
    mode = 'add',
    initialData,
    propertyId
}) => {
    const [formData, setFormData] = useState<PropertyFormData>(
        initialData && mode === 'edit' ? initialData : initialFormData
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch property data when in edit mode
    useEffect(() => {
        // 1. If initialData is provided via props (e.g., from a server component), use it immediately.
        if (initialData) {
            setFormData(initialData);
            setIsFetching(false); // Assume if data is passed, it's not fetching
            return;
        }

        const fetchPropertyData = async () => {
            // 2. Only proceed with fetching if explicitly in 'edit' mode and there's a propertyId
            if (mode === 'edit' && propertyId) {
                console.log(GET_INVENTORY_API)
                try {
                    setIsFetching(true);
                    const response = await axios.get<ApiResponse>(
                        GET_INVENTORY_API(propertyId)
                    );

                    if (response.data.success && response.data.data) {
                        const transformedData = transformBackendToFormData(response.data.data);
                        // Crucial: Update state with fetched data
                        setFormData(transformedData);
                    } else {
                        throw new Error(response.data.message || 'Failed to fetch property data');
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    console.error('Error fetching property data:', error);
                    toast.error(error.message || 'Failed to load property data');
                    // Ensure form fields are reset to initial defaults on failure in edit mode
                    setFormData(initialFormData);
                } finally {
                    setIsFetching(false);
                }
            }
        };

        fetchPropertyData();
    }, [mode, propertyId, initialData]);

    // --- EVENT HANDLERS ---

    const handleChange = useCallback(

        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const { name, value, type } = e.target;
            if (type === 'checkbox') {
                const checked = (e.target as HTMLInputElement).checked;
                setFormData(prev => ({ ...prev, [name]: checked }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } , []
    )

    const handleAmenityChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, checked } = e.target;
            setFormData(prev => ({
                ...prev,
                amenities: { ...prev.amenities, [name]: checked },
            }));
        }, []
    ) 

    // Transform frontend data to match backend structure
    const transformFormDataForBackend = (data: PropertyFormData) => {
        return {
            ownerDetails: {
                ownerName: data.ownerName,
                ownerPhone: data.ownerPhone,
                ownerAltPhone: data.ownerAltPhone,
                ownerEmail: data.ownerEmail,
                ownerType: data.ownerType,
                ownerNotes: data.ownerNotes,
            },
            listingType: data.listingType,
            propertyType: data.propertyType,
            complexName: data.complexName,
            location: data.location,
            nearbyLandmarks: data.nearbyLandmarks,
            price: data.price ? parseInt(data.price) : undefined,
            rent: data.rent ? parseInt(data.rent) : undefined,
            securityDeposit: data.securityDeposit ? parseInt(data.securityDeposit) : undefined,
            maintenanceIncluded: data.maintenanceIncluded,
            configuration: data.configuration,
            furnishing: data.furnishing,
            superBuiltUpArea: data.superBuiltUpArea ? parseInt(data.superBuiltUpArea) : 0,
            carpetArea: data.carpetArea ? parseInt(data.carpetArea) : 0,
            bedrooms: parseInt(data.bedrooms),
            bathrooms: parseInt(data.bathrooms),
            balconies: parseInt(data.balconies),
            totalFloors: data.totalFloors ? parseInt(data.totalFloors) : undefined,
            propertyOnFloor: data.propertyOnFloor ? parseInt(data.propertyOnFloor) : undefined,
            view: data.view,
            parking: data.parking,
            vastuCompliant: data.vastuCompliant,
            liftAvailable: data.liftAvailable,
            amenities: data.amenities
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Transform data for backend
            const submitData = transformFormDataForBackend(formData);

            console.log(`${mode === 'edit' ? 'Updating' : 'Creating'} property:`, submitData);

            let response;
            if (mode === 'edit' && propertyId) {
                // Update existing property
                response = await axios.put<ApiResponse>(
                    `${ADD_INVENTORY_API}/${propertyId}`,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000,
                    }
                );
            } else {
                // Create new property
                response = await axios.post<ApiResponse>(
                    ADD_INVENTORY_API,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000,
                    }
                );
            }

            if (response.data.success) {
                toast.success(`Property ${mode === 'edit' ? 'updated' : 'saved'} successfully! 🎉`);
                console.log(`Property ${mode === 'edit' ? 'updated' : 'saved'}:`, response.data.data);

                // Reset form after successful submission only in add mode
                if (mode === 'add') {
                    setFormData(initialFormData);
                }
            } else {
                throw new Error(response.data.message || `Failed to ${mode === 'edit' ? 'update' : 'save'} property`);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Submission error:', error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error status
                    const errorData = error.response.data as ApiResponse;
                    toast.error(errorData.message || `Server error: ${error.response.status}`);

                    if (errorData.errors) {
                        console.error('Validation errors:', errorData.errors);
                    }
                } else if (error.request) {
                    // Network error
                    toast.error('Network error: Could not connect to server...');
                } else {
                    // Other error
                    toast.error(error.message || 'An unexpected error occurred');
                }
            } else {
                toast.error(error.message || "Something went wrong hang tight till we resolve the problem!")
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while fetching data in edit mode
    if (isFetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading property data...</p>
                </div>
            </div>
        );
    }

    // --- RENDER ---

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {mode === 'edit' ? 'Edit Property' : 'Property Listing Form'}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {mode === 'edit'
                        ? 'Update your property details below'
                        : 'Fill in all the details about your property to create an attractive listing'
                    }
                </p>
            </div>


            <form
                key={propertyId || 'add-mode'}
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
                {/* Progress Steps - Only show in add mode */}
                {mode === 'add' && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                        <div className="flex items-center justify-between text-white text-sm font-medium">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center mr-3">
                                    <User2Icon className="w-4 h-4" />
                                </div>
                                <span>Owner Details</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center mr-3">
                                    <Home className="w-4 h-4" />
                                </div>
                                <span>Property Info</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center mr-3">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span>Location & Price</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <span className="ml-3">Amenities</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6 sm:p-10 space-y-12">
                    {/* --- Section 1: Owner Details --- */}
                    <div className="border-b border-gray-200 pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <User2Icon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Owner Details</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Contact details of the property owner or point of contact
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormField label="Owner Name" htmlFor="ownerName">
                                    <StyledInput
                                        id="ownerName"
                                        name="ownerName"
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        placeholder="e.g., Mr. Sharma"
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Phone Number" htmlFor="ownerPhone">
                                    <StyledInput
                                        id="ownerPhone"
                                        name="ownerPhone"
                                        type="tel"
                                        value={formData.ownerPhone}
                                        onChange={handleChange}
                                        placeholder="e.g., 9876543210"
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Alternate Phone" htmlFor="ownerAltPhone">
                                    <StyledInput
                                        id="ownerAltPhone"
                                        name="ownerAltPhone"
                                        type="tel"
                                        value={formData.ownerAltPhone}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Email" htmlFor="ownerEmail">
                                    <StyledInput
                                        id="ownerEmail"
                                        name="ownerEmail"
                                        type="email"
                                        value={formData.ownerEmail}
                                        onChange={handleChange}
                                        placeholder="e.g., owner@gmail.com"
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Contact Person Type" htmlFor="ownerType">
                                    <StyledSelect
                                        id="ownerType"
                                        name="ownerType"
                                        value={formData.ownerType}
                                        onChange={handleChange}
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="broker">Broker</option>
                                        <option value="caretaker">Caretaker</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            <div className="sm:col-span-6">
                                <FormField label="Additional Notes" htmlFor="ownerNotes">
                                    <StyledTextarea
                                        id="ownerNotes"
                                        name="ownerNotes"
                                        value={formData.ownerNotes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Any extra information about the owner or contact..."
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* --- Section 2: Basic Information --- */}
                    <div className="border-b border-gray-200 pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Home className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Key details about the property listing and type
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormField label="Listing Type" htmlFor="listingType">
                                    <div className="flex gap-4 p-1 bg-gray-50 rounded-lg w-fit">
                                        <RadioOption
                                            id="rent"
                                            name="listingType"
                                            value="rent"
                                            checked={formData.listingType === 'rent'}
                                            onChange={handleChange}
                                            label="For Rent"
                                        />
                                        <RadioOption
                                            id="sale"
                                            name="listingType"
                                            value="sale"
                                            checked={formData.listingType === 'sale'}
                                            onChange={handleChange}
                                            label="For Sale"
                                        />
                                    </div>
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Property Type" htmlFor="propertyType">
                                    <StyledSelect
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="complex">Apartment Complex</option>
                                        <option value="standalone">Standalone Building</option>
                                        <option value="individual">Individual House / Villa</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            {formData.propertyType === 'complex' && (
                                <div className="sm:col-span-6">
                                    <FormField label="Complex / Society Name" htmlFor="complexName">
                                        <StyledInput
                                            id="complexName"
                                            name="complexName"
                                            type="text"
                                            value={formData.complexName}
                                            onChange={handleChange}
                                            placeholder="e.g., Palm Meadows Apartments"
                                            required
                                        />
                                    </FormField>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Section 3: Location & Price --- */}
                    <div className="border-b border-gray-200 pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <MapPin className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Location & Pricing</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Where is your property located and what is the price?
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <FormField label="Location / Address" htmlFor="location">
                                    <div className="relative">
                                       
                                        <StyledInput
                                            id="location"
                                            name="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g., 123 Main St, Kolkata"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </FormField>
                            </div>

                            <div className="sm:col-span-6">
                                <FormField label="Nearby Landmarks" htmlFor="nearbyLandmarks">
                                    <StyledInput
                                        id="nearbyLandmarks"
                                        name="nearbyLandmarks"
                                        type="text"
                                        value={formData.nearbyLandmarks}
                                        onChange={handleChange}
                                        placeholder="e.g., Near City Centre Mall, 5 min from Metro"
                                    />
                                </FormField>
                            </div>

                            {/* Conditional Price/Rent Fields */}
                            {formData.listingType === 'sale' ? (
                                <div className="sm:col-span-3">
                                    <FormField label="Total Price" htmlFor="price">
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
                                                <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                                            </div>
                                            <StyledInput
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="e.g., 5000000"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </FormField>
                                </div>
                            ) : (
                                <>
                                    <div className="sm:col-span-3">
                                        <FormField label="Monthly Rent" htmlFor="rent">
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 flex items-center pl-1">
                                                    <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                                                </div>
                                                <StyledInput
                                                    id="rent"
                                                    name="rent"
                                                    type="number"
                                                    value={formData.rent}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 25000"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <FormField label="Security Deposit" htmlFor="securityDeposit">
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
                                                    <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                                                </div>
                                                <StyledInput
                                                    id="securityDeposit"
                                                    name="securityDeposit"
                                                    type="number"
                                                    value={formData.securityDeposit}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 50000"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                    <div className="sm:col-span-6">
                                        <StyledCheckbox
                                            id="maintenanceIncluded"
                                            name="maintenanceIncluded"
                                            label="Maintenance charge included in rent"
                                            checked={formData.maintenanceIncluded}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- Section 4: Property Details --- */}
                    <div className="border-b border-gray-200 pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Building2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Specifics about the property&apos;s layout and size
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormField label="Configuration" htmlFor="configuration">
                                    <StyledSelect
                                        id="configuration"
                                        name="configuration"
                                        value={formData.configuration}
                                        onChange={handleChange}
                                        required
                                    >
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
                                    <StyledSelect
                                        id="furnishing"
                                        name="furnishing"
                                        value={formData.furnishing}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="semifurnished">Semi-Furnished</option>
                                        <option value="furnished">Fully-Furnished</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Super Built-up Area (sqft)" htmlFor="superBuiltUpArea">
                                    <StyledInput
                                        id="superBuiltUpArea"
                                        name="superBuiltUpArea"
                                        type="number"
                                        value={formData.superBuiltUpArea}
                                        onChange={handleChange}
                                        placeholder="e.g., 1200"
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Carpet Area (sqft)" htmlFor="carpetArea">
                                    <StyledInput
                                        id="carpetArea"
                                        name="carpetArea"
                                        type="number"
                                        value={formData.carpetArea}
                                        onChange={handleChange}
                                        placeholder="e.g., 1000"
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-2">
                                <FormField label="Bedrooms" htmlFor="bedrooms">
                                    <StyledInput
                                        id="bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-2">
                                <FormField label="Bathrooms" htmlFor="bathrooms">
                                    <StyledInput
                                        id="bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-2">
                                <FormField label="Balconies" htmlFor="balconies">
                                    <StyledInput
                                        id="balconies"
                                        name="balconies"
                                        type="number"
                                        value={formData.balconies}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Total Floors in Building" htmlFor="totalFloors">
                                    <StyledInput
                                        id="totalFloors"
                                        name="totalFloors"
                                        type="number"
                                        value={formData.totalFloors}
                                        onChange={handleChange}
                                        placeholder="e.g., 15"
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Property on Floor" htmlFor="propertyOnFloor">
                                    <StyledInput
                                        id="propertyOnFloor"
                                        name="propertyOnFloor"
                                        type="number"
                                        value={formData.propertyOnFloor}
                                        onChange={handleChange}
                                        placeholder="e.g., 5"
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Balcony View" htmlFor="view">
                                    <StyledInput
                                        id="view"
                                        name="view"
                                        type="text"
                                        value={formData.view}
                                        onChange={handleChange}
                                        placeholder="e.g., Garden facing, Road side"
                                    />
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <FormField label="Parking" htmlFor="parking">
                                    <StyledSelect
                                        id="parking"
                                        name="parking"
                                        value={formData.parking}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="none">No Parking</option>
                                        <option value="bike">Bike Only</option>
                                        <option value="1car">1 Car</option>
                                        <option value="2car">2 Cars</option>
                                    </StyledSelect>
                                </FormField>
                            </div>

                            <div className="sm:col-span-3">
                                <StyledCheckbox
                                    id="vastuCompliant"
                                    name="vastuCompliant"
                                    label="Vastu Compliant"
                                    checked={formData.vastuCompliant}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <StyledCheckbox
                                    id="liftAvailable"
                                    name="liftAvailable"
                                    label="Lift Available"
                                    checked={formData.liftAvailable}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 5: Amenities --- */}
                    <div className="pb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Select all available amenities to attract more buyers/tenants
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 bg-gray-50 rounded-2xl p-6">
                            <StyledCheckbox
                                id="clubhouse"
                                name="clubhouse"
                                label="Clubhouse"
                                checked={formData.amenities.clubhouse}
                                onChange={handleAmenityChange}
                            />
                            <StyledCheckbox
                                id="swimmingPool"
                                name="swimmingPool"
                                label="Swimming Pool"
                                checked={formData.amenities.swimmingPool}
                                onChange={handleAmenityChange}
                            />
                            <StyledCheckbox
                                id="gym"
                                name="gym"
                                label="Gym"
                                checked={formData.amenities.gym}
                                onChange={handleAmenityChange}
                            />
                            <StyledCheckbox
                                id="communityHall"
                                name="communityHall"
                                label="Community Hall"
                                checked={formData.amenities.communityHall}
                                onChange={handleAmenityChange}
                            />
                            <StyledCheckbox
                                id="badmintonCourt"
                                name="badmintonCourt"
                                label="Badminton Court"
                                checked={formData.amenities.badmintonCourt}
                                onChange={handleAmenityChange}
                            />
                            <StyledCheckbox
                                id="cafeteria"
                                name="cafeteria"
                                label="Cafeteria"
                                checked={formData.amenities.cafeteria}
                                onChange={handleAmenityChange}
                            />
                            <StyledCheckbox
                                id="gasPipeline"
                                name="gasPipeline"
                                label="Gas Pipeline"
                                checked={formData.amenities.gasPipeline}
                                onChange={handleAmenityChange}
                            />
                        </div>
                    </div>
                </div>

                {/* --- Form Submission --- */}
                <div className="bg-gray-50 px-6 py-8 sm:px-10 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {mode === 'edit' ? 'Updating...' : 'Saving...'}
                                </div>
                            ) : (
                                mode === 'edit' ? 'Update Property' : 'Save Property'
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default PropertyForm;