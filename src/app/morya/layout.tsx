

import { Poppins } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap', // Optional: useful for better performance
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify needed weights
    variable: '--font-poppins', // CSS variable name
});



export const metadata = {
    title: "4 & 3 BHK Apartments in Tolly gunge | Sugam Morya Phase 2",
    description: "Sugam Morya in Tollygunge offers premium 3, 3.5  & 4  BHK homes with lush open areas, elegant design, and top-tier amenities on the prestigious BL Shah Road.",
    keywords: ["Luxury apartments Tollygunge",
        "3 BHK flats Tollygunge",
        " 4 BHK flats Tollygunge",
        "Sugam Morya Kolkata",
        "IGBC Gold certified homes",
        "Golf course view apartments",
        "Rooftop infinity pool Kolkata",
        "Vaastu compliant homes Kolkata",
        "High - rise apartments South Kolkata",
        "Clubhouse with amenities Tollygunge"
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className={`${poppins.className}`}>
            <head>
                {/* Google Analytics Script */}
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=G-797R14VMX2`}
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-797R14VMX2', {
                page_path: window.location.pathname,
              });
            `,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
