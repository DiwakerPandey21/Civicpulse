import { useState } from 'react';
import { FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your valuable feedback!");
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-10 px-4">
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="bg-gradient-to-r from-navyBlue to-blue-600 p-8 text-white text-center">
                    <FaCommentDots className="text-4xl mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold mb-2">Provide Feedback</h2>
                    <p className="opacity-90">Tell us how we can improve the Swachhata App</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Feedback</label>
                        <textarea
                            rows="6"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="input-field"
                            placeholder="Share your thoughts, suggestions, or report bugs..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full btn-primary from-blue-600 to-navyBlue py-3 flex items-center justify-center space-x-2">
                        <span>Send Feedback</span>
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
