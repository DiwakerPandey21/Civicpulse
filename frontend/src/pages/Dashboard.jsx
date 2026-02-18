import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Greeting from '../components/Greeting';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCamera, FaStar, FaCommentDots, FaClipboardCheck, FaTrashAlt, FaBolt, FaWater, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { darkMode } = useTheme();
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const res = await axios.get('http://localhost:5000/api/complaints', config);
                setComplaints(res.data);

                // Calculate stats
                const total = res.data.length;
                const pending = res.data.filter(c => c.status === 'pending').length;
                const resolved = res.data.filter(c => c.status === 'resolved').length;
                setStats({ total, pending, resolved });

            } catch (err) {
                console.error("Error fetching complaints", err);
            }
        };
        if (user && user.token) {
            fetchComplaints();
        }
    }, [user]);

    const tileClasses = "flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 dark:border-slate-700 bg-gradient-to-br backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 group relative overflow-hidden";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-24 px-4 sm:px-6">
            <Greeting />

            {/* Header Section */}
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-saffron-500 via-white to-indiaGreen-500 mb-4">
                    <img
                        src={"https://ui-avatars.com/api/?name=" + user.name + "&background=random"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800"
                    />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-saffron-600 to-indiaGreen-600 dark:from-saffron-400 dark:to-indiaGreen-400 mb-2">
                    Welcome, Swachhata Citizen {user.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Here are today's actions for you. Let's keep India clean! 🇮🇳
                </p>
            </div>

            {/* ANALYTICS DASHBOARD (WAR ROOM) - Only for Officials/Admins */}
            {(user.role === 'admin' || user.role === 'official') && (
                <div className="max-w-7xl mx-auto mb-10">
                    <AnalyticsDashboard />
                </div>
            )}

            {/* Main Action Tiles (Grid Layout like Swachhata App) */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 auto-rows-fr mb-10">

                {/* Post Complaint */}
                <Link to="/report-issue" className={`${tileClasses} from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30`}>
                    <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-md mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">
                        <FaCamera className="text-3xl text-indiaGreen-600 dark:text-indiaGreen-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white relative z-10">Post A Complaint</h3>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 relative z-10">Report garbage, potholes, & more</p>
                </Link>

                {/* Rate Toilet */}
                <Link to="/rate-toilet" className={`${tileClasses} from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30`}>
                    <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-md mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">
                        <FaStar className="text-3xl text-saffron-600 dark:text-saffron-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white relative z-10">Rate Public Toilet</h3>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 relative z-10">Scan QR Code & Rate</p>
                </Link>

                {/* SBM Toilet Locator */}
                <Link to="/toilet-locator" className={`${tileClasses} from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30`}>
                    <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-md mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">
                        <FaMapMarkerAlt className="text-3xl text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white relative z-10">SBM Toilet Locator</h3>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 relative z-10">Find nearest public toilet</p>
                </Link>

                {/* Provide Feedback */}
                <Link to="/feedback" className={`${tileClasses} from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30`}>
                    <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-md mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">
                        <FaCommentDots className="text-3xl text-navyBlue dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white relative z-10">Provide Feedback</h3>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 relative z-10">App experience & ideas</p>
                </Link>
            </div>

            {/* Recent Activity / Complaints Summary */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <FaClipboardCheck className="mr-2 text-saffron-600" /> Your Activity
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {complaints.length > 0 ? (
                        complaints.slice(0, 3).map((complaint) => (
                            <div key={complaint._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {complaint.category === 'Garbage' ? <FaTrashAlt /> :
                                            complaint.category === 'Water' ? <FaWater /> :
                                                complaint.category === 'Electricity' ? <FaBolt /> : <FaExclamationTriangle />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-white">{complaint.title}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {complaint.status}
                                        </span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ID: {complaint._id.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <span className="text-xs text-slate-400 font-mono">ID: {complaint._id.substr(-6).toUpperCase()}</span>
                                    <Link
                                        to={`/complaint/${complaint._id}`}
                                        className="text-sm text-saffron-600 font-medium hover:underline flex items-center"
                                    >
                                        View Status <span className="ml-1">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">No complaints reported yet.</p>
                            <Link to="/report-issue" className="text-saffron-600 font-semibold hover:underline mt-2 inline-block">Report your first issue</Link>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
