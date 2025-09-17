# Notes App Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   - Update `.env` file with your credentials:
   ```
   MONGODB_URI=mongodb://localhost:27017/notesapp
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   SESSION_SECRET=your_random_session_secret_here
   ```

3. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/auth/google/callback`

4. **Start MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env accordingly

5. **Run Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /auth/google` - Google OAuth login
- `GET /auth/user` - Get current user
- `GET /auth/logout` - Logout user
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note