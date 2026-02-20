import { FaCamera, FaMapMarkerAlt, FaUserTie, FaStar } from 'react-icons/fa';

const steps = [
    {
        icon: FaCamera,
        title: "Snap & Upload",
        desc: "Take a photo of the issue (garbage, pothole) and upload it via the app.",
        color: "text-orange-500",
        bg: "bg-orange-100 dark:bg-orange-900/30",
        border: "border-orange-200 dark:border-orange-800"
    },
    {
        icon: FaMapMarkerAlt,
        title: "Auto-Geotag",
        desc: "We automatically detect the location and assign it to the correct ward.",
        color: "text-blue-500",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-200 dark:border-blue-800"
    },
    {
        icon: FaUserTie,
        title: "Official Resolves",
        desc: "A sanitation worker is dispatched. You get real-time updates.",
        color: "text-purple-500",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-200 dark:border-purple-800"
    },
    {
        icon: FaStar,
        title: "Rate & Close",
        desc: "Verify the clean-up with a 'Before/After' photo and rate the service.",
        color: "text-green-500",
        bg: "bg-green-100 dark:bg-green-900/30",
        border: "border-green-200 dark:border-green-800"
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">How It Works</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-saffron-500 to-indiaGreen-500 mx-auto rounded-full mt-4"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Transforming your city in 4 simple steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-0 transform translate-y-1/2"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-full ${step.bg} ${step.border} border-4 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 bg-white dark:bg-slate-800`}>
                                <step.icon className={`text-3xl ${step.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>

                            {/* Step Number Badge */}
                            <div className="absolute top-0 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold border-2 border-white dark:border-slate-900">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
