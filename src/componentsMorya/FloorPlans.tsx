import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/floorplanmorya/1a.jpg',
    '/assets/floorplanmorya/2a.jpg',
    '/assets/floorplanmorya/3a.jpg',
    '/assets/floorplanmorya/4a.jpg',
    '/assets/floorplanmorya/5a.jpg',
    '/assets/floorplanmorya/6a.jpg',
    '/assets/floorplanmorya/7a.jpg',
    '/assets/floorplanmorya/8a.jpg',
    '/assets/floorplanmorya/9a.jpg'
];

export default function GalleryMorya() {
    return (
        <div className="p-6">
            <h1 className="text-4xl text-center font-bold mb-10">Floor Plans</h1>
            <ImageGallery images={images} />
        </div>
    );
}
