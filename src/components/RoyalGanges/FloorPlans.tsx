import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/royalgangesgallery/2bhk.png',
    '/assets/royalgangesgallery/3bhk.png',
];

export default function GalleryMorya() {
    return (
        <div className="p-6">
            <h1 className="text-4xl  font-bold mb-10">Floor Plans</h1>
            <ImageGallery images={images} />
        </div>
    );
}
