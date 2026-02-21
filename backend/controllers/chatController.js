const { GoogleGenAI } = require('@google/genai');

// We initialize inside the function or after dotenv runs
let ai = null;

const SYSTEM_PROMPT = `
You are "Namaste, Naagrik!", the official AI assistant for CivicPulse - a platform dedicated to the Swachh Bharat Mission 2.0 (Building a Cleaner, Smarter India Together). Your personality is helpful, polite, and encouraging. You always greet users warmly with "Namaste" or similar Indian greetings when appropriate. 

Your main goals are:
1. Help citizens report issues like potholes, garbage, water leaks, or broken streetlights.
2. Guide users on how to use the CivicPulse platform (e.g. tracking complaints, checking the leaderboard, registering for events).
3. Promote awareness about cleanliness, waste segregation, and sustainable practices.

If a user asks something unrelated to civic issues, smart cities, cleanliness, or the CivicPulse platform, politely steer the conversation back to how you can help them make their city better. Keep your responses concise, friendly, and formatted nicely.
`;

// @desc    Handle chat messages
// @route   POST /api/chat
// @access  Public (or Private depending on requirements, keeping Public for landing page)
const handleChat = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not defined in backend/.env!");
        }

        // Initialize if not already initialized (to ensure dotenv is loaded first)
        if (!ai) {
            ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        }

        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // Format history for Gemini API if provided (optional, for contextual conversations)
        let formattedHistory = [];
        if (history && Array.isArray(history)) {
            // Map our generic role format to Gemini's expected format if needed
            // Currently, genai SDK usually handles simple arrays or we can send it as part of the prompt
            formattedHistory = history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
        }

        // We use gemini-2.5-flash which is fast and included in the free tier
        // Note: SDK syntax for chat might require specific method depending on version, 
        // Using standard generateContent approach with system instructions if supported

        let responseText = "";

        // If SDK supports generateContent with system instruction
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...formattedHistory,
                { role: 'user', parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
            }
        });

        responseText = response.text;

        res.status(200).json({
            success: true,
            reply: responseText
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to communicate with AI Assistant. Please try again later.",
            error: error.message
        });
    }
};

module.exports = { handleChat };
