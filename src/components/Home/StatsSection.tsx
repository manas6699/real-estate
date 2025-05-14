export default function StatsSection() {
    const stats = [
        { value: "5.2M", label: "Owned from properties transactions" },
        { value: "7K+", label: "Properties For Buy" },
        { value: "4K+", label: "Properties Buy Sell" },
        { value: "221+", label: "Daily Completed Transactions" },
    ];

    return (
        <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                    Our mission is to redefine real estate <br /> in the customer favor.
                </h2>
                <p className="text-gray-500 mt-2">Lorem ipsum dolor sit amet</p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <p className="text-2xl sm:text-3xl font-bold text-red-500">
                                {stat.value}
                            </p>
                            <p className="mt-2 font-semibold text-gray-800">{stat.label}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Pellentesque egestas elementum egestas faucibus sem.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
