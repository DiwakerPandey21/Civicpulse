import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn } from 'react-icons/fa';

const AlertTicker = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/alerts');
                setAlerts(data);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="bg-red-600 text-white overflow-hidden relative shadow-md z-50">
            <div className="container mx-auto flex items-center h-10">
                <div className="bg-red-800 px-4 h-full flex items-center font-bold z-10 shadow-lg">
                    <FaBullhorn className="mr-2 animate-pulse" /> BREAKING
                </div>
                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    <div className="animate-marquee whitespace-nowrap absolute">
                        {alerts.map((alert, index) => (
                            <span key={alert._id} className="mx-8 font-medium tracking-wide">
                                • {alert.type === 'Critical' ? '🚨' : '📢'} <span className="uppercase font-bold">{alert.title}:</span> {alert.message}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default AlertTicker;
