import { Phone, Download, MessageCircle } from 'lucide-react'; 


export default function HeroSection() {
    return (
        <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/assets/hero.jpg")' }}>
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-white text-4xl md:text-7xl text-center px-4">
                    <span className='font-extrabold'>
                        TOWN
                    </span>
                    SQUARE
                </h1>
            </div>

            {/* Sticky Buttons Bottom Right */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                {/* WhatsApp */}
                <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
                    title="Chat on WhatsApp"
                >
                    <MessageCircle size={24} />
                </a>

                {/* Download Brochure */}
                <a
                    href="/dummy-brochure.pdf"
                    download
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                    title="Download Brochure"
                >
                    <Download size={24} />
                </a>

                {/* Contact */}
                <a
                    href="/contact"
                    className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition"
                    title="Contact Us"
                >
                    <Phone size={24} />
                </a>
            </div>
        </section>
    );
}
