# Notes App - A Responsive and Feature-Rich Note-Taking Application

## Overview
Welcome to the **Notes App**, a modern, responsive, and user-friendly note-taking application built with **React.js** and styled using **Tailwind CSS**.

This project empowers users to effortlessly manage their notes by allowing them to **add, edit, and delete** notes with precision. Each note is **timestamped** with the current date and time, ensuring a chronological record of your thoughts and tasks.

Designed for **personal productivity**, this app offers a **clean interface, user authentication, and advanced features** like **categorization, search, and sorting**, making it ideal for students, professionals, and anyone looking to **organize their ideas effectively**.

## 🚀 Features
- **🔐 Dual Authentication:** Login with email/password (JWT) or Google OAuth
- **📝 Add Notes:** Create new notes with titles, detailed content, and optional categories
- **✏️ Edit Notes:** Modify existing notes seamlessly
- **❌ Delete Notes:** Remove unwanted notes with a single click
- **⏳ Timestamped Notes:** Automatically records creation and update times
- **🔍 Search Functionality:** Filter notes by title or content in real-time
- **📂 Category Filtering:** Sort and view notes by category
- **📱 Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **🔒 User-Specific Notes:** Each user sees only their own notes
- **🎨 Modern UI:** Vibrant, intuitive interface with Tailwind CSS

## 🛠 Technologies Used
- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, MongoDB, Passport.js
- **Authentication:** JWT tokens, Google OAuth 2.0
- **Database:** MongoDB with Mongoose ODM

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Google OAuth credentials** (optional, for Google login)

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd Notes-app
   npm install
   cd server
   npm install
   cd ..
   ```

2. **Environment Configuration**
   - Update `server/.env` with your credentials:
   ```
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Google OAuth Setup (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:5000/auth/google/callback`

4. **Run the Application**
   ```bash
   npm run dev
   ```
   This command starts both frontend (port 3000) and backend (port 5000) simultaneously.

### Alternative Commands
- `npm run client` - Run frontend only
- `npm run server` - Run backend only

## 📌 API Endpoints

### Authentication
- `POST /auth/signup` - Register with email/password
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Google OAuth login
- `GET /auth/user` - Get current user
- `POST /auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## 💡 Contributing
Contributions are welcome! If you find a bug or have suggestions for improvement, feel free to open an issue or submit a pull request.

_🚀 Happy Coding!_