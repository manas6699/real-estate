

import Script from 'next/script';
import { Lora } from 'next/font/google';

const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'], // adjust based on your design needs
    variable: '--font-lora',
    display: 'swap',
});

export const metadata = {
    title: "The Royal Ganges, Ganga Facing Flats - MMR Realty",
    description:
        "Experience luxurious waterfront living at Royal Ganges – premium apartments & duplexes with stunning Ganges views. Book now! ",
    keywords: [
        "Royal Ganges Howrah",
        "Royal Ganges Batanagar",
        "Luxury Homes Howrah",
        "Apartments In Howrah",
        "Duplex In Howrah",
        "Batanagar Apartments",
        "Maheshtala Property",
        "Flats Near Ganges",
        "Property Near Kolkata",
        "Riverside Living Howrah",
        "Ganges View Homes",
        "Howrah Real Estate",
        "Batanagar Real Estate",
        "Kolkata Luxury Homes",
        "Waterfront Apartments",
        "Book Your Home",
        "Schedule Site Visit",
        "Royal Ganges Booking",
        "Enquire Now",
        "Luxury Homes For Sale",
        "Buy Flat In Howrah",
        "Invest In Howrah",
        "Duplex Booking Open",
        "Best Investment Kolkata",
        "Premium Homes Now",
        "Ganges View Deck",
        "Open Balcony Homes",
        "Private Kitchen Garden",
        "Community Living",
        "Clubhouse Access",
        "Gated Community",
        "Jogging Track Howrah",
        "Swimming Pool View",
        "Smart Security Homes",
        "Kids Play Area",
        "Near Upcoming Metro",
        "Easy Commute Howrah",
        "Well Connected Location",
        "Close To Behala",
        "Close To Tollygunge",
        "Near Thakurpukur",
        "Close To Kolkata",
        "Near Hospitals",
        "Near Schools",
        "Central Location Howrah",
        "Starting From 59 Lakhs",
        "Duplex From 2 Cr",
        "Smart Investment 2025",
        "Affordable Luxury",
        "Real Estate Investment",
        "ROI In Real Estate",
        "Value For Money",
        "Future Ready Property",
        "High Appreciation Zone",
        "Secure Your Dream Home",
        "Home For Families",
        "NRI Investment India",
        "Dream Home Kolkata",
        "New Home Buyers",
        "Working Professionals Kolkata",
        "Luxury For NRIs",
        "Elite Living India",
        "Ideal For Retirement",
        "Young Couple Homes",
        "Buy Property Howrah",
        "Srijan Realty",
        "Srijan Projects",
        "Royal Ganges Srijan",
        "Trusted Builder Kolkata",
        "Srijan Luxury Homes",
        "Top Builders Howrah",
        "Srijan Real Estate",
        "Srijan Developers",
        "Royal Ganges Project",
        "Srijan Luxury Living",
        "Homes With Medical Facility",
        "24x7 Medical Access",
        "In House Clinic Available",
        "Elderly Wellness Homes",
        "Calm And Quiet Homes",
        "Walking Tracks For Seniors",
        "Park Facing Apartments",
        "Homes With Greenery",
        "Community Support Living",
        "Homes Near Hospitals",
        "Lifts In Every Tower",
        "Barrier Free Access",
        "Homes With Security",
        "Peaceful Neighbourhood",
        "Homes Near Temples",
        "Quiet Ganges View Homes",
        "No Stair Living",
        "Homes With Relax Zone",
        "Spiritual Retreat Homes",
        "Low Density Living"
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
