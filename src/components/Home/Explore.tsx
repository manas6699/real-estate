import React from 'react';
import Image from 'next/image';

type Property = {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
};

const properties: Property[] = [
    {
        id: 1,
        name: "Modern Villa",
        price: "₹ 1,200,000",
        imageUrl: "/assets/emami/1.webp",
    },
    {
        id: 2,
        name: "Luxury Apartment",
        price: "₹ 850,000",
        imageUrl: "/assets/emami/1.webp",
    },
    {
        id: 3,
        name: "Cozy Cottage",
        price: "₹ 430,000",
        imageUrl: "/assets/emami/1.webp",
    },
];
const Explore = () => {
  return (
    <section>
          <h1 className='text-4xl md:text-4xl text-center  mt-10 mb-5'>
            Explore Our Properties
        </h1>
          <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 p-4">
                  {properties.map((property) => (
                      <div
                          key={property.id}
                          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow w-64 h-96 overflow-hidden"
                      >
                          <div className="relative w-full h-2/3">
                              <Image
                                  src={property.imageUrl}
                                  alt={property.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-t-2xl"
                              />
                          </div>
                          <div className="p-4 h-1/3 flex flex-col justify-between">
                              <h2 className="text-lg font-semibold">{property.name}</h2>
                              <p className="text-gray-600">{property.price}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
    </section>
  )
}

export default Explore