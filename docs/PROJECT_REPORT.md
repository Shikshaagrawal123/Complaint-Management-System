# AI-Based Smart Complaint Management System
## Technical Documentation Report

**Subject:** Web Technology / Full Stack Development  
**Title:** AI-Based Smart Complaint Management System  
**Tech Stack:** MERN + OpenAI API  

---

## 1. Introduction

The AI-Based Smart Complaint Management System is a full-stack web application that enables citizens to register, track, and receive AI-powered analysis on municipal complaints. The system bridges the gap between citizens and government departments by intelligently routing complaints to the appropriate authority using OpenAI's GPT API.

---

## 2. Objectives

- Enable citizens to register complaints online without visiting government offices
- Provide real-time status tracking of complaints
- Use AI to determine complaint priority (High/Medium/Low)
- Auto-route complaints to the correct municipal department
- Generate citizen-friendly AI responses automatically
- Provide a secure, authenticated platform for complaint management

---

## 3. Features

| Feature | Description |
|---------|-------------|
| User Authentication | JWT-based signup and login |
| Complaint Registration | Form with validation for all fields |
| Complaint Tracking | Real-time status updates |
| AI Analysis | Priority, department, summary, auto-response |
| Search by Location | Find complaints by area |
| Filter by Category | Filter by Water, Electricity, etc. |
| Protected Routes | Auth-guarded pages |
| Responsive Design | Mobile-friendly interface |
| CRUD Operations | Full create/read/update/delete |
| Pagination | Server-side paginated results |

---

## 4. Modules

### 4.1 Authentication Module
- User registration with validation
- Secure login with bcrypt password verification
- JWT token generation and verification
- Protected route middleware

### 4.2 Complaint Management Module
- Complaint registration form (all required fields)
- Complaint list view with search and filter
- Complaint detail view
- Status update (Pending → In Progress → Resolved/Rejected)
- Delete complaint

### 4.3 AI Analysis Module
- OpenAI GPT-3.5-turbo integration
- Priority detection: High / Medium / Low
- Department routing: Water, Electricity, Sanitation, PWD, etc.
- Complaint summary generation
- Auto-generated citizen response
- Rule-based fallback analyzer

### 4.4 Search & Filter Module
- Search complaints by location (regex-based)
- Filter by category
- Filter by status
- Combined search + filter

---

## 5. Folder Structure

```
smart-complaint-management-system/
├── frontend/src/
│   ├── components/          # Reusable UI components
│   ├── context/             # AuthContext (Context API)
│   ├── pages/               # Route pages
│   └── utils/api.js         # Centralized Axios
├── backend/
│   ├── controllers/         # Business logic
│   ├── routes/              # Express routes
│   ├── middleware/           # Auth, validation, error
│   ├── models/              # Mongoose schemas
│   └── config/db.js         # MongoDB connection
```

---

## 6. Technology Stack

### Frontend
- **React 18** — Component-based UI library
- **Vite** — Fast development server
- **Tailwind CSS** — Utility-first CSS framework
- **Axios** — HTTP client with interceptors
- **React Router DOM v6** — Client-side routing
- **React Hot Toast** — Notification system
- **Context API** — Global state management

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB Atlas** — Cloud database
- **Mongoose** — ODM for MongoDB
- **JWT (jsonwebtoken)** — Token-based auth
- **bcryptjs** — Password hashing
- **express-validator** — Input validation
- **cors** — Cross-Origin Resource Sharing
- **dotenv** — Environment variables

### AI Integration
- **OpenAI API** — GPT-3.5-turbo model
- Complaint priority detection
- Department recommendation
- Auto-response generation

---

## 7. MongoDB Schema

