import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaHome, FaCalendarAlt, FaClipboardList, FaTrophy, FaTrashAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const onLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const NavLink = ({ to, icon, text }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-saffron-600 dark:text-saffron-500' : 'text-slate-500 dark:text-slate-400'}`}>
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium">{text}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Top Navbar (Desktop + Mobile Header) */}
            <nav className="fixed w-full z-50 top-0 start-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 via-white to-indiaGreen-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-100 dark:border-slate-700">
                            <span className="text-navyBlue font-bold text-xs">CP</span>
                        </div>
                        <span className="self-center text-2xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-saffron-600 to-indiaGreen-600 dark:from-saffron-400 dark:to-indiaGreen-400">
                            CivicPulse
                        </span>
                    </Link>

                    <div className="flex items-center md:order-2 space-x-3 md:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 rounded-lg hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700"
                        >
                            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-slate-600" />}
                        </button>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link to="/leaderboard" className="text-slate-700 hover:text-saffron-600 dark:text-slate-200 font-medium transition flex items-center">
                                        <FaTrophy className="mr-1 text-yellow-500" /> Leaderboard
                                    </Link>
                                    <Link to="/events" className="text-slate-700 hover:text-saffron-600 dark:text-slate-200 font-medium transition flex items-center">
                                        <FaCalendarAlt className="mr-1 text-indiaGreen-500" /> Events
                                    </Link>
                                    <Link to="/smart-bins" className="text-slate-700 hover:text-blue-600 dark:text-slate-200 font-medium transition flex items-center">
                                        <FaTrashAlt className="mr-1 text-blue-500" /> IoT Bins <span className="ml-1 text-[10px] bg-red-500 text-white px-1 rounded animate-pulse">LIVE</span>
                                    </Link>
                                    <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
                                        <FaUserCircle className="text-saffron-600 text-xl" />
                                        <span className="font-semibold">{user.name}</span>
                                        <span className="bg-saffron-100 text-saffron-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize dark:bg-saffron-900 dark:text-saffron-300">
                                            {user.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link to="/login" className="text-slate-700 hover:text-saffron-600 dark:text-slate-200 font-medium transition">Login</Link>
                                    <Link to="/register" className="bg-saffron-500 text-white px-4 py-2 rounded-lg hover:bg-saffron-600 transition shadow-md shadow-saffron-500/30">Register</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button (Hamburger) */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 pt-4 pb-4 space-y-4 shadow-lg">
                        {!user && (
                            <div className="flex flex-col space-y-2">
                                <Link to="/login" className="block w-full text-center py-2 text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-700 rounded-lg">Login</Link>
                                <Link to="/register" className="block w-full text-center py-2 text-white font-medium bg-saffron-500 rounded-lg">Register</Link>
                            </div>
                        )}
                        {user && (
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <FaUserCircle className="text-saffron-600 text-xl" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
                                </div>
                                <button onClick={onLogout} className="text-red-500 hover:text-red-600"><FaSignOutAlt /></button>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Bottom Mobile Navigation (Only visible on mobile when logged in) */}
            {user && (
                <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 md:hidden pb-safe">
                    <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                        <div className="flex items-center justify-center">
                            <NavLink to="/" icon={<FaHome />} text="Home" />
                        </div>
                        <div className="flex items-center justify-center">
                            <NavLink to="/events" icon={<FaCalendarAlt />} text="Events" />
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-10"></div> {/* Spacer for FAB */}
                        </div>
                        <div className="flex items-center justify-center">
                            <NavLink to="/leaderboard" icon={<FaTrophy />} text="Leaders" />
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={onLogout} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 dark:text-slate-400">
                                <FaSignOutAlt className="text-xl" />
                                <span className="text-xs font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                    {/* Floating Action Button in Middle (Optional style) */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <Link to="/report-issue" className="flex items-center justify-center w-14 h-14 bg-indiaGreen-600 rounded-full shadow-lg border-4 border-white dark:border-slate-900 text-white">
                            <span className="text-2xl">+</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
