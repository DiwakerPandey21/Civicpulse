import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import GovernmentStats from '../components/GovernmentStats';
import { FaChartLine, FaClipboardCheck, FaExclamationTriangle, FaUserFriends, FaRestroom } from 'react-icons/fa';

const AnalyticsDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${user.token}`
                };

                const [statsRes, trendsRes, catsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/analytics/dashboard', { headers }),
                    fetch('http://localhost:5000/api/analytics/trends', { headers }),
                    fetch('http://localhost:5000/api/analytics/categories', { headers })
                ]);

                setStats(await statsRes.json());
                setTrends(await trendsRes.json());
                setCategories(await catsRes.json());
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.token]);

    if (loading) return <div className="text-center py-10"><FaChartLine className="animate-bounce text-4xl text-saffron-500 mx-auto" /> Loading War Room...</div>;
    if (!stats) return <div className="text-center text-red-500">Failed to load data.</div>;

    const COLORS = ['#FF9933', '#138808', '#000080', '#FFBB28', '#FF8042']; // India Flag Colors + Others

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* 1. Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
                        <FaChartLine className="mr-2 text-blue-600" />
                        Command Center (War Room)
                    </h2>
                    <p className="text-sm text-slate-500">Real-time city cleanliness overview</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold border border-green-200">
                    Live Data
                </div>
            </div>

            {/* 2. Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Complaints"
                    value={stats.complaints.total}
                    icon={<FaExclamationTriangle />}
                    color="text-red-500"
                    bg="bg-red-50 dark:bg-red-900/20"
                />
                <StatCard
                    title="Resolved"
                    value={stats.complaints.resolved}
                    sub={`${stats.complaints.resolutionRate}% Rate`}
                    icon={<FaClipboardCheck />}
                    color="text-green-600"
                    bg="bg-green-50 dark:bg-green-900/20"
                />
                <StatCard
                    title="Active Citizens"
                    value={stats.users.citizens}
                    icon={<FaUserFriends />}
                    color="text-blue-600"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatCard
                    title="Avg Toilet Rating"
                    value={stats.toilets.averageRating}
                    sub={`${stats.toilets.count} Toilets`}
                    icon={<FaRestroom />}
                    color="text-saffron-600"
                    bg="bg-orange-50 dark:bg-orange-900/20"
                />
            </div>

            {/* Government Stats Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">CivicPulse War Room</h2>
                <GovernmentStats />
            </div>

            {/* 3. Official Capabilities - ONLY FOR OFFICIALS */}
            <div className="mb-8 p-6 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-300 dark:border-slate-600 print:hidden">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <FaClipboardCheck className="mr-2 text-indigo-600" /> Official Actions
                </h3>
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        <span>🖨️ Print Monthly Report</span>
                    </button>

                    <button
                        onClick={() => {
                            const headers = ["Category,Value"];
                            const rows = categories.map(c => `${c.name},${c.value}`);
                            const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "complaint_stats.csv");
                            document.body.appendChild(link);
                            link.click();
                        }}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        <span>📊 Export Data (CSV)</span>
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Generate official reports for department review.</p>
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Trend Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-300">Complaint Trends (Last 7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey="complaints" fill="#FF9933" name="New Complaints" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-300">Issue Categories</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categories}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ title, value, sub, icon, color, bg }) => (
    <div className={`p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 ${bg} flex items-center justify-between transition-transform hover:scale-105`}>
        <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`text-3xl opacity-80 ${color}`}>
            {icon}
        </div>
    </div>
);

export default AnalyticsDashboard;
