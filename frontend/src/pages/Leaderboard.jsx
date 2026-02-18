import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaTrophy, FaMedal, FaUserAstronaut, FaCrown, FaStar } from 'react-icons/fa';

const Leaderboard = () => {
    const { user } = useContext(AuthContext);
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/leaderboard', config);
                setLeaders(data);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchLeaderboard();
        }
    }, [user]);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <FaCrown className="text-yellow-400 text-3xl animate-bounce" />;
            case 1: return <FaMedal className="text-gray-400 text-2xl" />;
            case 2: return <FaMedal className="text-orange-400 text-2xl" />;
            default: return <span className="font-bold text-slate-500 text-xl w-8 text-center">{index + 1}</span>;
        }
    };

    const getBadge = (points) => {
        if (points >= 100) return { name: "Swachhata Champion", color: "bg-gradient-to-r from-yellow-400 to-orange-500" };
        if (points >= 50) return { name: "Super Citizen", color: "bg-gradient-to-r from-blue-400 to-indigo-500" };
        if (points >= 20) return { name: "Active Contributor", color: "bg-gradient-to-r from-green-400 to-emerald-500" };
        return { name: "Rookie", color: "bg-slate-400" };
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-india-gradient-subtle pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-pink-600 mb-2 filter drop-shadow-sm flex justify-center items-center">
                        <FaTrophy className="mr-3 text-yellow-500" /> Swachhata Warriors
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300">Top citizens making a difference!</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <div className="bg-saffron-500 h-2 w-full"></div>

                    {leaders.map((leader, index) => {
                        const badge = getBadge(leader.points);
                        const isCurrentUser = user && user._id === leader._id;

                        return (
                            <div
                                key={leader._id}
                                className={`flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 ${isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <div className="flex-shrink-0 w-12 flex justify-center">
                                    {getRankIcon(index)}
                                </div>

                                <div className="flex-shrink-0 ml-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xl overflow-hidden border-2 border-white shadow-sm">
                                        {/* Avatar or Initial */}
                                        <FaUserAstronaut className="text-slate-400" />
                                    </div>
                                </div>

                                <div className="ml-4 flex-1">
                                    <div className="flex items-center">
                                        <h3 className={`font-bold text-lg ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                                            {leader.name} {isCurrentUser && "(You)"}
                                        </h3>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider ${badge.color}`}>
                                            {badge.name}
                                        </span>
                                    </div>
                                    <p className="text-green-600 font-medium text-xs flex items-center mt-1">
                                        <FaStar className="mr-1" /> {leader.points} Points
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {leaders.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No warriors yet. Be the first to report an issue!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
