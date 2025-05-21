import Image from "next/image";
import {
    Handshake,
    LineChart,
    FileCheck,
    Users,
} from "lucide-react";

const ChooseUs = () => {
    return (
        <section className="py-16 px-4 md:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Image with Badge */}
                <div className="relative">
                    <Image
                        src="/assets/emami/1.webp"
                        alt="Luxury House"
                        width={700}
                        height={500}
                        className="rounded-2xl w-full h-auto"
                    />
                    <div className="absolute top-5 left-5 bg-white rounded-xl shadow-md px-4 py-2 flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                            <Users className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Clients</p>
                            <p className="font-semibold text-gray-800">7,000 M</p>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Why You Should Choose Us
                    </h2>

                    {/* Feature 1 */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-amber-100 rounded-xl">
                            <Handshake className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Customer-First Approach</h4>
                            <p className="text-sm text-gray-600">
                                We prioritize your needs, offering personalized guidance and transparent deals that truly work in your favor.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-200 rounded-xl">
                            <LineChart className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                Expert Market Insights
                            </h4>
                            <p className="text-sm text-gray-600">
                                Our team brings deep industry knowledge to help you make confident, well-informed purchase and sale decisions.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-200 rounded-xl">
                            <FileCheck className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Seamless Experience</h4>
                            <p className="text-sm text-gray-600">
                                From property search to final paperwork, we ensure a smooth, hassle-free journey every step of the way.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChooseUs;
