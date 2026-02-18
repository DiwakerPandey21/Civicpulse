import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaMapMarkerAlt, FaCamera, FaSpinner, FaTrash, FaExclamationCircle } from 'react-icons/fa';

const ReportIssue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        severity: 'Medium',
        location: {
            latitude: '',
            longitude: '',
            address: ''
        },
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [voiceLang, setVoiceLang] = useState('en-IN'); // 'en-IN' or 'hi-IN'

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = voiceLang;
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setFormData(prev => ({
                    ...prev,
                    description: prev.description ? prev.description + ' ' + transcript : transcript
                }));
            };

            recognition.onerror = (event) => {
                console.error("Speech error", event.error);
                setIsListening(false);
                alert("Voice validation failed: " + event.error);
            };

            recognition.onend = () => setIsListening(false);

            recognition.start();
        } else {
            alert("Voice input is not supported in this browser. Please use Chrome/Edge.");
        }
    };

    // AI Triage Logic
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (formData.description.length > 10 && !isListening) {
                setIsAnalyzing(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const res = await axios.post('http://localhost:5000/api/analytics/ai-triage', {
                        description: formData.description
                    }, config);

                    const { category, severity } = res.data;

                    // Auto-fill logic
                    setFormData(prev => ({
                        ...prev,
                        category: category !== "Others" ? category : prev.category,
                        severity: severity
                    }));

                } catch (err) {
                    console.error("AI Analysis failed", err);
                } finally {
                    setIsAnalyzing(false);
                }
            }
        }, 1000); // 1s debounce

        return () => clearTimeout(timer);
    }, [formData.description, isListening, user.token]);

    const categories = [
        "Yellow Spot (Public Urination Spot)",
        "Overflow of Septic Tanks (New)",
        "Overflow of Sewerage or Storm Water",
        "Dead animal(s)",
        "Dustbins not cleaned",
        "Garbage dump",
        "Garbage vehicle not arrived",
        "Sweeping not done",
        "No electricity in public toilet(s)"
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setPreview(null);
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    location: {
                        ...formData.location,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` // Placeholder for reverse geocoding
                    }
                });
            }, (error) => {
                console.error("Error getting location", error);
                alert("Unable to retrieve your location");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('severity', formData.severity);
        // Backend expects a JSON string for location
        data.append('location', JSON.stringify(formData.location));

        if (formData.image) {
            // Backend expects 'media' field name
            data.append('media', formData.image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('http://localhost:5000/api/complaints', data, config);
            navigate('/dashboard');
        } catch (err) {
            console.error("Error submitting complaint", err);
            const errorMessage = err.response?.data?.message || 'Error submitting complaint';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <div className="bg-gradient-to-r from-saffron-500 to-saffron-600 p-8 text-white">
                        <h2 className="text-3xl font-bold mb-2">Report an Issue</h2>
                        <p className="opacity-90">Help us keep India clean! 🇮🇳</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {/* Title & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Issue Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Garbage Dump"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                                    Category
                                    {isAnalyzing && (
                                        <span className="text-xs text-saffron-600 animate-pulse flex items-center gap-1">
                                            ✨ AI Analyzing...
                                        </span>
                                    )}
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={voiceLang}
                                        onChange={(e) => setVoiceLang(e.target.value)}
                                        className="text-xs p-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="en-IN">English</option>
                                        <option value="hi-IN">Hindi</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={startListening}
                                        disabled={isListening}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${isListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200'
                                            }`}
                                    >
                                        {isListening ? (
                                            <><span>Listening...</span></>
                                        ) : (
                                            <><span>🎤 Speak</span></>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <textarea
                                name="description"
                                rows="4"
                                placeholder="Describe the issue in detail... (or use the mic button)"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            ></textarea>
                        </div>

                        {/* Severity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Severity</label>
                            <div className="flex gap-2">
                                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                                    <button
                                        type="button"
                                        key={level}
                                        onClick={() => setFormData({ ...formData, severity: level })}
                                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${formData.severity === level
                                            ? 'bg-slate-800 text-white shadow-md dark:bg-saffron-500'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location & Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-saffron-500 hover:text-saffron-600 transition-colors dark:border-slate-600 dark:text-slate-400"
                                >
                                    <FaMapMarkerAlt />
                                    <span>{formData.location.latitude ? 'Location Captured' : 'Use Current Location'}</span>
                                </button>
                                {formData.location.latitude && (
                                    <p className="text-xs text-green-600 mt-2 text-center">
                                        Lat: {formData.location.latitude.toFixed(4)}, Long: {formData.location.longitude.toFixed(4)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Evidence</label>
                                {!preview ? (
                                    <label className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-saffron-500 hover:text-saffron-600 transition-colors cursor-pointer dark:border-slate-600 dark:text-slate-400">
                                        <FaCamera />
                                        <span>Upload Photo</span>
                                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 group">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center space-x-2"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <span>Submit Report</span>}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;
