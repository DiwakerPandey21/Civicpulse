import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaUserTie, FaUserShield, FaMobileAlt, FaEnvelope, FaLock, FaMapMarkerAlt, FaGlobe, FaSpinner, FaArrowRight, FaFingerprint } from 'react-icons/fa';
import Captcha from '../components/Captcha';

const Login = () => {
    const [role, setRole] = useState('citizen'); // citizen, official, admin
    const [authMethod, setAuthMethod] = useState('password'); // password, otp
    const [language, setLanguage] = useState('English');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Security States
    const [captchaValid, setCaptchaValid] = useState(false);
    const [locationDetected, setLocationDetected] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, sendOtp, verifyOtp, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) navigate('/dashboard');

        // Check for role passed from Landing Page
        if (location.state && location.state.role) {
            setRole(location.state.role);
        }

        // Simulate "Know your location" security check
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(() => {
                setLocationDetected(true);
            }, () => {
                setLocationDetected(false); // Valid to allow login even without location, but show secure icon status
            });
        }
    }, [user, navigate, location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (authMethod === 'password' && !captchaValid) {
            setError('Please verify the Captcha.');
            return;
        }

        setIsSubmitting(true);

        // OTP Login Logic
        if (authMethod === 'otp') {
            if (!otpSent) {
                // Sending OTP
                const res = await sendOtp(phone);
                setIsSubmitting(false);
                if (res.success) {
                    setOtpSent(true);
                    // In a real app, users wait for SMS. Here for demo we show it in alert or console
                    alert(`DEV MODE: OTP sent! Check console or use: ${res.devOtp}`);
                } else {
                    setError(res.error);
                }
                return;
            } else {
                // Verifying OTP
                const res = await verifyOtp(phone, otp);
                setIsSubmitting(false);
                if (res.success) {
                    navigate('/dashboard');
                } else {
                    setError(res.error);
                }
                return;
            }
        }

        // Email/Password Login
        const res = await login(email, password);
        setIsSubmitting(false);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    const roles = [
        { id: 'citizen', label: 'Citizen', icon: FaUser, color: 'from-orange-500 to-orange-600' },
        { id: 'official', label: 'Staff', icon: FaUserTie, color: 'from-blue-600 to-blue-700' },
        { id: 'admin', label: 'Admin', icon: FaUserShield, color: 'from-green-600 to-green-700' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 bg-india-cover bg-cover bg-center bg-no-repeat relative">
            {/* Overlay for background image readability */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-0"></div>

            <div className="w-full max-w-5xl z-10 flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl m-4 animate-fadeIn">

                {/* Left Side - Info & Branding */}
                <div className="md:w-5/12 text-white p-8 flex flex-col justify-between glass-panel border-r border-white/20 relative overflow-hidden">
                    {/* Decorative Background Elements */}
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
                                <h3 className="font-semibold text-lg mb-1 flex items-center text-green-200"><FaMapMarkerAlt className="mr-2" /> Secure Access</h3>
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

                {/* Right Side - Login Form */}
                <div className="md:w-7/12 bg-white dark:bg-slate-800 p-8 md:p-12 relative">
                    {/* Role Tabs */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mb-8">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-all duration-300 ${role === r.id
                                    ? `bg-white dark:bg-slate-600 shadow-md transform scale-105 text-slate-800 dark:text-white`
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <r.icon className={`mr-2 ${role === r.id ? 'text-saffron-600' : ''}`} /> {r.label}
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Sign In</h2>
                        <p className="text-slate-500 text-sm">Access your {role} dashboard securely.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg text-sm animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Auth Method Toggle */}
                    <div className="flex space-x-6 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
                        <button
                            onClick={() => setAuthMethod('password')}
                            className={`pb-2 text-sm font-medium transition-colors ${authMethod === 'password' ? 'text-saffron-600 border-b-2 border-saffron-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Password Login
                        </button>
                        <button
                            onClick={() => setAuthMethod('otp')}
                            className={`pb-2 text-sm font-medium transition-colors ${authMethod === 'otp' ? 'text-saffron-600 border-b-2 border-saffron-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            OTP / Mobile Login
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {authMethod === 'password' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 transition-all outline-none"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Password</label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                        <input
                                            type="password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 transition-all outline-none"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Security Check</label>
                                    <Captcha onValidate={setCaptchaValid} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mobile Number</label>
                                    <div className="relative group">
                                        <FaMobileAlt className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                        <input
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 transition-all outline-none"
                                            placeholder="+91 98765 43210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={otpSent}
                                            required
                                        />
                                    </div>
                                </div>
                                {otpSent && (
                                    <div className="space-y-1 animate-fadeIn">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Enter OTP</label>
                                        <div className="relative group">
                                            <FaFingerprint className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-saffron-200 focus:border-saffron-500 transition-all outline-none"
                                                placeholder="Enter 4-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">OTP sent successfully to {phone}</p>
                                    </div>
                                )}
                            </>
                        )}


                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${role === 'citizen' ? 'bg-gradient-to-r from-orange-500 to-orange-700' :
                                role === 'official' ? 'bg-gradient-to-r from-blue-600 to-blue-800' :
                                    'bg-gradient-to-r from-green-600 to-green-800'
                                } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? <FaSpinner className="animate-spin" /> : (
                                <>
                                    <span>{authMethod === 'otp' && !otpSent ? 'Send OTP' : 'Login Securely'}</span>
                                    <FaArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            New User?{' '}
                            <Link to="/register" className="text-saffron-600 font-bold hover:underline">
                                Register Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
