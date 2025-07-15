
import Script from 'next/script';
import { Lora } from 'next/font/google';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // adjust based on your design needs
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
    title: "Emami Aamod New Alipore , Kolkata | Luxury Apartment, 3&4BHK",
    description: "Emami Aamod in New Alipore offers 3&4 BHK with servant rooms from ₹2.90 Cr onwards. Total 233 units with 4 Luxury Towers,  pools, gym, clubhouse & more...",
    keywords: [
        "Emami Aamod New Alipore",
        "Luxury apartments New Alipore",
        "3 BHK flats with servant room Kolkata",
        "4 BHK luxury apartments Kolkata",
        "Emami Realty projects Kolkata",
        "7-star lifestyle residences Kolkata",
        "Apartments near CMRI Hospital Kolkata",
        "Eco- friendly apartments Kolkata",
        "High - end residential projects Kolkata",
        "Gated community New Alipore"
    ],
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
                    id="google-analytics"
                    strategy="afterInteractive"
                    src={"https://www.googletagmanager.com/gtag/js?id=AW-17339408048"}
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
