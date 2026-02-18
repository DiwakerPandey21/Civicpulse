import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ChatComponent from '../components/ChatComponent';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaUserTie, FaCamera, FaTruck } from 'react-icons/fa';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Official Actions State
    const [resolutionStatus, setResolutionStatus] = useState('In Progress');
    const [note, setNote] = useState('');
    const [resolutionFile, setResolutionFile] = useState(null);
    const [updating, setUpdating] = useState(false);

    const handleStatusUpdate = async () => {
        if (resolutionStatus === 'Resolved' && !resolutionFile) {
            alert("Mandatory: Please upload a photo to prove resolution.");
            return;
        }

        setUpdating(true);
        const formData = new FormData();
        formData.append('status', resolutionStatus);
        formData.append('resolutionNote', note);
        if (resolutionFile) {
            formData.append('resolutionImage', resolutionFile);
        }

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    // 'Content-Type': 'multipart/form-data' // axios sets this automatically
                },
            };

            const res = await axios.patch(`http://localhost:5000/api/complaints/${id}/status`, formData, config);

            setComplaint(res.data); // Update local state
            alert("Status updated successfully!");
            setNote('');
            setResolutionFile(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`http://localhost:5000/api/complaints/${id}`, config);
                setComplaint(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching complaint details');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchComplaint();
        }
    }, [id, user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500">{error}</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 text-saffron-600 hover:underline">Go Back</button>
        </div>
    );

    if (!complaint) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
            case 'In Progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
            case 'Resolved': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
            case 'Rejected': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-india-gradient-subtle pt-24 pb-12 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-slate-600 dark:text-slate-300 mb-6 hover:text-saffron-600 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border-t-8 border-saffron-500">
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                                    {complaint.status}
                                </span>
                                <span className="text-slate-400 text-sm">#{complaint._id.substr(-6).toUpperCase()}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{complaint.title}</h1>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Created on</p>
                            <p className="font-medium text-slate-700 dark:text-slate-200">
                                {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Main Content */}
                        <div className="col-span-2 p-8 space-y-8">

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                                    <FaExclamationTriangle className="mr-2 text-saffron-500" /> Issue Description
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                    {complaint.description}
                                </p>
                            </div>

                            {/* Location */}
                            {complaint.location && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-green-600" /> Location
                                    </h3>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-300 font-mono text-sm">
                                            {complaint.location.address || `${complaint.location.lat}, ${complaint.location.lng}`}
                                        </span>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${complaint.location.lat},${complaint.location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-saffron-600 hover:underline text-sm font-medium"
                                        >
                                            View on Map
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Image Evidence */}
                            {complaint.media && typeof complaint.media === 'string' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                                        <FaCamera className="mr-2 text-blue-500" /> Evidence
                                    </h3>
                                    <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700 relative">
                                        <img
                                            src={`http://localhost:5000/${complaint.media.replace(/\\/g, '/')}`}
                                            alt="Complaint Evidence"
                                            className="w-full h-auto object-cover max-h-96"
                                        />
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                                            BEFORE
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar / Resolution Info */}
                        <div className="col-span-1 space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-900/30 p-8 border-l border-slate-100 dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">Status Timeline</h3>

                                {/* ... (Timeline content kept same) ... */}
                                <div className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                                    {/* Reported */}
                                    <div className="relative">
                                        <div className="absolute -left-[33px] bg-green-500 rounded-full p-1 text-white shadow-lg">
                                            <FaCheckCircle size={14} />
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">Reported</p>
                                        <p className="text-xs text-slate-500">{new Date(complaint.createdAt).toLocaleString()}</p>
                                    </div>

                                    {/* Dispatch Info */}
                                    {complaint.dispatchTime && (
                                        <div className="relative">
                                            <div className="absolute -left-[33px] bg-blue-500 rounded-full p-1 text-white shadow-lg">
                                                <FaTruck size={14} />
                                            </div>
                                            <p className="font-bold text-slate-800 dark:text-white">Vehicle Dispatched</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                {complaint.vehicleNumber} ({complaint.driverName})
                                            </p>
                                            <p className="text-xs text-slate-500">{new Date(complaint.dispatchTime).toLocaleString()}</p>
                                        </div>
                                    )}

                                    {/* Last Update */}
                                    <div className="relative">
                                        <div className={`absolute -left-[33px] rounded-full p-1 text-white shadow-lg ${complaint.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'
                                            }`}>
                                            <FaClock size={14} />
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">Current Status: {complaint.status}</p>
                                        <p className="text-xs text-slate-500">{new Date(complaint.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Official Action Area */}
                                {(user.role === 'official' || user.role === 'admin') && complaint.status !== 'Resolved' && (
                                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-3">Update Status</h4>

                                        {/* DISPATCH VEHICLE SECTION */}
                                        {complaint.status === 'Pending' && (
                                            <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-5 rounded-2xl border border-blue-100 dark:border-slate-600 shadow-sm">
                                                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                                                    <FaTruck className="mr-2 text-lg" /> Dispatch Vehicle
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Vehicle Number (e.g., PB-08-TR-1234)"
                                                            className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
                                                            id="vehicle-input"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Driver Name"
                                                            className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
                                                            id="driver-input"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            const vehicle = document.getElementById('vehicle-input').value;
                                                            const driver = document.getElementById('driver-input').value;
                                                            if (!vehicle || !driver) return alert("Enter Vehicle & Driver Details");

                                                            try {
                                                                await axios.put(`http://localhost:5000/api/complaints/${id}/dispatch`,
                                                                    { vehicleNumber: vehicle, driverName: driver },
                                                                    { headers: { Authorization: `Bearer ${user.token}` } }
                                                                );
                                                                alert("Vehicle Dispatched!");
                                                                window.location.reload();
                                                            } catch (err) {
                                                                alert("Dispatch Failed");
                                                            }
                                                        }}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center"
                                                    >
                                                        <FaTruck className="mr-2" /> Dispatch Team
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <select
                                            className="w-full p-2 mb-3 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                                            onChange={(e) => setResolutionStatus(e.target.value)}
                                            value={resolutionStatus}
                                        >
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>

                                        {resolutionStatus === 'Resolved' && (
                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                    Proof of Resolution (Required)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setResolutionFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-saffron-50 file:text-saffron-700 hover:file:bg-saffron-100"
                                                />
                                            </div>
                                        )}

                                        <textarea
                                            className="w-full p-2 mb-3 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm"
                                            placeholder="Add a note..."
                                            rows="3"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        ></textarea>

                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={updating}
                                            className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-slate-900 transition disabled:opacity-50"
                                        >
                                            {updating ? 'Updating...' : 'Update Status'}
                                        </button>
                                    </div>
                                )}

                                {/* Resolution Note & Evidence */}
                                {complaint.status === 'Resolved' && (
                                    <div className="mt-8 space-y-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                            <h4 className="font-bold text-green-800 dark:text-green-300 text-sm mb-2 flex items-center">
                                                <FaUserTie className="mr-2" /> Resolved by Official
                                            </h4>
                                            <p className="text-sm text-green-700 dark:text-green-200 italic mb-2">
                                                "{complaint.resolutionNote || 'Issue resolved.'}"
                                            </p>
                                            {complaint.resolutionDate && <p className="text-xs text-green-600 opacity-70">on {new Date(complaint.resolutionDate).toLocaleDateString()}</p>}
                                        </div>

                                        {complaint.resolutionImage && typeof complaint.resolutionImage === 'string' && (
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Proof of Resolution</h4>
                                                <div className="rounded-lg overflow-hidden border-2 border-green-500 relative group cursor-pointer" onClick={() => window.open(`http://localhost:5000/${complaint.resolutionImage.replace(/\\/g, '/')}`, '_blank')}>
                                                    <img
                                                        src={`http://localhost:5000/${complaint.resolutionImage.replace(/\\/g, '/')}`}
                                                        alt="Resolution Evidence"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold">View Full</span>
                                                    </div>
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                                                        <FaCheckCircle className="mr-1" /> AFTER
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                </div>

                {/* FULL WIDTH CHAT SECTION */}
                <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3"><FaUserTie /></span>
                        Official Discussion & Updates
                    </h3>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                        <ChatComponent complaintId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
