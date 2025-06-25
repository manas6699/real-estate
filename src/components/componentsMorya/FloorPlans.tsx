import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/morya/morya-fp-1.webp',
    '/assets/morya/morya-fp-2.webp',
    '/assets/morya/morya-fp-3.webp',
    '/assets/morya/morya-fp-4.webp',
    '/assets/morya/morya-fp-5.webp',
    '/assets/morya/morya-fp-6.webp',
    '/assets/morya/morya-fp-7.webp',
    '/assets/morya/morya-fp-8.webp',
    '/assets/morya/morya-fp-10.webp',
    '/assets/morya/morya-fp-11.webp',
    '/assets/morya/morya-fp-12.webp',
    '/assets/morya/morya-fp-13.webp',
    '/assets/morya/morya-fp-14.webp',
];

export default function GalleryMorya() {
    return (
        <section id="floorplans" className="p-6 pt-24">
            <h1 className="text-4xl  font-bold mb-10">Floor Plans</h1>
            <ImageGallery images={images} />
        </section>
    );
}
