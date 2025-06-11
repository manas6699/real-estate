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
        <section className="px-4 py-2 bg-white">
        <div className='md:p-14'>
                <h1 className="text-blue-400 text-2xl sm:text-4xl md:text-5xl font-bold">
                Gallery
            </h1>
            <div className="flex-1 mt-4 mb-4">
                <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                    Step into a visual symphony of elegance and grandeur.
                    The Gallery at Emami-AAMOD unveils every detail of luxury living — from majestic architecture to
                    opulent interiors — crafted for those who desire nothing but the finest. See where sophistication
                    meets serenity.
                </p>
            </div>
            <ImageGallery images={images} />
        </div>
        </section>
    );
}
