<div align="center">
  <img src="https://via.placeholder.com/120?text=CP" alt="CivicPulse Logo" width="120" />
  
  # 🇮🇳 CivicPulse 2.0
  **Next-Gen Citizen Grievance & Smart City Portal**
  
  *Empowering Citizens. Enabling Authorities. Building a Cleaner, Smarter India Together.*

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Gemini API](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
</div>

<br />

![CivicPulse Banner](https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop)

## 📖 Overview

**CivicPulse 2.0** is a modern, full-stack web application designed to bridge the gap between citizens and municipal authorities under the vision of the **Swachh Bharat Mission 2.0**. 

It allows users to seamlessly report civic issues (such as garbage dumps, potholes, or broken streetlights), track their resolution in real-time, and actively participate in keeping their cities clean. With an incredibly highly-polished UI, glassmorphism design, and real-time interactions, CivicPulse makes civic engagement accessible, efficient, and transparent.

---

## 🚀 Key Features

### 🤖 1. "Namaste, Naagrik!" - Global AI Chatbot 
- **Google Gemini Powered:** An intelligent, universally floating AI assistant that helps citizens navigate the platform.
- **Context-Aware:** Specially primed to converse about Swachh Bharat principles and grievance reporting.
- **Beautiful UI:** Sleek Floating Action Button (FAB) that expands into a rich, markdown-supported chat interface.

### 🧠 2. AI Triage System (Smart Classification)
- **Auto-Categorization:** The system reads the complaint description and automatically selects the correct category (e.g., "Garbage Dump," "Dead Animal").
- **Severity Estimation:** Detects urgent keywords (e.g., "Fire," "Accident") and flags severity as **High** or **Critical**.

### 📱 3. Stunning, Dynamic UX & UI
- **Scroll Reveals:** Beautiful `fade-in-up` animations that trigger as users scroll down the page.
- **Live Activity Ticker:** A simulated real-time marquee showcasing the latest resolved issues and community milestones.
- **Micro-Animations:** Pulsing notification dots, shimmering gradients, and satisfying hover states on every card.

### 🎤 4. Accessibility First (Voice Reporting)
- **Voice-to-Text:** Users can speak to report issues instead of typing.
- **Multi-Language Support:** Supports both **English (India)** and **Hindi** dictation.

### 🗺️ 5. Smart Maps & Utilities
- **Public Toilet Locator:** Interactive map to find nearby public restrooms with ratings and reviews.
- **IoT Smart Bins (Simulated):** Real-time tracking of waste bin fill levels.

### 🏆 6. Gamification (Swachhata Warriors)
- **Points System:** Users earn points for reporting valid issues and rating public facilities.
- **Leaderboard:** Dynamic Hall of Fame highlighting the top-contributing citizens.

### 📊 7. Admin "War Room"
- **Data Visualization:** Interactive charts showing complaint trends, category breakdowns, and resolution rates.
- **Role-Based Workflows:** Distinct, secure dashboard interfaces for Citizens, Government Officials, and System Administrators.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js (Vite):** Lightning-fast component-based UI.
- **Tailwind CSS:** Modern utility-first styling for responsive, glassmorphism designs.
- **Recharts:** For data visualization.
- **Leaflet Maps:** For interactive geolocation features.

### **Backend**
- **Node.js & Express.js:** Robust REST API architecture.
- **MongoDB (Mongoose):** Flexible NoSQL database.
- **Google Gen AI SDK:** Direct integration with Gemini 2.5 Flash for the Chatbot.
- **JWT:** Secure, stateless authentication.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB URI (Local or Atlas)
- Google Gemini API Key (Free tier available at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/DiwakerPandey21/Civicpulse.git
cd Civicpulse
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the Backend:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the Frontend:
```bash
npm run dev
# Vite runs on http://localhost:5173
```

---

## 📱 User Guide By Role

### 👱 For Citizens
1. **Sign Up/Login:** Create an account securely.
2. **Global AI Help:** Click the bottom-right AI icon for any guidance!
3. **Report Issue:** Click "Report Issue", describe the problem (or speak!), upload a photo, and submit.
4. **Track & Chat:** View issue status on your timeline and chat directly with assigned officials.

### 👔 For Officials
1. **Manage Tasks:** View assigned territorial complaints.
2. **Update Status:** Mark issues as "In Progress" or "Resolved" and upload "After" photos as proof of work.

### 🛡️ For Administrators
1. **War Room:** Access the high-level analytics dashboard.
2. **Oversee Operations:** Monitor city-wide trends, resolve bottlenecks, and oversee the IoT bin networks.

---

## 🤝 Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <b>Built with ❤️ for a Cleaner India.</b><br>
  <i>Developer: Diwaker Pandey</i>
</div>
