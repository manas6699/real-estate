

import { Poppins } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap', // Optional: useful for better performance
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify needed weights
    variable: '--font-poppins', // CSS variable name
});



export const metadata = {
    title: "Emami Aamod New Alipore , Kolkata | Luxury Apartment, 3&4BHK",
    description: "Emami Aamod in New Alipore offers 3&4 BHK with servant rooms from ₹2.90 Cr onwards. Total 233 units with 4 Luxury Towers,  pools, gym, clubhouse & more...",
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
            <head>
                {/* Google Analytics Script */}
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=G-T6VE9ZGC90`}
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T6VE9ZGC90', {
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
