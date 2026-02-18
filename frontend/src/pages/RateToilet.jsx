import { useState, useContext } from 'react';
import { FaStar, FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RateToilet = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [rating, setRating] = useState(0);
    const [toiletId, setToiletId] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get token from AuthContext
    const token = user?.token;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a star rating");
            return;
        }

        if (!token) {
            alert("You must be logged in to rate.");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    toiletId,
                    rating,
                    comment
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Thank you! Your rating has been submitted.`);
                navigate('/dashboard');
            } else {
                alert(data.message || "Failed to submit rating.");
            }
        } catch (error) {
            console.error("Rating Error:", error);
            alert(`Error: ${error.message || "Something went wrong"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-10 px-4">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="bg-gradient-to-r from-orange-500 to-saffron-500 p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Rate Public Toilet</h2>
                    <p className="opacity-90">Help others find clean toilets!</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Toilet ID (or Scan QR)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={toiletId}
                                onChange={(e) => setToiletId(e.target.value)}
                                placeholder="Paste ID from Locator (e.g. 64f...)"
                                className="input-field pr-12 font-mono text-sm"
                                required
                            />
                            <FaQrcode className="absolute right-4 top-3.5 text-slate-400 text-xl cursor-copy hover:text-saffron-500" title="In real app, this would open camera" />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Tip: Copy ID from the Toilet Locator popup</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Rating</label>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Comments (Optional)</label>
                        <textarea
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input-field"
                            placeholder="Was it clean? Water available?"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full btn-primary py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateToilet;
