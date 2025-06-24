import React from 'react';
import Image from 'next/image';

type Property = {
    id: number;
    name: string;
    price: string;
    location:string;
    imageUrl: string;
    redirectingRoute:string;
};

const properties: Property[] = [
    {
        id: 1,
        name: "Town Square",
        price: "₹ 1,200,000",
        location: "Kolkata",
        imageUrl: "/assets/town-square/g1.jpeg",
        redirectingRoute:"/town-square"
    },
    {
        id: 2,
        name: "Emami Aamod",
        price: "₹ 850,000",
        location: "Kolkata",
        imageUrl: "/assets/emami/4.webp",
        redirectingRoute:"/emami-aamod"
    },
    {
        id: 3,
        name: "Morya",
        price: "₹ 430,000",
        location: "Kolkata",
        imageUrl: "/assets/morya/morya-gallery-3.webp",
        redirectingRoute:"/morya"
    },
    {
        id: 4,
        name: "Primus Ganges",
        price: "₹ 81.32 lacs Onwards",
        location: "Kolkata",
        imageUrl: "/assets/royalgangesgallery/10.png",
        redirectingRoute:"/RoyalGanges"
    },
];
const Explore = () => {
  return (
    <section>
          <h2 className='text-3xl sm:text-4xl text-center font-semibold text-gray-900 mb-4 mt-6'>
            Explore Our Properties
        </h2>
          <div className="flex justify-center cursor-pointer">
         
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 p-4">
                  {properties.map((property) => (
                      <div
                          key={property.id}
                          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow w-64 h-96 overflow-hidden"
                      >
                          <a href={property.redirectingRoute}>
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
                                  <p className="text-gray-600 font-semibold">{property.price}</p>
                                  <p className="text-gray-600 font-semibold">{property.location}</p>
                          </div>
                          </a>
                      </div>
                  ))}
              </div>
          </div>
    </section>
  )
}

export default Explore