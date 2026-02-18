import { useState, useEffect } from 'react';
import { FaHands } from 'react-icons/fa';

const Greeting = () => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check if greeted in this session
        const greeted = sessionStorage.getItem('greeted');
        if (!greeted) {
            const hour = new Date().getHours();
            let msg = "Namaste! Swagatam (Welcome)";
            if (hour < 12) msg = "Suprabhatam (Good Morning)";
            else if (hour < 18) msg = "Shubh Madhyahnam (Good Afternoon)";
            else msg = "Shubh Sandhya (Good Evening)";

            setMessage(msg);
            setShow(true);
            sessionStorage.setItem('greeted', 'true');

            // Auto hide after 4 seconds
            setTimeout(() => setShow(false), 4000);
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-white dark:bg-slate-800 border-2 border-saffron-500 rounded-full px-6 py-3 shadow-2xl flex items-center space-x-3">
                <FaHands className="text-saffron-500 text-2xl" />
                <span className="text-slate-800 dark:text-white font-bold font-serif text-lg">
                    {message} 🙏
                </span>
            </div>
        </div>
    );
};

export default Greeting;
