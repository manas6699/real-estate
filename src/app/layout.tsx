import { GoogleAnalytics } from '@next/third-parties/google'

import type { Metadata } from "next";
import "./globals.css";


import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Optional: useful for better performance
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify needed weights
  variable: '--font-poppins', // CSS variable name
});



export const metadata: Metadata = {
  title: "MMR Realty LLP: Top Real Estate Consultant in Kolkata",
  description: "Kolkata’s trusted property Consultant & Real Estate Agency for stress-free Buying, Selling & Renting. HERA and RERA Approved.",
  keywords: [
    "Real estate consultants in Kolkata",
    "Property dealers in Kolkata",
    "Buy flats in Kolkata",
    "Luxury apartments Kolkata",
    "Residential projects in Kolkata",
    "Best property consultants Kolkata",
    "New apartment launches Kolkata",
    "Real estate advisory services Kolkata",
    "Kolkata property market experts",
    "Top real estate companies in Kolkata",
    "Flats for sale in New Town Kolkata",
    "Property consultants in Rajarhat",
    "Real estate agents near EM Bypass Kolkata",
    "Affordable apartments in Joka Kolkata",
    "Luxury flats in New Alipore Kolkata",
    "Property dealers in Gariahat Kolkata",
    "Real estate services in Tollygunge",
    "Apartments near Park Street Kolkata",
    "Flats for sale in Bhawanipore Kolkata",
    "Real estate in North, South, East & West Kolkata",
    "Flats for rent in South Kolkata",
    "New property for sale in New Town Kolkata",
    "Resale flats in Rajarhat Kolkata",
    "Luxury apartments near EM Bypass Kolkata",
    "Bungalows for sale in New Town",
    "Premium flats for rent in Park Street",
    "Ready-to-move flats in Tollygunge Kolkata",
    "New launch residential projects in East Kolkata",
    "Luxury Apartments in Bhawanipore Kolkata",
    "Resale apartments in Gariahat Kolkata",
    "Flats for rent in North Kolkata",
    "Affordable resale properties in Joka Kolkata",
    "Luxury homes in Central Kolkata",
    "3 BHK flats on rent near EM Bypass",
    "Bungalow-style homes in South Kolkata"
  ],
  verification: {
    google: 'Xy7W7IIbzhmM1foAbu7RHD7ZtvREjPomdnBe1dK467w', // Just the code, not full meta tag
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  className={`${poppins.className}`}>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-2XE1CXQ699" />
    </html>
  );
}
