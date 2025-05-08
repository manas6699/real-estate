import React from 'react'
import ImageGallery from '@/components/ImageGallery'

const floorplans = [
    '/assets/floor/1a.jpg',
    '/assets/floor/2a.jpg',
    '/assets/floor/3a.jpg',
    '/assets/floor/4a.jpg',
    '/assets/floor/5a.jpg',
    '/assets/floor/6a.jpg',
    '/assets/floor/7a.jpg',
    '/assets/floor/8a.jpg',
    '/assets/floor/9a.jpg'
]
const FloorPlans = () => {
  return (
    <div>
          <div className="py-4 px-12">
              <h1 className="p-4 text-4xl font-bold mb-10">Floor-Plans</h1>
              <ImageGallery images={floorplans} />
          </div>
    </div>
  )
}

export default FloorPlans