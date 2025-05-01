import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/emami/1.webp',
    '/assets/emami/2.webp',
    '/assets/emami/3.webp',
    '/assets/emami/4.webp',
    '/assets/emami/5.webp',
    '/assets/emami/6.webp',
    '/assets/emami/7.webp',
    '/assets/emami/8.webp',
    '/assets/emami/Hero.jpg'
];

export default function GalleryMorya() {
    return (
        <div className="p-6">
            <h1 className="text-4xl text-center font-bold mb-10">Gallery</h1>
            <div className="flex-1 mt-14 mb-16">
                <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed text-center">
                    Step into a visual symphony of elegance and grandeur.
                    The Gallery at Emami-AAMOD unveils every detail of luxury living — from majestic architecture to
                    opulent interiors — crafted for those who desire nothing but the finest. See where sophistication
                    meets serenity.
                </p>
            </div>
            <ImageGallery images={images} />
        </div>
    );
}
