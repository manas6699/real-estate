

import React from 'react'
import { MessageCircle, Phone } from 'lucide-react'

const StickyButtonsRight = () => {


    return (
        <div>
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                {/* WhatsApp */}
                <a
                    href="https://wa.me/9830947144"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
                    title="Chat on WhatsApp"
                >
                    <MessageCircle size={24} />
                </a>

                {/* Contact */}
                <a
                    href="tel:9830947144"
                    className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition"
                    title="Call Us"
                >
                    <Phone size={24} />
                </a>
            </div>
        </div>
    )
}

export default StickyButtonsRight