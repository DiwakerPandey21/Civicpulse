import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie, FaUserShield, FaArrowRight, FaLeaf, FaHandsHelping, FaCity } from 'react-icons/fa';
import Footer from '../components/Footer';
import HowItWorks from '../components/landing/HowItWorks';
import SwachhataQuotes from '../components/landing/SwachhataQuotes';
import ImpactCounters from '../components/landing/ImpactCounters';
import TopContributors from '../components/landing/TopContributors';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate('/login', { state: { role } });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative bg-indigo-900 text-white overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop"
                        alt="India Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/90 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 md:pt-40 md:pb-32 relative z-10 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-indigo-800/50 rounded-full px-4 py-1.5 border border-indigo-500/30 backdrop-blur-sm animate-fadeIn">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium text-indigo-200 uppercase tracking-widest">Swachh Bharat Mission 2.0</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Building a <span className="text-saffron-400">Cleaner, Smarter</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-500 font-extrabold">India</span> Together.
                        </h1>
                        <p className="text-lg text-indigo-100 max-w-lg leading-relaxed">
                            Join the movement. Report issues, track progress, and collaborate with your local administration to transform our cities.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => handleRoleSelect('citizen')} className="px-8 py-3 bg-saffron-500 hover:bg-saffron-600 text-white rounded-full font-bold shadow-lg shadow-saffron-500/30 transition transform hover:-translate-y-1">
                                Get Started
                            </button>
                            <button onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full font-medium backdrop-blur-sm transition">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Namaste Hook - AI Avatar Widget */}
                    <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end relative">
                        <div className="relative w-80 h-80 md:w-96 md:h-96">
                            {/* Decorative Circles */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-500 to-indiaGreen-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                            {/* Avatar Container */}
                            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
                                <div className="flex items-center space-x-4 border-b border-white/10 pb-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-2xl shadow-inner">
                                        🙏
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Namaste, Naagrik!</h3>
                                        <p className="text-xs text-indigo-200">AI Assistant</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-indigo-900/50 p-3 rounded-lg rounded-tl-none text-sm text-indigo-100 italic border-l-4 border-saffron-500">
                                        "I am here to help you make your city cleaner. Are you ready to report a problem today?"
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-2 w-16 bg-slate-500/30 rounded-full animate-pulse"></div>
                                        <div className="h-2 w-10 bg-slate-500/30 rounded-full animate-pulse delay-100"></div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indiaGreen-500 rounded-full opacity-20 blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Flowchart */}
            <HowItWorks />

            {/* Impact Counters */}
            <ImpactCounters />

            {/* Role Selection Section */}
            <div id="roles" className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Choose Your Role</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-saffron-500 to-indiaGreen-500 mx-auto rounded-full"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Whether you're a citizen reporting an issue or an official resolving it, CivicPulse empowers everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Citizen Card */}
                        <div
                            onClick={() => handleRoleSelect('citizen')}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 dark:border-slate-700 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-orange-600"></div>
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                                <FaUser size={30} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Citizen</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Report potholes, garbage, and other issues. Track their status in real-time and rate public facilities.
                            </p>
                            <span className="text-orange-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                Enter Portal <FaArrowRight className="ml-2" />
                            </span>
                        </div>

                        {/* Official Card */}
                        <div
                            onClick={() => handleRoleSelect('official')}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 dark:border-slate-700 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-blue-700"></div>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                <FaUserTie size={30} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Govt. Official</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Manage assigned tasks, dispatch vehicles, update complaint status, and view department analytics.
                            </p>
                            <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                Staff Login <FaArrowRight className="ml-2" />
                            </span>
                        </div>

                        {/* Admin Card */}
                        <div
                            onClick={() => handleRoleSelect('admin')}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 dark:border-slate-700 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-500 to-green-700"></div>
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                                <FaUserShield size={30} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Administrator</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Oversee city-wide operations, manage users, broadcast alerts, and access the War Room dashboard.
                            </p>
                            <span className="text-green-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                Admin Console <FaArrowRight className="ml-2" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wisdom Corner */}
            <SwachhataQuotes />

            {/* Hall of Fame */}
            <TopContributors />

            {/* Features Preview */}
            <div className="py-20 bg-white dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full mx-auto flex items-center justify-center text-green-600 mb-4">
                                <FaLeaf size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Eco-Friendly</h3>
                            <p className="text-slate-500 text-sm">Promoting sustainable waste management and green city initiatives.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full mx-auto flex items-center justify-center text-blue-600 mb-4">
                                <FaCity size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Smart Infrastructure</h3>
                            <p className="text-slate-500 text-sm">IoT-enabled monitoring for bins, streetlights, and public utilities.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full mx-auto flex items-center justify-center text-purple-600 mb-4">
                                <FaHandsHelping size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Community Driven</h3>
                            <p className="text-slate-500 text-sm">Volunteers and citizens working together for a better tomorrow.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LandingPage;
