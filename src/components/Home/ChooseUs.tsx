import Image from "next/image";
import {
    Search,
    Users,
    KeyRound,
} from "lucide-react";

const ChooseUs = () => {
    return (
        <section className="py-16 px-4 md:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Image with Badge */}
                <div className="relative">
                    <Image
                        src="/assets/emami/1.webp" // replace with your image path
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
                        <div className="p-2 bg-gray-100 rounded-xl">
                            <Search className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Find Real Estate</h4>
                            <p className="text-sm text-gray-600">
                                Sumo petentium ut per, at his wisi utinam adipiscing. Est ei graeco
                                Lorem ipsum dolor sit amet, consectetur adipiscing
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-xl">
                            <Users className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Meet Relator</h4>
                            <p className="text-sm text-gray-600">
                                Sumo petentium ut per, at his wisi utinam adipiscing. Est ei graeco
                                Lorem ipsum dolor sit amet, consectetur adipiscing
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-xl">
                            <KeyRound className="w-6 h-6 text-gray-800" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Take The Keys</h4>
                            <p className="text-sm text-gray-600">
                                Sumo petentium ut per, at his wisi utinam adipiscing. Est ei graeco
                                Lorem ipsum dolor sit amet, consectetur adipiscing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChooseUs;