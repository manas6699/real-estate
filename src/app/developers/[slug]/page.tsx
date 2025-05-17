import { developers } from "@/app/data/developers";
import Footer from "@/components/Home/Footer";
import Navbar from "@/components/Home/Navbar";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // Simulate fetching developer data based on the slug
    const developer = developers.find((dev) => dev.slug === slug)
    if (!developer) {
        return notFound();
    }

    return (
        <>
        <Navbar source="mmr-home"/>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                     {slug}
                </h1>
                <Image src={developer.image} alt={developer.name} width={300} height={300} className="mb-4" />
                <p className="text-lg text-gray-600 text-center w-1/2">
                    {developers.find((dev) => dev.slug === slug)?.description}
                </p>
            </div>
            <Footer/>
        </>
    )
  }