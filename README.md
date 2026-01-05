# UserNotes Management (MERN)

A premium-themed, full-stack MERN application for managing personal notes.

## 🚀 Quick Start

From the root directory:

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Setup Environment**:
   - Open `backend/.env`.
   - Ensure `MONGO_URI` is set correctly.
   - Ensure `JWT_SECRET` is set.

3. **Run Application**:

   ```bash
   npm run dev
   ```

   *Starts backend (5000) and frontend (5173) concurrently.*

## ✨ Features

- **Secure Auth**: Registration and Login with JWT persistence.
- **Full CRUD**: Create, Read, Update, and Delete notes.
- **Search**: Instant filtering of notes by title or content.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.
- **Robust Connection**: Backend explicitly handles database discovery and SSL validation issues.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, Context API, CSS Variables.
- **Backend**: Node.js, Express.
- **Database**: MongoDB Atlas (Mongoose).
- **Security**: Bcrypt.js, JSON Web Tokens.
