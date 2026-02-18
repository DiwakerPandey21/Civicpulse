# 🇮🇳 CivicPulse 2.0 - Next-Gen Citizen Grievance Portal

> **Empowering Citizens, Enabling Authorities.**
> A Smart, AI-Powered Platform for a Cleaner & Safer India.

![CivicPulse Banner](https://via.placeholder.com/1200x400?text=CivicPulse+2.0+Dashboard)

## 📖 Overview
**CivicPulse** is a modern full-stack web application designed to bridge the gap between citizens and municipal authorities. It allows users to report civic issues (like garbage dumps, potholes, or broken streetlights) and track their resolution in real-time.

With **CivicPulse 2.0**, we have integrated cutting-edge technologies like **AI Triage**, **Voice Reporting**, and **Real-time Chat** to make civic engagement accessible, efficient, and transparent.

---

## 🚀 Key Features

### 🧠 1. AI Triage System (Smart Classification)
-   **Auto-Categorization:** The system reads the complaint description and automatically selects the correct category (e.g., "Garbage Dump," "Dead Animal").
-   **Severity Estimation:** Detects urgent keywords (e.g., "Fire," "Accident") and marks severity as **High** or **Critical** automatically.
-   **Visual Feedback:** A pulsating "AI Analyzing..." badge provides real-time feedback.

### 🎤 2. Accessibility First (Voice Reporting)
-   **Voice-to-Text:** Users can speak to report issues instead of typing.
-   **Multi-Language Support:** Supports both **English (India)** and **Hindi** dictation.
-   **Hands-Free:** Ideal for users on the go or with lower digital literacy.

### 🗺️ 3. Smart Maps & toilet Locator
-   **Geolocation:** Automatically captures the user's GPS location for accurate reporting.
-   **Public Toilet Locator:** Interactive map to find nearby public restrooms with ratings and reviews.
-   **Garbage Truck Tracker:** (Simulated) Real-time tracking of waste collection vehicles.

### 💬 4. In-App Chat System
-   **Direct Communication:** Integrated chat within every complaint ticket.
-   **Official <-> Citizen:** Officials can ask for more details, and citizens can provide updates.
-   **Real-Time specific:** Polls for new messages to keep the conversation flowing.

### 🏆 5. Gamification (Swachhata Warriors)
-   **Points System:** Users earn points for reporting valid issues and rating toilets.
-   **Leaderboard:** "Top Citizens" are showcased on a monthly leaderboard.
-   **Badges:** Earn badges like "Scout," "Guardian," and "Warrior" (Backend supported).

### 📊 6. Admin Analytics ("War Room")
-   **Data Visualization:** Interactive charts showing complaint trends, category breakdowns, and resolution rates.
-   **Department Insights:** Helps officials identify hotspots and allocate resources effectively.

---

## 🛠️ Tech Stack

### Frontend
-   **React.js (Vite):** Fast, component-based UI.
-   **Tailwind CSS:** Modern, utility-first styling for a responsive design.
-   **Recharts:** For data visualization in the admin dashboard.
-   **Web Speech API:** Native browser API for voice-to-text.
-   **Leaflet Maps:** For interactive map features.

### Backend
-   **Node.js & Express.js:** Robust REST API architecture.
-   **MongoDB (Mongoose):** NoSQL database for flexible data modeling.
-   **JWT (JSON Web Tokens):** Secure authentication and role-based authorization.
-   **Multer:** For handling image uploads.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas URL)
-   Git

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
JWT_SECRET=your_jwt_secret_key
```

Start the Backend:
```bash
npm start
```
*(Runs on http://localhost:5000)*

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Start the Frontend:
```bash
npm run dev
```
*(Runs on http://localhost:5173)*

---

## 📱 User Guide

### For Citizens
1.  **Sign Up/Login:** Create an account securely.
2.  **Report Issue:** Click "Report Issue," describe the problem (or speak!), take a photo, and submit.
3.  **Track:** View the status on your dashboard timeline.
4.  **Chat:** If an official comments, reply directly in the complaint view.
5.  **Events:** Join community cleaning drives via the "Events" tab.

### For Officials (Admin)
1.  **Login:** Access the "War Room" dashboard.
2.  **Manage Complaints:** View pending issues, update status to "In Progress" or "Resolved."
3.  **Upload Proof:** Upload "After" photos when resolving an issue.
4.  **Analyze:** Use the Analytics tab to view charts and reports.

---

## 🤝 Contributing
Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for a Cleaner India.**
*Developer: Diwaker Pandey*
