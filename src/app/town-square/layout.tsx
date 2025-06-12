import Script from 'next/script';
import { Lora } from 'next/font/google';

const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'], // Lora supports these weights
    variable: '--font-lora',
    display: 'swap',
});

export const metadata = {
    title: 'Town Square, Kolkata | 3 & 4 BHK | Residential Apartments.',
    description: 'Town Square offers 3, 3.5, 4 & 5 BHK (Duplex) Premium Apartments with the most promising and vibrant location near Biswa Bangla Gate and Opposite to Novotel Hotel.',
    keywords: [
        " Town Square Kolkata apartments",
        "3 BHK flats near Biswa Bangla Gate",
        "4 BHK duplex apartments Kolkata",
        "Premium apartments near Novotel Kolkata",
        "Residential projects New Town Kolkata",
        "Luxury flats near Eco Park Kolkata",
        "Town Square New Town Kolkata",
        "High - rise apartments Rajarhat",
        "Apartments near Kolkata IT hub",
        "Modern amenities apartments Kolkata"
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className={`${lora.className}`}>
            <head>
                {/* Google Analytics Script */}
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=G-KZXEP3KZN2`}
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', 'G-KZXEP3KZN2', {
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
