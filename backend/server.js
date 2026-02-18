const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/toilets', require('./routes/toiletRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/bins', require('./routes/binRoutes'));

const { simulateBinUpdates } = require('./controllers/binController');

// IoT Simulation Loop (Run every 10 seconds)
setInterval(() => {
    simulateBinUpdates(); // Updates bin fill levels & auto-creates complaints
}, 10000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
