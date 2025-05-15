import type { Metadata } from "next";
import "./globals.css";


import {  Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Optional: useful for better performance
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify needed weights
  variable: '--font-poppins', // CSS variable name
});



export const metadata: Metadata = {
  title: "MMR Realty LLP: Top Real Estate Consultant in Kolkata",
  description: "Kolkata’s trusted property Consultant & Real Estate Agency for stress-free Buying, Selling & Renting. HERA and RERA Approved.",
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
    <html className={`${poppins.className}`}>
      <body>{children}</body>
    </html>
  );
}
