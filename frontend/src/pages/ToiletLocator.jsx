import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';

// Fix for default marker icon in React Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when position changes
const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng]);
        }
    }, [lat, lng, map]);
    return null;
};

const ToiletLocator = () => {
    // Default to India Center if location not found yet
    const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 });
    const [hasLocation, setHasLocation] = useState(false);
    const [nearbyToilets, setNearbyToilets] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition({
                        lat: latitude,
                        lng: longitude
                    });
                    setHasLocation(true);
                    fetchToilets(latitude, longitude);
                },
                (err) => {
                    console.error("Location access denied or failed:", err);
                    // Fetch all/default toilets if location fails
                    fetchToilets();
                }
            );
        } else {
            fetchToilets();
        }
    }, []);

    const fetchToilets = async (lat = null, lng = null) => {
        try {
            let url = 'http://localhost:5000/api/toilets';

            // Priority 1: Fetch nearby toilets (100km radius) if location exists
            if (lat && lng) {
                const radiusUrl = `${url}?lat=${lat}&lng=${lng}&radius=100`;
                const res = await fetch(radiusUrl);
                const data = await res.json();

                if (data && data.length > 0) {
                    mapToilets(data, lat);
                    return;
                }
            }

            // Priority 2: Fallback to ALL toilets if no nearby found or no location

            const response = await fetch(url); // No params = fetch all
            const data = await response.json();
            mapToilets(data, lat);

        } catch (error) {
            console.error("Failed to fetch toilets:", error);
        }
    };

    const mapToilets = (data, userLat) => {
        const formattedToilets = data.map(t => ({
            id: t._id,
            name: t.name,
            address: t.address,
            absoluteLat: t.location.coordinates[1],
            absoluteLng: t.location.coordinates[0],
            facilities: t.facilities
        }));
        setNearbyToilets(formattedToilets);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-10 flex flex-col">
            <div className="bg-white dark:bg-slate-800 shadow-md p-4 mb-2 mx-4 rounded-xl border border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                            <FaMapMarkerAlt className="text-indiaGreen-600 mr-2" />
                            SBM Toilet Locator
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {hasLocation ? "Showing toilets near you" : "Showing map (Enable location for best results)"}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 bg-saffron-100 text-saffron-700 rounded-full hover:bg-saffron-200 transition"
                    >
                        <FaLocationArrow />
                    </button>
                </div>
            </div>

            {/* Map Container - FORCE VISIBILITY */}
            <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700 relative z-0" style={{ minHeight: '600px' }}>
                <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={hasLocation ? 15 : 5}
                    scrollWheelZoom={true}
                    style={{ height: "100%", minHeight: "600px", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterAutomatically lat={position.lat} lng={position.lng} />

                    {/* User Location Marker - Only show if we actually have their location */}
                    {hasLocation && (
                        <Marker position={[position.lat, position.lng]}>
                            <Popup>
                                <strong>You are here</strong>
                            </Popup>
                        </Marker>
                    )}

                    {/* Real Nearby Toilets */}
                    {nearbyToilets.map(toilet => (
                        <Marker
                            key={toilet.id}
                            position={[toilet.absoluteLat, toilet.absoluteLng]}
                        >
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-saffron-600">{toilet.name}</h3>
                                    <p className="text-xs text-start mt-1">
                                        <span className="font-bold text-slate-500">ID:</span> <span className="font-mono bg-slate-100 px-1 rounded select-all cursor-copy" title="Click to copy" onClick={(e) => { navigator.clipboard.writeText(toilet.id); alert('ID Copied: ' + toilet.id) }}>{toilet.id}</span>
                                    </p>
                                    <p className="text-xs">{toilet.address}</p>
                                    <div className="flex flex-wrap justify-center gap-1 mt-1">
                                        {toilet.facilities && toilet.facilities.map(f => (
                                            <span key={f} className="inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default ToiletLocator;
