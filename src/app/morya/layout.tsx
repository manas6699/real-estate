

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
