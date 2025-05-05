import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/morya/morya-gallery-1.webp',
    '/assets/morya/morya-gallery-2.webp',
    '/assets/morya/morya-gallery-3.webp',
    '/assets/morya/morya-gallery-4.webp',
    '/assets/morya/morya-gallery-5.webp',
    '/assets/morya/morya-gallery-6.webp',
    '/assets/morya/morya-gallery-7.webp',
    '/assets/morya/morya-gallery-8.webp',
    '/assets/morya/morya-gallery-9.webp',
    '/assets/morya/morya-gallery-10.webp',
    '/assets/morya/morya-gallery-11.webp',
];

export default function GalleryMorya() {
    return (
        <div className="p-6">
            <h1 className="text-4xl text-center font-bold mb-10">Gallery</h1>
            <ImageGallery images={images} />
        </div>
    );
}
