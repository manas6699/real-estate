import ImageGallery from '@/components/ImageGallery';

const images = [
    '/assets/royalgangesgallery/1.jpg',
    '/assets/royalgangesgallery/2.jpg',
    '/assets/royalgangesgallery/3.jpg',
    '/assets/royalgangesgallery/4.jpg',
    '/assets/royalgangesgallery/5.jpg',
    '/assets/royalgangesgallery/6.jpg',
    '/assets/royalgangesgallery/7.jpg',
    '/assets/royalgangesgallery/8.jpg',
    '/assets/royalgangesgallery/9.jpg',
    '/assets/royalgangesgallery/50.png',
    '/assets/royalgangesgallery/100.png',
    
];

export default function GalleryMorya() {
    return (
        <div className="p-6">
            <h1 className="text-4xl  font-bold mb-10">Gallery</h1>
            <ImageGallery images={images} />
        </div>
    );
}
