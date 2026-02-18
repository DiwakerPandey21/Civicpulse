import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SmartBinMap = () => {
    const [bins, setBins] = useState([]);
    const [logs, setLogs] = useState([]);

    // Poll for updates every 2 seconds to show live movement
    useEffect(() => {
        const fetchBins = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/bins');
                setBins(res.data);

                // Generate simulated Logs based on changes
                const randomBin = res.data[Math.floor(Math.random() * res.data.length)];
                if (randomBin) {
                    const logMsg = `Bin ${randomBin.id} level updated to ${randomBin.fillLevel}%`;
                    setLogs(prev => [logMsg, ...prev].slice(0, 10));
                }
            } catch (err) {
                console.error("Error fetching bins", err);
            }
        };

        const interval = setInterval(fetchBins, 2000);
        fetchBins(); // Initial load

        return () => clearInterval(interval);
    }, []);

    const getBinIcon = (fillLevel) => {
        let color = 'green';
        if (fillLevel > 50) color = 'gold';
        if (fillLevel > 90) color = 'red';

        return new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    };

    return (
        <div className="min-h-screen pt-20 pb-10 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row h-screen">

            {/* Sidebar / Logs */}
            <div className="w-full md:w-1/4 bg-white dark:bg-slate-800 p-4 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
                    IoT Live Feed
                </h2>
                <div className="space-y-2">
                    {logs.map((log, index) => (
                        <div key={index} className="text-xs font-mono p-2 bg-slate-100 dark:bg-slate-900 rounded border-l-4 border-saffron-500 text-slate-600 dark:text-slate-400">
                            <span className="text-slate-400">{new Date().toLocaleTimeString()}</span> : {log}
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-sm text-slate-500">Waiting for sensor data...</p>}
                </div>
            </div>

            {/* Map Area */}
            <div className="w-full md:w-3/4 relative z-0">
                <MapContainer center={[31.3260, 75.5762]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {bins.map(bin => (
                        <Marker key={bin._id} position={[bin.location.lat, bin.location.lng]} icon={getBinIcon(bin.fillLevel)}>
                            <Popup>
                                <div className="text-center">
                                    <strong className="text-lg">{bin.id}</strong><br />
                                    <span className="text-sm text-slate-500">{bin.location.address}</span>
                                    <div className="my-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-full">
                                        <div
                                            className={`h-2.5 rounded-full ${bin.fillLevel > 90 ? 'bg-red-600' : bin.fillLevel > 50 ? 'bg-yellow-400' : 'bg-green-600'}`}
                                            style={{ width: `${bin.fillLevel}%` }}>
                                        </div>
                                    </div>
                                    <p className="font-bold">{bin.fillLevel}% Full</p>
                                    <p className={`text-xs font-bold ${bin.status === 'Critical' ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                        Status: {bin.status}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Floating Legend */}
                <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl z-[1000] text-xs">
                    <h4 className="font-bold mb-2 text-slate-700 dark:text-slate-300">Legend</h4>
                    <div className="flex items-center mb-1"><span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span> &lt; 50% Safe</div>
                    <div className="flex items-center mb-1"><span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span> 50-90% Warning</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span> &gt; 90% Critical</div>
                </div>
            </div>
        </div>
    );
};

export default SmartBinMap;
