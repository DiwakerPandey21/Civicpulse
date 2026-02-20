import { useEffect, useState } from 'react';

const Preloader = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(onFinish, 500); // Wait for fade out animation
        }, 2500); // Show logo for 2.5 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-white dark:bg-slate-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center animate-fadeIn">
                <div className="relative w-40 h-40 mb-6">
                    {/* Spinning Ring */}
                    <div className="absolute inset-0 border-4 border-t-saffron-500 border-r-transparent border-b-indiaGreen-500 border-l-transparent rounded-full animate-spin"></div>

                    {/* Inner Logo */}
                    <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-md p-4">
                        {/* User provided logo expected at /civicpulse_logo.png */}
                        <img src="/civicpulse_logo.png" alt="CivicPulse" className="w-full h-full object-contain animate-pulse" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-saffron-600 to-indiaGreen-600 tracking-wider">
                    CivicPulse
                </h1>
                <p className="text-slate-500 text-sm mt-3 tracking-widest uppercase">Building a Smarter India</p>

                {/* Loader Dots */}
                <div className="flex space-x-2 mt-4">
                    <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indiaGreen-500 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
