import { FaGithub, FaLinkedin, FaWhatsapp, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-12 pb-6 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Branding */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 via-white to-indiaGreen-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-700">
                                <span className="text-navyBlue font-bold text-xs">CP</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-saffron-400 to-indiaGreen-400">
                                CivicPulse
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering citizens and governance for a cleaner, smarter India.
                            Report issues, track resolution, and contribute to the Swachh Bharat Mission.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-saffron-400 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition">Government Initiatives</a></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-lg font-bold text-indiaGreen-400 mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="https://www.linkedin.com/in/diwaker-pandey1221/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 p-2 rounded-full hover:bg-blue-600 transition hover:-translate-y-1 transform">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="https://github.com/DiwakerPandey21" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition hover:-translate-y-1 transform">
                                <FaGithub size={20} />
                            </a>
                            <a href="https://wa.me/917870871950" target="_blank" rel="noopener noreferrer" className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition hover:-translate-y-1 transform">
                                <FaWhatsapp size={20} />
                            </a>
                        </div>
                        <p className="text-slate-400 text-sm">
                            <span className="block">Developed by Diwaker Pandey</span>
                            <span className="block text-xs mt-1 opacity-70">Full Stack Developer</span>
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; 2026 CivicPulse Initiative. All rights reserved.</p>
                    <p className="flex items-center mt-2 md:mt-0">
                        Made with <FaHeart className="text-red-500 mx-1 animate-pulse" /> in India 🇮🇳
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
