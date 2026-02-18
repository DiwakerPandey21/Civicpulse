import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login',
                { email, password },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/auth/register',
                { name, email, password, phone },
                config
            );

            // Don't set user yet, return data for step 2 verification
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            };
        }
    };

    const verifyRegistration = async (userId, emailOtp, phoneOtp) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/auth/verify-registration',
                { userId, emailOtp, phoneOtp },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            };
        }
    };

    const sendOtp = async (phone) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('http://localhost:5000/api/auth/send-otp', { phone }, config);
            return { success: true, message: data.message, devOtp: data.devOtp };
        } catch (error) {
            return {
                success: false,
                error: error.response && error.response.data.message ? error.response.data.message : error.message,
            };
        }
    };

    const verifyOtp = async (phone, otp) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { phone, otp }, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response && error.response.data.message ? error.response.data.message : error.message,
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, sendOtp, verifyOtp, verifyRegistration, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
