import {
    Car,
    Wifi,
    ShieldCheck,
    Dumbbell,
    Sun,
    Droplet,
    Trees,
    MonitorPlay,
    Users,
    Coffee,
    Building2,
    Landmark,
} from "lucide-react";

const amenities = [
    { icon: <Wifi className="text-blue-500 w-7 h-7" />, label: "High-Speed Wi-Fi" },
    { icon: <ShieldCheck className="text-green-500 w-7 h-7" />, label: "24x7 Security" },
    { icon: <Car className="text-indigo-500 w-7 h-7" />, label: "Spacious Parking" },
    { icon: <Dumbbell className="text-red-500 w-7 h-7" />, label: "Modern Gym" },
    { icon: <Sun className="text-yellow-500 w-7 h-7" />, label: "Sun Deck" },
    { icon: <Droplet className="text-sky-500 w-7 h-7" />, label: "Rainwater Harvesting" },
    { icon: <Trees className="text-green-700 w-7 h-7" />, label: "Green Landscape" },
    { icon: <MonitorPlay className="text-pink-500 w-7 h-7" />, label: "Mini Theatre" },
    { icon: <Users className="text-orange-500 w-7 h-7" />, label: "Community Hall" },
    { icon: <Coffee className="text-amber-600 w-7 h-7" />, label: "Cafe Lounge" },
    { icon: <Building2 className="text-purple-500 w-7 h-7" />, label: "Guest Suites" },
    { icon: <Landmark className="text-rose-500 w-7 h-7" />, label: "Temple Inside Campus" },
];

export default function Amenities() {
    return (
        <section className="py-12 px-4 md:px-16 bg-white w-full">
            <h2 className="text-3xl md:text-4xl font-bold  text-gray-800 mb-10">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {amenities.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
                    >
                        {item.icon}
                        <p className="mt-2 text-sm font-medium text-gray-700">{item.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
