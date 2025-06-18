'use client';

import React from 'react';
import { MessageCircle, Phone, MessageSquareText } from 'lucide-react';

const StickyButtonsRight = () => {
    const whatsappNumber = '9830947144';
    const encodedMessage = encodeURIComponent('Hi, I am interested in your services.');

    return (
        <div>
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                {/* WhatsApp */}
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
                    title="Chat on WhatsApp"
                >
                    <MessageCircle size={24} />
                </a>

                {/* Message with text */}
                <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodedMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                    title="Send Message"
                >
                    <MessageSquareText size={24} />
                </a>

                {/* Call */}
                <a
                    href={`tel:${whatsappNumber}`}
                    className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition"
                    title="Call Us"
                >
                    <Phone size={24} />
                </a>
            </div>
        </div>
    );
};

export default StickyButtonsRight;