### User Schema
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // bcrypt hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Schema
```javascript
{
  user: { type: ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true, minlength: 5 },
  description: { type: String, required: true, minlength: 10 },
  category: { type: String, enum: ['Water','Electricity','Garbage','Roads','Sanitation','Noise','Other'] },
  location: { type: String, required: true },
  status: { type: String, enum: ['Pending','In Progress','Resolved','Rejected'], default: 'Pending' },
  aiAnalysis: {
    priority: String,
    department: String,
    summary: String,
    userResponse: String,
    analyzedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 8. API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Protected |

### Complaints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/complaints | Protected |
| GET | /api/complaints | Protected |
| GET | /api/complaints/:id | Protected |
| PUT | /api/complaints/:id | Protected |
| DELETE | /api/complaints/:id | Protected |
| GET | /api/complaints/search?location= | Protected |

### AI
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/ai/analyze | Protected |
| POST | /api/ai/quick-analyze | Protected |

---

## 9. AI Integration Flow

```
User submits complaint
        ↓
POST /api/ai/analyze { complaintId }
        ↓
Backend fetches complaint from MongoDB
        ↓
OpenAI GPT-3.5-turbo API call
  - Input: title, description, category, location
  - Prompt: Analyze and return JSON
        ↓
Response:
  - priority: High / Medium / Low
  - department: Water Department / Electricity Dept / etc.
  - summary: 1-2 sentence summary
  - userResponse: auto-generated citizen reply
        ↓
Save aiAnalysis to MongoDB
        ↓
Return to frontend
        ↓
Display in Complaint Detail page
```

**AI Rules:**
- Water leakage → Water Department, High priority
- Electricity issue → Electricity Department, High priority
- Garbage → Sanitation Department, Medium priority
- Road damage → PWD, Medium priority
- Noise → Municipal Corporation, Low priority

---

## 10. Authentication Flow

```
1. User submits login form
2. POST /api/auth/login → Backend validates credentials
3. bcrypt.compare(plainPassword, hashedPassword)
4. If valid: generate JWT token (expires in 7 days)
5. Return token to frontend
6. Frontend stores in localStorage
7. Axios interceptor attaches to every request:
   Authorization: Bearer <token>
8. Protected routes check token via authMiddleware
9. Logout: clear localStorage, redirect to /login
```

---

## 11. Security Implementation

- **Passwords:** bcrypt with salt rounds = 10
- **Tokens:** JWT signed with secret, 7-day expiry
- **Validation:** express-validator on all inputs
- **CORS:** Restricted to CLIENT_URL only
- **Env vars:** All secrets in .env (never committed)
- **Error handling:** Centralized, no stack traces in production

---

## 12. Screenshots Placeholders

> *(Add the following screenshots to your submission)*

1. **Login Page** — Screenshot of login form
2. **Signup Page** — Screenshot of registration form
3. **Dashboard** — Stats cards + recent complaints
4. **Complaint Form** — Complaint submission form
5. **Complaint List** — List with search/filter bar
6. **Complaint Detail** — Full complaint view
7. **AI Analysis Result** — Priority, department, response shown
8. **Status Update** — Edit page with status buttons
9. **Postman - Signup** — Request + Response screenshot
10. **Postman - Login** — Token in response
11. **Postman - Create Complaint** — POST request
12. **Postman - AI Analyze** — AI response JSON
13. **MongoDB Atlas** — Database with collections
14. **MongoDB - Users Collection** — User documents
15. **MongoDB - Complaints Collection** — Complaint documents with aiAnalysis
16. **Render Backend** — Deployed service dashboard
17. **Render Frontend** — Static site deployed
18. **Live URL** — Frontend running in production
19. **Live API Test** — Backend health check URL in browser

---

## 13. Conclusion

The AI-Based Smart Complaint Management System successfully demonstrates:

- Full-stack MERN development with clean architecture
- JWT authentication with bcrypt security
- RESTful API design with proper HTTP methods and status codes
- AI integration using OpenAI GPT-3.5-turbo for intelligent complaint processing
- Responsive React UI with Tailwind CSS
- MongoDB Atlas cloud database integration
- Render cloud deployment for both frontend and backend
- Environment-based configuration for multiple deployment targets

The system provides a production-ready foundation for real-world municipal complaint management with AI-powered intelligence.

---

*Submitted for End Semester Examination (ESE)*  
*Subject: Web Technology / Full Stack Development*
