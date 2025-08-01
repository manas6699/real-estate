import Script from 'next/script';
import { Lora } from 'next/font/google';

const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-lora',
    display: 'swap',
});

export const metadata = {
    title: "Godrej Blue - Premium 3 & 4 BHK Homes in Alipore",
    description:
        "Godrej Blue in Alipore offers premium 3, 3.5 & 4 BHK homes with lush open areas, elegant design, and top-tier amenities on the prestigious BL Saha Road.",
    keywords: [
        "Godrej Blue",
        "3 bhk flat for sale in Alipore",
        "best place to buy flats in Kolkata",
        "Luxury Home Kolkata",
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
