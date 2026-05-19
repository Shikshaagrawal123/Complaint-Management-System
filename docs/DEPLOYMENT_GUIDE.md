# 🚀 Deployment Guide — Smart Complaint Management System

## Table of Contents
1. MongoDB Atlas Setup
2. Backend Deployment on Render
3. Frontend Deployment on Render
4. CORS Configuration
5. Common Deployment Errors & Fixes

---

## 1. MongoDB Atlas Setup

### Step 1: Create Account
- Go to https://cloud.mongodb.com
- Sign up for a free account

### Step 2: Create Cluster
- Click "Build a Database"
- Choose "FREE" (M0 Sandbox)
- Select region closest to you
- Click "Create"

### Step 3: Create Database User
- Go to Database Access → Add New Database User
- Choose "Password" authentication
- Set username and a strong password
- Role: "Atlas admin"
- Click "Add User"

### Step 4: Network Access
- Go to Network Access → Add IP Address
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click Confirm

### Step 5: Get Connection String
- Click "Connect" on your cluster
- Choose "Drivers"
- Select Node.js
- Copy connection string:
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<username>` and `<password>`
- Add database name before `?`: `/smart-complaints?`

---

## 2. Backend Deployment on Render

### Step 1: Push to GitHub
```bash
cd smart-complaint-management-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create Web Service on Render
- Go to https://render.com → Sign up/Login
- Click "New" → "Web Service"
- Connect your GitHub account
- Select your repository

### Step 3: Configure Service
| Setting | Value |
|---------|-------|
| Name | smart-complaint-api |
| Region | Singapore (or nearest) |
| Branch | main |
| Root Directory | backend |
| Runtime | Node |
| Build Command | npm install |
| Start Command | node server.js |
| Instance Type | Free |

### Step 4: Add Environment Variables
Click "Advanced" → Add the following:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-complaints
JWT_SECRET=your_very_long_random_secret_key
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=https://your-frontend-url.onrender.com  (update after frontend deploy)
NODE_ENV=production
```

### Step 5: Deploy
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- Your backend URL will be: `https://smart-complaint-api.onrender.com`

Test it: `https://smart-complaint-api.onrender.com` should return:
```json
{ "success": true, "message": "Smart Complaint Management System API is running!" }
```

---

## 3. Frontend Deployment on Render

### Step 1: Update Frontend .env
**BEFORE deploying, change `frontend/.env`:**

```env
# FROM:
VITE_API_URL=http://localhost:5000/api

# TO:
VITE_API_URL=https://smart-complaint-api.onrender.com/api
```

Commit and push this change:
```bash
git add frontend/.env
git commit -m "Update API URL for production"
git push
```

### Step 2: Create Static Site on Render
- Go to Render → "New" → "Static Site"
- Connect same GitHub repository

### Step 3: Configure Static Site
| Setting | Value |
|---------|-------|
| Name | smart-complaint-frontend |
| Branch | main |
| Root Directory | frontend |
| Build Command | npm install && npm run build |
| Publish Directory | dist |

### Step 4: Add Environment Variable
```
VITE_API_URL=https://smart-complaint-api.onrender.com/api
```

### Step 5: Deploy
- Click "Create Static Site"
- Wait 3-5 minutes
- Frontend URL: `https://smart-complaint-frontend.onrender.com`

---

## 4. CORS Configuration After Deployment

Once frontend is deployed:

### Update Backend CLIENT_URL
- Go to Render → Your backend service → Environment
- Update:
  ```
  CLIENT_URL=https://smart-complaint-frontend.onrender.com
  ```
- Click "Save Changes"
- Render will auto-redeploy the backend

---

## 5. Common Deployment Errors & Fixes

### ❌ CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Update `CLIENT_URL` in backend Render env vars to your exact frontend URL.

---

### ❌ MongoDB Connection Failed
```
MongoServerError: bad auth
```
**Fix:** Check MONGODB_URI — ensure username/password is URL-encoded (spaces → %20, @ → %40).

---

### ❌ Frontend shows blank page
**Fix:** Check Render static site "Publish Directory" is set to `dist` (not `build` or `public`).

---

### ❌ API returns 404 on all routes
**Fix:** Ensure "Root Directory" in Render backend is `backend`, not the project root.

---

### ❌ OpenAI API error
```
Error: insufficient_quota
```
**Fix:** Add billing at https://platform.openai.com/account/billing. The system will use rule-based fallback automatically.

---

### ❌ JWT Token errors after re-deploy
**Fix:** Ensure `JWT_SECRET` is the same value in production as it was during initial deployment.

---

## 6. Redeployment

Every time you push to GitHub, Render auto-redeploys both services.

For manual redeploy:
- Render Dashboard → Your service → "Manual Deploy" → "Deploy latest commit"

---

## 7. Live URL Testing

After deployment, test these URLs:

- Backend health: `https://smart-complaint-api.onrender.com`
- Frontend: `https://smart-complaint-frontend.onrender.com`
- Signup API: POST `https://smart-complaint-api.onrender.com/api/auth/signup`

> **Note:** Free Render services spin down after 15 minutes of inactivity. First request after idle may take 30-60 seconds.
