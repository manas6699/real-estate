import Image from "next/image";

const developers = [
    {
        name: "PS Group",
        description:
            "A premier real estate developer renowned for iconic projects in Kolkata and beyond, with expertise across residential, commercial, IT parks, and more.",
        image: "/assets/emami/1.webp"    },
    {
        name: "Emami Realty",
        description:
            "Part of the Emami Group, Emami Realty delivers elegant and functional residential, commercial, and retail spaces in Kolkata.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Merlin Group",
        description:
            "Founded in 1984, Merlin Group creates luxurious and functional residential and commercial spaces across India.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Srijan Realty",
        description:
            "Known for innovation and customer-centric design, Srijan delivers residential and commercial projects across Eastern and Southern India.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Ambuja Neotia",
        description:
            "A multi-sector group focused on realty, hospitality, and education, known for sustainable and community-driven development.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Sugam Group",
        description:
            "Blending tradition and modernity with sustainable development, Sugam delivers eco-conscious homes across Kolkata.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Godrej Properties",
        description:
            "Real estate arm of the Godrej Group, delivering township and high-end developments nationwide since 1990.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Ruchi Realty",
        description:
            "A developer with a focus on sustainable and modern residential and retail projects, primarily in Central India.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Vinayak Group",
        description:
            "Over 30 years of experience in Kolkata, delivering Vastu-compliant, aesthetic residential and commercial projects.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Siddha Group",
        description:
            "Creating high-quality residential and commercial spaces in Kolkata and Jaipur, known for affordability and innovation.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Sureka Group",
        description:
            "With a legacy since 1961, Sureka builds everything from affordable homes to upscale residences nationwide.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Forum Group",
        description:
            "An international developer known for large-scale luxury and green IT infrastructure projects since 1981.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Primarc",
        description:
            "Design-driven developer creating high-end community residences and commercial infrastructure in Kolkata.",
        image: "/assets/emami/1.webp "  },
    {
        name: "Unimark Group",
        description:
            "Founded in 1996, Unimark is known for premium residential and commercial projects with modern design and sustainability.",
        image: "/assets/emami/1.webp",
    },
    {
        name: "Orbit Group",
        description:
            "Developer of over 50 projects, Orbit offers a blend of luxury and affordable housing in East India.",
        image: "/assets/emami/1.webp",
    },
];

export default function DeveloperSection() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                    Trusted Real Estate Developers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {developers.map((dev) => (
                        <div
                            key={dev.name}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                        >
                            <div className="relative w-full h-48 rounded-2xl">
                                <Image
                                    src={dev.image}
                                    alt={dev.name}
                                    layout="fill"
                                    objectFit="contain"
                                    className="p-4 rounded-2xl"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    {dev.name}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-4">
                                    {dev.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}