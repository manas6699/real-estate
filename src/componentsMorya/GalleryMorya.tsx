import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/morya/1.jpg',
    '/assets/morya/2.jpg',
    '/assets/morya/3.jpg',
    '/assets/morya/4.jpg',
    '/assets/morya/5.jpg',
    '/assets/morya/6.jpg',
    '/assets/morya/7.jpg',
    '/assets/morya/8.jpg',
    '/assets/morya/9.jpg'
];

export default function GalleryMorya() {
    return (
        <div className="p-6">
            <h1 className="text-4xl text-center font-bold mb-10">Gallery</h1>
            <ImageGallery images={images} />
        </div>
    );
}
