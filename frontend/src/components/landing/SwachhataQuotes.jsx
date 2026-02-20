import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const quotes = [
    {
        sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।",
        transliteration: "Na Hi Gyanen Sadrusham Pavitram Iha Vidyate.",
        english: "Nothing is as sacred as knowledge (and purity of mind/body).",
        source: "Bhagavad Gita 4.38"
    },
    {
        sanskrit: "शरीरमाद्यं खलु धर्मसाधनम्।",
        transliteration: "Shariram Adyam Khalu Dharma Sadhanam.",
        english: "The body is the first instrument for doing good deeds. Keep it clean.",
        source: "Kalidasa (Kumarasambhava)"
    },
    {
        sanskrit: "स्वच्छता ईश्वर भक्तिः।",
        transliteration: "Swachhata Ishwara Bhaktih.",
        english: "Cleanliness is next to Godliness.",
        source: "Mahatma Gandhi"
    },
    {
        sanskrit: "सत्यं शिवं सुन्दरम्।",
        transliteration: "Satyam Shivam Sundaram.",
        english: "Truth is God, God is Beautiful. What is clean is beautiful.",
        source: "Ancient Proverb"
    }
];

const SwachhataQuotes = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % quotes.length);
        }, 6000); // Rotate every 6 seconds
        return () => clearInterval(interval);
    }, []);

    const quote = quotes[currentIndex];

    return (
        <section className="bg-orange-50 dark:bg-slate-800/50 py-16 border-y border-orange-100/50 dark:border-slate-700">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                    Swachhata Subhashita
                </div>

                <div className="relative p-8 md:p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-orange-100 dark:border-slate-700 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron-500 via-white to-indiaGreen-500"></div>
                    <FaQuoteLeft className="absolute top-8 left-8 text-orange-200 dark:text-slate-700 text-6xl opacity-50" />

                    <div className="relative z-10 animate-fadeIn" key={currentIndex}>
                        <h3 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-saffron-100 mb-2 font-serif">
                            {quote.sanskrit}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">
                            "{quote.transliteration}"
                        </p>
                        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {quote.english}
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">{quote.source}</span>
                        <div className="flex space-x-2">
                            {quotes.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-2 w-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-saffron-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SwachhataQuotes;
