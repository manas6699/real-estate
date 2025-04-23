

import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap', // Optional: useful for better performance
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify needed weights
    variable: '--font-poppins', // CSS variable name
});



export const metadata = {
  title: 'Luxury Living at Town Square – Newtown’s Premier Residences',
  description: 'Town Square in Newtown offers luxury apartments with expansive open spaces, world-class amenities, and refined design for a serene and sophisticated lifestyle.',
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
