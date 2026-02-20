import { useState, useEffect } from 'react';

const Counter = ({ end, label, suffix = "+" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        // Calculate increment to finish in 2 seconds (2000ms) with 60fps (approx 33ms per frame)
        const duration = 2000;
        const increment = Math.ceil(end / (duration / 30));

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-b-4 border-saffron-500">
            <div className="text-4xl font-black text-slate-800 dark:text-white mb-2 font-mono">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {label}
            </div>
        </div>
    );
};

const ImpactCounters = () => {
    return (
        <section className="py-16 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold">Making a Real Impact</h2>
                    <p className="text-indigo-200 mt-2">Join thousands of citizens making a difference every day.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Counter end={1250} label="Complaints Resolved" />
                    <Counter end={5400} label="Active Citizens" />
                    <Counter end={89} label="Partnered NGO's" />
                    <Counter end={14500} label="Kg Waste Collected" suffix=" kg" />
                </div>
            </div>
        </section>
    );
};

export default ImpactCounters;
