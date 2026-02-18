import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaUsers, FaCheckCircle, FaFilter } from 'react-icons/fa';

const Events = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);

    // New Event Form State
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        type: 'Cleanup Drive',
        date: '',
        location: '',
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, [user.token]);

    const [joiningId, setJoiningId] = useState(null);

    const fetchEvents = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/events', config);
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load events. Please check your connection.");
            setLoading(false);
        }
    };

    const handleJoin = async (id) => {
        setJoiningId(id);
        console.log("Attempting to join event:", id);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`http://localhost:5000/api/events/${id}/join`, {}, config);
            console.log("Join response:", res.data);

            await fetchEvents(); // Refresh list to show updated attendees
            alert("Success: " + res.data.message);
        } catch (err) {
            console.error("Join error:", err);
            const msg = err.response?.data?.message || "Failed to join event. Check console.";
            alert("Error: " + msg);
        } finally {
            setJoiningId(null);
        }
    };

    // ... (rest of handles)

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/events', newEvent, config);
            setShowModal(false);
            setNewEvent({
                title: '',
                description: '',
                type: 'Cleanup Drive',
                date: '',
                location: '',
            });
            fetchEvents(); // Refresh events list
        } catch (err) {
            console.error("Error creating event:", err);
            alert("Failed to create event. Please try again.");
        }
    };

    const filteredEvents = filter === 'All' ? events : events.filter(e => e.type === filter);

    if (loading) return <div className="text-center py-20">Loading Events...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center">
                            <FaCalendarAlt className="mr-3 text-saffron-600" /> Community Events
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Join hands for a cleaner India! 🇮🇳</p>
                    </div>
                    {(user.role === 'official' || user.role === 'admin') && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-indiaGreen-600 hover:bg-indiaGreen-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                        >
                            <FaPlus className="mr-2" /> Create Event
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                    {['All', 'Cleanup Drive', 'Health Camp', 'Water Cut', 'Awareness'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === type
                                ? 'bg-saffron-500 text-white shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map(event => (
                        <div key={event._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                            <div className={`h-2 w-full ${event.type === 'Cleanup Drive' ? 'bg-green-500' :
                                event.type === 'Water Cut' ? 'bg-blue-500' :
                                    event.type === 'Health Camp' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${event.type === 'Cleanup Drive' ? 'bg-green-100 text-green-700' :
                                        event.type === 'Water Cut' ? 'bg-blue-100 text-blue-700' :
                                            event.type === 'Health Camp' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {event.type}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{event.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{event.description}</p>

                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <FaMapMarkerAlt className="mr-2" /> {event.location}
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center text-sm text-slate-500 transform transition-transform hover:scale-105 cursor-default" title="Verified Attendees">
                                        <FaUsers className="mr-2 text-indigo-500" />
                                        <span className="font-bold text-slate-700 dark:text-slate-200 mr-1">{event.attendees.length}</span> Going
                                    </div>

                                    {event.attendees.includes(user._id) ? (
                                        <button disabled className="bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center cursor-default">
                                            <FaCheckCircle className="mr-2" /> Joined
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleJoin(event._id)}
                                            disabled={joiningId === event._id}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 text-white ${joiningId === event._id ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                        >
                                            {joiningId === event._id ? 'Joining...' : "I'm Interested"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            No events found for this category.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Create New Event</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea
                                    required
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                                    rows="3"
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                    <select
                                        className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                                        value={newEvent.type}
                                        onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                    >
                                        <option>Cleanup Drive</option>
                                        <option>Health Camp</option>
                                        <option>Water Cut</option>
                                        <option>Awareness</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                                    value={newEvent.location}
                                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white rounded-lg font-bold"
                                >
                                    Post Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
