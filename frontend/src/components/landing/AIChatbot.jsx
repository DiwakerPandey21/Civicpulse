import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaUserCircle, FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: "Namaste! I am the CivicPulse AI. How can I help you make your city cleaner today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');

        // Add user message to UI
        const newMessages = [...messages, { role: 'user', text: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Send to our backend which talks to Gemini
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, {
                message: userMsg,
                history: newMessages.slice(0, -1) // Send history excluding the current message
            });

            if (res.data.success) {
                setMessages([...newMessages, { role: 'model', text: res.data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'model', text: "I'm sorry, I'm having trouble connecting to my servers right now." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, { role: 'model', text: "Apologies, there was an error processing your request. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            { role: 'model', text: "Namaste! I am the CivicPulse AI. How can I help you make your city cleaner today?" }
        ]);
    };

    // Static Widget View (Floating Action Button)
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-300 border-2 border-white dark:border-slate-800"
                aria-label="Open AI Chatbot"
            >
                {/* Decorative pulse ring */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20"></div>

                {/* AI Icon */}
                <span className="text-2xl md:text-3xl text-white drop-shadow-md pb-1">🙏</span>

                {/* Notification dot */}
                <span className="absolute top-0 right-0 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-saffron-500 border-2 border-white dark:border-slate-800"></span>
                </span>

                {/* Hover tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none hidden md:block">
                    Namaste, Naagrik! Let's chat 👋
                    <div className="absolute top-1/2 -mt-2 -right-2 border-8 border-transparent border-l-slate-800"></div>
                </div>
            </button>
        );
    }

    // Interactive Chat Mode
    return (
        <div className="relative z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 md:w-96 flex flex-col h-[500px] overflow-hidden animate-fadeIn transform origin-bottom-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">CivicPulse AI</h3>
                        <p className="text-xs text-indigo-200 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleClearChat}
                        className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
                        title="Reset Chat"
                    >
                        <FaSyncAlt size={14} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                        title="Close Chat"
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                    >
                        <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className="flex-shrink-0 mt-1">
                                {msg.role === 'user' ? (
                                    <FaUserCircle className="text-slate-400 text-2xl ml-2" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-2 border border-indigo-200 dark:border-indigo-800">
                                        <FaRobot size={14} />
                                    </div>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700'
                                    }`}
                            >
                                {/* Format markdown-like bold text simply */}
                                {msg.text.split('\n').map((line, i) => {
                                    // Handle basic bolding `**text**` and basic lists
                                    let formattedLine = line;
                                    // Replace **bold** with <strong>bold</strong>
                                    const parts = formattedLine.split(/(\*\*.*?\*\*)/g);

                                    return (
                                        <p key={i} className={i !== 0 ? 'mt-2' : ''}>
                                            {parts.map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex flex-row max-w-[85%]">
                            <div className="flex-shrink-0 mt-1 mr-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <FaRobot size={14} />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 flex space-x-2 items-center h-10">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1 w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-full transition-colors shadow-sm"
                    >
                        <FaPaperPlane size={12} className={input.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-400">Powered by Google Gemini</span>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
