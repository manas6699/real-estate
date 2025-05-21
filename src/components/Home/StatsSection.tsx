export default function StatsSection() {
    const stats = [
        {
            value: "70+",
            label: "Discover over 70 verified properties tailored to every need and budget. From luxurious villas to budget homes, we’ve got the perfect match for you.",
        },
        {
            value: "50+",
            label: "Browse through 50+ rental options across prime locations. Affordable, flexible, and ready-to-move-in homes just a click away.",
        },
        {
            value: "50+",
            label: "We cover 50+ top locations to give you more choices and convenience. Find your dream property exactly where you want to live or invest.",
        },
        {
            value: "500+",
            label: "Over 500 satisfied clients who found their perfect space with us. Your trust drives us to deliver better service, every single day.",
        },
    ];
      

    return (
        <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                    Our mission is to redefine real estate <br /> in the customer favor.
                </h2>
                <p className="text-gray-500 mt-5">
                    At MMR, our mission is to redefine real estate in the customer  favor — 
                    by making property buying, selling, and investing simpler, more transparent, and truly customer-centric.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <p className="text-2xl sm:text-3xl font-bold text-red-500">
                                {stat.value}
                            </p>
                            <p className="mt-5 font-semibold text-gray-600">{stat.label}</p>
                            
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
