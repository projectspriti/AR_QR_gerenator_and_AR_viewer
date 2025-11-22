# Deployment Checklist - AR Viewer Application

## ✅ Configuration Status

All configurations are now properly set up for deployment to Render (backend) and Vercel (frontend).

## Backend URL: `https://ar-viewer.onrender.com`

---

## ✅ Frontend Configuration

### Environment Variables

#### `.env` file (Production)
```env
VITE_API_URL=https://ar-viewer.onrender.com/api
```

#### `.env.example` file (Template)
```env
VITE_API_URL=https://ar-viewer.onrender.com/api
```

### Files Using Environment Variable

1. ✅ **`frontend/src/api/api.js`**
   - Uses: `import.meta.env.VITE_API_URL`
   - Fallback: `https://ar-viewer.onrender.com/api`
   - Purpose: API base URL for all API calls

2. ✅ **`frontend/src/pages/ARViewerLoader.jsx`**
   - Uses: `import.meta.env.VITE_API_URL`
   - Fallback: `https://ar-viewer.onrender.com/api`
   - Purpose: Extracts base URL (without /api) for AR viewer redirects

3. ✅ **`frontend/src/pages/UploadModel.jsx`**
   - Uses: `api` from `../api/api.js` (which uses VITE_API_URL)
   - Purpose: Uploads models via API

### Vercel Configuration

- ✅ **`frontend/vercel.json`** - Vercel deployment configuration
- ✅ **Root Directory**: Set to `frontend` in Vercel dashboard
- ✅ **Framework**: Vite (auto-detected)

---

## ✅ Backend Configuration

### Environment Variables (Render)

```env
NODE_ENV=production
BACKEND_URL=https://ar-viewer.onrender.com
FRONTEND_URL=https://your-vercel-url.vercel.app,http://localhost:5173
PORT=(auto-set by Render)
```

### Files Configured

1. ✅ **`backend/server.js`**
   - CORS configured for multiple origins
   - Handles production and development environments
   - Uses `FRONTEND_URL` environment variable

2. ✅ **`backend/src/controllers/model.controller.js`**
   - Uses `BACKEND_URL` environment variable
   - Falls back to request protocol/host if not set

### Render Configuration

- ✅ **`render.yaml`** - Render deployment configuration
- ✅ **Health Check**: `/api/health`
- ✅ **Persistent Disk**: Configured for uploads

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render

1. ✅ Connect repository to Render
2. ✅ Configure using `render.yaml` or manually:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check: `/api/health`
3. ✅ Set environment variables in Render dashboard
4. ✅ Create persistent disk for uploads
5. ✅ Deploy

**Backend URL**: `https://ar-viewer.onrender.com` ✅

---

### Step 2: Deploy Frontend to Vercel

1. ✅ Connect repository to Vercel
2. ✅ Configure project:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework: Vite
3. ✅ **Set Environment Variable in Vercel Dashboard**:
   ```
   VITE_API_URL = https://ar-viewer.onrender.com/api
   ```
   - Set for: Production, Preview, Development
4. ✅ Deploy

**Frontend URL**: `https://arviewer-five.vercel.app`

---

### Step 3: Update Backend CORS

After getting your Vercel frontend URL:

1. ✅ Go to Render Dashboard → Your Backend Service → Environment
2. ✅ Update `FRONTEND_URL` to:
   ```
   https://arviewer-five.vercel.app,http://localhost:5173
   ```
3. ✅ Save and restart service

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend health check: `https://ar-viewer.onrender.com/api/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Frontend connects to backend API
- [ ] Upload 3D model works
- [ ] QR code generation works
- [ ] QR code scanning works
- [ ] AR viewer loads correctly
- [ ] No CORS errors in browser console
- [ ] No 404 errors on routes

---

## 🔍 How Environment Variables Work

### Frontend (Vite)

1. **Environment Variable**: `VITE_API_URL`
   - Must start with `VITE_` to be exposed to client-side code
   - Set in Vercel dashboard

2. **Usage in Code**:
   ```javascript
   import.meta.env.VITE_API_URL
   ```

3. **Files Using It**:
   - `src/api/api.js` - For API calls
   - `src/pages/ARViewerLoader.jsx` - For AR viewer redirects

### Backend (Node.js)

1. **Environment Variables**:
   - `BACKEND_URL` - For generating URLs in responses
   - `FRONTEND_URL` - For CORS configuration
   - `NODE_ENV` - Environment mode

2. **Usage in Code**:
   ```javascript
   process.env.BACKEND_URL
   process.env.FRONTEND_URL
   ```

3. **Files Using Them**:
   - `server.js` - CORS configuration
   - `src/controllers/model.controller.js` - URL generation

---

## 📝 Important Notes

1. **Environment Variables in Vercel**:
   - Must be set in Vercel dashboard
   - Not read from `.env` file in production
   - `.env` file is for local development only

2. **VITE_ Prefix**:
   - Only variables starting with `VITE_` are exposed to client-side
   - This is a Vite requirement for security

3. **CORS Configuration**:
   - Backend allows multiple origins (Vercel + localhost)
   - Set `FRONTEND_URL` as comma-separated list

4. **URL Construction**:
   - `VITE_API_URL` includes `/api` suffix
   - Base URL is extracted by removing `/api` when needed

---

## 🚨 Troubleshooting

### Frontend can't connect to backend

- ✅ Check `VITE_API_URL` is set in Vercel dashboard
- ✅ Verify backend is running: `https://ar-viewer.onrender.com/api/health`
- ✅ Check CORS configuration in Render

### Build fails

- ✅ Verify Root Directory is `frontend`
- ✅ Check `package.json` exists
- ✅ Review build logs

### Environment variable not working

- ✅ Variable must start with `VITE_`
- ✅ Redeploy after adding variable
- ✅ Clear browser cache

---

## ✅ All Files Updated

- ✅ `frontend/.env` - Production URL
- ✅ `frontend/.env.example` - Template with production URL
- ✅ `frontend/src/api/api.js` - Uses VITE_API_URL with production fallback
- ✅ `frontend/src/pages/ARViewerLoader.jsx` - Uses VITE_API_URL with production fallback
- ✅ `backend/server.js` - CORS configured for multiple origins
- ✅ `backend/src/controllers/model.controller.js` - Uses BACKEND_URL env var
- ✅ `render.yaml` - Render deployment config
- ✅ `vercel.json` - Vercel deployment config

---

**Everything is ready for deployment!** 🚀

