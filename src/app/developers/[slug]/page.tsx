import { developers } from "@/app/data/developers";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

interface DeveloperPageProps {
    params: {
        slug: string;
    };
}


export default async function DeveloperPage({ params }: DeveloperPageProps) {
    const { slug } = (await params);

    if (!slug) return notFound();

    const developer = developers.find((dev) => dev.slug === slug);
    if (!developer) return notFound();

    return (
        <>
            <Navbar source="mmr-homepage" />
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
            <Footer />
        </>
    );
}



