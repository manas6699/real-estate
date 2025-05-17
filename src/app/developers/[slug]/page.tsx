// app/developers/[slug]/page.tsx
import { developers } from "@/app/data/developers"
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

interface Params {
    params: {
        slug: string;
    };
}

export function generateStaticParams() {
    return developers.map((dev) => ({ slug: dev.slug }));
}

export default function DeveloperPage({ params }: Params) {
    const developer = developers.find((d) => d.slug === params.slug);

    if (!developer) return notFound();

    return (
        <>
        <Navbar source="mmr-homepage"/>
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">{developer.name}</h1>
            <Image
                src={developer.image}
                alt={developer.name}
                height={50}
                width={50}
                className="w-64 h-auto mb-4"
            />
            <p className="text-lg text-gray-700">{developer.description}</p>
        </div>
        <Footer/>
        </>
    );
}
