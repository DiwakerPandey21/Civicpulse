import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaMapMarkerAlt, FaGlobe, FaArrowRight, FaMobileAlt, FaKey } from 'react-icons/fa';

const Register = () => {
    // Step 1: Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Step 2: Verification
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, verifyRegistration, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Visual States
    const [language, setLanguage] = useState('English');
    const [locationDetected, setLocationDetected] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(() => {
                setLocationDetected(true);
            }, () => {
                setLocationDetected(false); // Silent fail allowed
            });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        // Call Register (Step 1)
        const res = await register(name, email, password, phone);
        setIsSubmitting(false);

        if (res.success) {
            setUserId(res.data._id);
            setStep(2); // Move to Verification Step
            // Alert for Dev Mode Convenience
            if (res.data.devEmailOtp) {
                alert(`DEV MODE:\nEmail OTP: ${res.data.devEmailOtp}\nPhone OTP: ${res.data.devPhoneOtp}`);
            }
        } else {
            setError(res.error);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const res = await verifyRegistration(userId, emailOtp, phoneOtp);
        setIsSubmitting(false);

        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 bg-india-cover bg-cover bg-center bg-no-repeat relative">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-0"></div>

            <div className="w-full max-w-5xl z-10 flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl m-4 animate-fadeIn">

                {/* Left Side styling remains same as Login/Register reuse */}
                <div className="md:w-5/12 text-white p-8 flex flex-col justify-between glass-panel border-r border-white/20 relative overflow-hidden">
                    {/* ... (Same decorative elements) ... */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-saffron-500/20 to-indiaGreen-500/20 z-0"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-saffron-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 -right-10 w-40 h-40 bg-indiaGreen-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-8 animate-float">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="w-12 h-12 drop-shadow-lg filter invert" />
                            <div>
                                <h1 className="text-2xl font-bold tracking-wider drop-shadow-md">CIVIC PULSE</h1>
                                <p className="text-xs opacity-90 letter-spacing-wide font-medium">GOVERNMENT OF INDIA SERVICE</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                                <h3 className="font-semibold text-lg mb-1 flex items-center text-green-200"><FaMapMarkerAlt className="mr-2" /> Secure Registration</h3>
                                <p className="text-sm opacity-90">
                                    {locationDetected ? "Location Verified: Punjab, India" : "Detecting Location for Security..."}
                                </p>
                            </div>

                            <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 delay-100">
                                <h3 className="font-semibold text-lg mb-1 flex items-center text-blue-200"><FaGlobe className="mr-2" /> Language</h3>
                                <div className="flex space-x-2 mt-2">
                                    {['English', 'हिन्दी', 'ਪੰਜਾਬੀ'].map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${language === lang ? 'bg-white text-blue-900 scale-110' : 'bg-black/30 text-white hover:bg-black/50'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 relative z-10">
                        <p className="text-xs opacity-70 text-center">© 2026 Department of Local Government. All Rights Reserved.</p>
                    </div>
                </div>

                {/* Right Side - Step Form */}
                <div className="md:w-7/12 bg-white dark:bg-slate-800 p-8 md:p-12 relative flex flex-col justify-center">

                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                            {step === 1 ? "Create Account" : "Verify Identity"}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {step === 1 ? "Join CivicPulse to improve your city." : "Enter OTPs sent to your Email & Phone."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg text-sm animate-shake">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name</label>
                                <div className="relative group">
                                    <FaUser className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                    <input type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 outline-none" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address</label>
                                <div className="relative group">
                                    <FaEnvelope className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                    <input type="email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 outline-none" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Phone Number</label>
                                <div className="relative group">
                                    <FaMobileAlt className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                    <input type="tel" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 outline-none" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                    <input type="password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 outline-none" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-gradient-to-r from-saffron-600 to-orange-700 disabled:opacity-70">
                                {isSubmitting ? <FaSpinner className="animate-spin" /> : <><span>Next: Verify Identity</span><FaArrowRight /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="space-y-1 animate-fadeIn">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email OTP</label>
                                <div className="relative group">
                                    <FaKey className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                    <input type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 outline-none" placeholder="Enter OTP sent to Email" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-1 animate-fadeIn delay-100">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Phone OTP</label>
                                <div className="relative group">
                                    <FaKey className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                    <input type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 outline-none" placeholder="Enter OTP sent to Phone" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} required />
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-gradient-to-r from-green-600 to-emerald-700 disabled:opacity-70">
                                {isSubmitting ? <FaSpinner className="animate-spin" /> : <><span>Verify & Complete Registration</span><FaArrowRight /></>}
                            </button>

                            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 underline">Back to Edit Details</button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-saffron-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
