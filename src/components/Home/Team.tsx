import Image from "next/image";

const teamMembers = [
    {
        name: "Bappa Das",
        image: "/assets/directors/bappa.jpg",
        description:
            "Bappa Das is the Director of MMR, a leading real estate platform offering premium projects from top developers, and the CEO & Founder of BPRO Softech Pvt. Ltd., a trusted name in fintech solutions.\n\nA dynamic leader with sharp business acumen, Bappa Das has been instrumental in driving MMR’s rapid growth and customer trust in the competitive real estate landscape. With his entrepreneurial spirit, he has also built BPRO Softech into a modern fintech firm offering smart and scalable financial solutions for today’s digital economy.\n\nBappa Das believes in creating sustainable value for clients by combining technology with human insight. At MMR, he ensures clients are matched with the right properties through transparent and strategic advisory. His deep industry knowledge and commitment to excellence have helped both ventures scale with integrity and innovation."
    },
    {
        name: "Prasenjit Roy",
        image: "/assets/directors/prosenjit.jpg",
        description:
            "Prasenjit Roy is the visionary Founder and Director of MMR, a pioneering real estate platform that connects homebuyers with top-tier projects from reputed developers. With a sharp eye for market trends and consumer needs, he has positioned MMR as a trusted name in real estate consulting and project promotion. He is also the CEO and Founder of Bpro Softech Pvt. Ltd., a fast-growing fintech firm focused on innovative digital solutions for financial services.\n\nWith a background rooted in strategy, marketing, and customer experience, Prasenjit brings over a decade of leadership excellence to the table. Under his guidance, MMR has helped thousands of buyers make informed investment decisions by offering curated listings, transparent dealings, and customer-first service."
    },
    {
        name: "Sadashiv Jha",
        image: "/assets/directors/jha.jpg",
        description:
            "Sadashiv Jha, the last appointed Director at MMR, brings a unique blend of legal expertise and sales leadership to the organization. As a seasoned advocate, he ensures that the company's operations align with legal integrity while spearheading the entire new sales division with unmatched precision and strategy.\n\nKnown for his sharp acumen and disciplined approach, Sadashiv Jha plays a pivotal role in expanding MMR’s market reach. His deep understanding of property laws and customer behavior makes him an invaluable asset in navigating real estate complexities. Under his guidance, the new sales team thrives on performance, professionalism, and result-driven outcomes — making him a cornerstone of MMR's growth and trust."
    }
];

const salesteamMembers = [
    { name: "Hiranmoy Halder", image: "/assets/sales/hiranmoy.jpg" },
    { name: "Swayam Jaiswal", image: "/assets/sales/swayam.jpg" },
    { name: "Ankit Joshi", image: "/assets/sales/ankit.jpg" },
    { name: "Rahul Jha", image: "/assets/sales/rahul.jpg" },
    { name: "Kaushik Jana", image: "/assets/sales/kaushik.jpg" },
];

export default function Team() {
    return (
        <>
        <section className="px-4 py-16 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Directors</h2>
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-72 w-full">
                            <Image
                                src={member.image}
                                alt={member.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t-2xl"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl underline font-semibold mb-2 text-gray-800">
                                {member.name}
                            </h3>
                            <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                                {member.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet Our Sales Team</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                        {salesteamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <p className="mt-4 text-sm font-medium text-gray-800">{member.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}