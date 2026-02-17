# How to run the app

Open **two terminal windows** and run the following.

## Terminal 1 — Backend

```bash
cd backend
npm run start:dev
```

Wait until you see: **"Application is running on: http://localhost:3000"**

(If you see "Unable to connect to the database", the backend may still listen on 3000 after retries, or use local MongoDB — see below.)

## Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

When Vite is ready, open in your browser: **http://localhost:5173**

---

## If the backend never connects to MongoDB Atlas

- **Option A:** Use **local MongoDB** so the backend can start:
  1. Install and start MongoDB (e.g. `brew install mongodb-community` then `brew services start mongodb-community`).
  2. In `backend/.env` set:  
     `MONGODB_URI=mongodb://localhost:27017/team_management`
  3. Restart the backend.

- **Option B:** Fix Atlas access (correct password in `.env`, Network Access in Atlas, internet working), then restart the backend.
