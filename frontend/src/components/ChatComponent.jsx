import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaPaperPlane, FaUserCircle, FaUserTie } from 'react-icons/fa';

const ChatComponent = ({ complaintId }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        // Polling every 5 seconds for new messages
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [complaintId]);

    const fetchMessages = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`http://localhost:5000/api/messages/${complaintId}`, config);
            setMessages(res.data);
            scrollToBottom();
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = { complaintId, content: newMessage };

            // Optimistic update
            const tempMsg = {
                _id: Date.now(),
                content: newMessage,
                sender: { _id: user._id, name: user.name, role: user.role },
                createdAt: new Date().toISOString()
            };
            setMessages([...messages, tempMsg]);
            setNewMessage('');
            scrollToBottom();

            await axios.post('http://localhost:5000/api/messages', payload, config);
            fetchMessages(); // Sync with server
        } catch (err) {
            console.error("Error sending message:", err);
            const status = err.response?.status;
            const data = err.response?.data;
            const msg = data?.message || err.message || "Unknown Error";
            alert(`Debug Error: Status ${status}\nMessage: ${msg}\nDetails: ${JSON.stringify(data)}`);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-bold text-slate-700 dark:text-white flex items-center">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full mr-2"><FaUserTie /></span>
                    Official Chat
                </h3>
                <p className="text-xs text-slate-500 ml-10">Direct line to the assigned official</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 py-10 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender._id === user._id;
                    const isOfficial = msg.sender.role === 'official' || msg.sender.role === 'admin';

                    return (
                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none'
                                }`}>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-xs font-bold ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                                        {msg.sender.name}
                                    </span>
                                    {isOfficial && !isMe && (
                                        <span className="bg-saffron-100 text-saffron-800 text-[10px] px-1.5 rounded-full font-bold uppercase">Official</span>
                                    )}
                                </div>
                                <p className="text-sm">{msg.content}</p>
                                <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-transform active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;
