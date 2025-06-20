

import Script from 'next/script';
import { Lora } from 'next/font/google';

const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'], // adjust based on your design needs
    variable: '--font-lora',
    display: 'swap',
});

export const metadata = {
    title: "4 & 3 BHK Apartments in Tollygunge | Sugam Morya Phase 2",
    description:
        "Sugam Morya in Tollygunge offers premium 3, 3.5 & 4 BHK homes with lush open areas, elegant design, and top-tier amenities on the prestigious BL Saha Road.",
    keywords: [
        "Sugam Morya",
        "Morya Alipore",
        "Morya Tollygunge",
        "Luxury Home Kolkata",
        "High Rise Project Kolkata",
        "Golf Course View Apartments",
        "Tollygunge Metro",
        "Howrah Railway Station 14 KM",
        "B L Saha Road, Tollygunge",
        "Alipore Kolkata Apartments",
        "1,531 - 2,647 sq ft",
        "3.5 BHK Flats Kolkata",
        "₹1.46 Cr - ₹2.48 Cr",
        "Affordable Luxury Flats",
        "Avail Launch Offer",
        "Sample Flat Ready",
        "Enquire Now",
        "Request Callback",
        "Instant Call Back",
        "Golf Course View",
        "High Rise Project",
        "Unmatched Price",
        "Your data is safe with us",
        "Ready-to-move flats Tollygunge",
        "New residential projects near Tollygunge Metro",
        "3.5 BHK for sale in Alipore",
        "Luxury apartments Tollygunge",
        "3 BHK flats Tollygunge",
        "4 BHK flats Tollygunge",
        "Sugam Morya Kolkata",
        "IGBC Gold certified homes",
        "Rooftop infinity pool Kolkata",
        "Vaastu compliant homes Kolkata",
        "High-rise apartments South Kolkata",
        "Clubhouse with amenities Tollygunge"
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
                {/* Google Ads Tag */}
                <Script
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=AW-17036070133"
                />
                <Script
                    id="gtag-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17036070133');
            `,
                    }}
                />

                <Script
                    id="gtag-lead-submit"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
      function gtag_report_conversion(url) {
        var callback = function () {
          if (typeof(url) != 'undefined') {
            window.location = url;
          }
        };
        gtag('event', 'conversion', {
          'send_to': 'AW-17036070133/hihlCPPJ870aEPWZt7s_',
          'value': 1.0,
          'currency': 'INR',
          'event_callback': callback
        });
        return false;
      }
    `,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
