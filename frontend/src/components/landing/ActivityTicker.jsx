import React from 'react';

const ActivityTicker = () => {
    // Simulated live updates for the UI enhancement
    const activities = [
        "🟢 Resolved: Garbage cleared in Sector 4",
        "📣 50 new citizens joined the Swachh Bharat movement today",
        "🏆 Sharma ji reached Top 10 Contributors",
        "🚨 Alert: Pothole reported in Downtown Avenue",
        "🌟 Smart Bin IoT sensor activated in City Center",
        "✅ 12 complaints successfully closed in the last hour"
    ];

    return (
        <div className="bg-indigo-950 border-b border-indigo-800 text-indigo-200 py-2 overflow-hidden flex whitespace-nowrap relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-indigo-950 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-indigo-950 to-transparent z-10"></div>

            {/* 
               We duplicate the content to create a seamless infinite scroll effect.
               The 'animate-marquee' class will slide it horizontally.
            */}
            <div className="animate-marquee inline-flex space-x-12">
                {[...activities, ...activities].map((text, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="font-medium tracking-wide">{text}</span>
                        <span className="text-indigo-700 mx-4">•</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTicker;
