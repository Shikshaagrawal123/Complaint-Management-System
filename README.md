# 🏛️ AI-Based Smart Complaint Management System

A full-stack MERN application that enables citizens to submit, track, and get AI-powered analysis on municipal complaints.

---

## 🚀 Features

- **User Authentication** — JWT-based signup/login with bcrypt password hashing
- **Complaint CRUD** — Create, read, update, delete complaints
- **AI Analysis** — OpenAI-powered priority detection, department routing, summary & auto-response
- **Search & Filter** — Search by location, filter by category and status
- **Protected Routes** — Auth-guarded pages using React Context API
- **Responsive UI** — Tailwind CSS with mobile-first design
- **Pagination** — Backend-paginated complaint list
- **Toast Notifications** — Real-time success/error feedback

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS      |
| State      | Context API, useState, useEffect  |
| HTTP       | Axios (centralized instance)      |
| Routing    | React Router DOM v6               |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas + Mongoose          |
| Auth       | JWT + bcryptjs                    |
| Validation | express-validator                 |
| AI         | OpenAI GPT-3.5-turbo API          |

---

## 📁 Folder Structure

```
smart-complaint-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ComplaintFormPage.jsx
│   │   │   ├── ComplaintListPage.jsx
│   │   │   ├── ComplaintDetailPage.jsx
│   │   │   ├── ComplaintEditPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── utils/
│   │   │   └── api.js         # Axios instance (VITE_API_URL)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── aiRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── docs/
├── README.md
└── .gitignore
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-complaint-management-system.git
cd smart-complaint-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/smart-complaints
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🗄️ MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user (username + password)
4. Whitelist your IP (or allow all: `0.0.0.0/0`)
5. Click **Connect → Drivers** and copy the connection string
6. Paste into `backend/.env` as `MONGODB_URI`

---

## 🤖 OpenAI Setup

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Create an account and add billing
3. Go to API Keys → Create new key
4. Paste into `backend/.env` as `OPENAI_API_KEY`

> **Note:** The system includes a rule-based fallback analyzer if OpenAI is unavailable.

---

## 📮 API Endpoints

### Auth APIs

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/signup` | Register user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/profile` | Get profile | Yes |

### Complaint APIs

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/complaints` | Submit complaint | Yes |
| GET | `/api/complaints` | Get all complaints | Yes |
| GET | `/api/complaints/:id` | Get single complaint | Yes |
| PUT | `/api/complaints/:id` | Update complaint | Yes |
| DELETE | `/api/complaints/:id` | Delete complaint | Yes |
| GET | `/api/complaints/search?location=X` | Search by location | Yes |

### AI APIs

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/ai/analyze` | AI analyze complaint | Yes |
| POST | `/api/ai/quick-analyze` | Quick rule-based analyze | Yes |

---

## 📮 Postman Testing Guide

### Step 1: Start Backend

```bash
cd backend && npm run dev
```

### Step 2: Signup

- **POST** `http://localhost:5000/api/auth/signup`
- Body (JSON):
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123"
}
```

### Step 3: Login and copy token

- **POST** `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```
- Copy the `token` from response

### Step 4: Set Bearer Token

In Postman → **Authorization** tab → Type: **Bearer Token** → paste token

### Step 5: Submit Complaint

- **POST** `http://localhost:5000/api/complaints`
- Authorization: Bearer Token
- Body:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "title": "Water pipe burst on main road",
  "description": "There is a major water pipe burst near Sector 5 main road. Water is flowing on the road and causing traffic issues. This is very urgent.",
  "category": "Water",
  "location": "Ghaziabad"
}
```

### Step 6: AI Analyze

- **POST** `http://localhost:5000/api/ai/analyze`
- Authorization: Bearer Token
- Body:
```json
{
  "complaintId": "PASTE_COMPLAINT_ID_HERE"
}
```

---

## 🚀 Deployment (Render)

### Backend Deployment

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables (same as `.env`)
6. Set `CLIENT_URL` to your Render frontend URL

### Frontend Deployment

1. Go to [render.com](https://render.com) → New Static Site
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`

### ⚠️ CORS Update Before Deployment

In Render backend, update:
```
CLIENT_URL=https://your-frontend-url.onrender.com
```

---

## 🐙 GitHub Commands

```bash
git init
git add .
git commit -m "Initial commit: AI-Based Smart Complaint Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-complaint-management-system.git
git push -u origin main
```

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection fails | Check MONGODB_URI, whitelist IP in Atlas |
| CORS error | Check CLIENT_URL in backend .env |
| JWT token invalid | Ensure JWT_SECRET is set |
| OpenAI quota exceeded | Check billing on platform.openai.com |
| Frontend can't reach backend | Verify VITE_API_URL in frontend .env |

---

## 🔮 Future Enhancements

- Real-time notifications with Socket.io
- Admin panel with bulk status updates
- Email notifications via Nodemailer
- File/image attachment support
- Analytics dashboard with charts
- Mobile app with React Native
