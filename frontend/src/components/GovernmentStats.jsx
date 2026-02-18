import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBuilding, FaCheckCircle, FaChartLine } from 'react-icons/fa';

const GovernmentStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API Key provided by user
    const API_KEY = '579b464db66ec23bdd0000017808648a43d646f7606b27a16aa32b9a';
    const RESOURCE_ID = 'f1087af2-2f87-44f1-9782-a94aa46207cb';

    useEffect(() => {
        const fetchGovData = async () => {
            try {
                // Using a proxy or direct call if CORS allows. data.gov.in usually supports CORS.
                const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=1`);

                if (response.data && response.data.records && response.data.records.length > 0) {
                    setStats(response.data.records[0]);
                } else {
                    setError("No data found");
                }
            } catch (err) {
                console.error("Gov API Error:", err);
                setError("Failed to load Government Data");
            } finally {
                setLoading(false);
            }
        };

        fetchGovData();
    }, []);

    if (loading) return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
    );

    if (error) return null; // Hide if error to not break UI

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                <img src="https://data.gov.in/sites/default/files/subsite_logo_image/data-gov-logo.png" alt="Gov Data" className="h-6 mr-2" />
                SBM Urban Live Stats (Punjab)
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Mission Target</p>
                    <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {parseInt(stats.mission_target).toLocaleString()}
                        </span>
                        <FaBuilding className="ml-2 text-indigo-300 text-xl mb-1" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Completed</p>
                    <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {parseInt(stats.completed).toLocaleString()}
                        </span>
                        <FaCheckCircle className="ml-2 text-green-300 text-xl mb-1" />
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-slate-700 flex justify-between items-center">
                <p className="text-xs text-slate-500">Source: api.data.gov.in</p>
                <div className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    {Math.round((stats.completed / stats.mission_target) * 100)}% Achieved
                </div>
            </div>
        </div>
    );
};

export default GovernmentStats;
