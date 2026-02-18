import { useState, useEffect, useRef } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const Captcha = ({ onValidate }) => {
    const [captchaCode, setCaptchaCode] = useState('');
    const [input, setInput] = useState('');
    const canvasRef = useRef(null);

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        setCaptchaCode(code);
        setInput('');
        onValidate(false);
        drawCaptcha(code);
    };

    const drawCaptcha = (code) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Noise (Lines)
        for (let i = 0; i < 7; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        // Noise (Dots)
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Text
        ctx.font = 'bold 24px Courier New';
        ctx.fillStyle = '#374151';
        ctx.textBaseline = 'middle';

        // Draw each character with random rotation/scale
        const charWidth = canvas.width / 6;
        for (let i = 0; i < code.length; i++) {
            ctx.save();
            ctx.translate(15 + i * charWidth, canvas.height / 2);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);
        if (val === captchaCode) {
            onValidate(true);
        } else {
            onValidate(false);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <canvas
                    ref={canvasRef}
                    width="160"
                    height="50"
                    className="rounded-lg border border-slate-300 shadow-inner cursor-pointer"
                    onClick={generateCaptcha}
                    title="Click to refresh"
                />
                <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 text-slate-500 hover:text-saffron-600 transition-colors"
                >
                    <FaSyncAlt />
                </button>
            </div>
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="Enter Captcha"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none bg-slate-50 text-slate-800 tracking-widest font-mono"
            />
        </div>
    );
};

export default Captcha;
