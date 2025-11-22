# Quick Update: Frontend Vercel URL

## ✅ Updated Configuration

Your frontend Vercel URL: **https://arviewer-five.vercel.app**

## ✅ Files Updated

1. **`backend/.env.example`**
   - Updated `FRONTEND_URL` to include your Vercel URL
   - Value: `https://arviewer-five.vercel.app,http://localhost:5173`

2. **`render.yaml`**
   - Updated `FRONTEND_URL` environment variable
   - Value: `https://arviewer-five.vercel.app,http://localhost:5173`

3. **Documentation Files Updated**
   - `DEPLOYMENT.md` - Updated with your Vercel URL
   - `VERCEL_DEPLOYMENT.md` - Updated with your Vercel URL
   - `DEPLOYMENT_CHECKLIST.md` - Updated with your Vercel URL

## ⚠️ IMPORTANT: Update Render Dashboard

You need to update the `FRONTEND_URL` environment variable in your **Render Dashboard**:

### Steps:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `ar-viewer-backend`
3. Go to **"Environment"** tab
4. Find the `FRONTEND_URL` variable
5. Update it to:
   ```
   https://arviewer-five.vercel.app,http://localhost:5173
   ```
6. Click **"Save Changes"**
7. Your backend will automatically restart

## ✅ Verification

After updating Render:

1. **Test CORS**:
   - Visit: `https://arviewer-five.vercel.app`
   - Open browser console (F12)
   - Try uploading a 3D model
   - Should work without CORS errors

2. **Test Backend**:
   - Visit: `https://ar-viewer.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

3. **Test Frontend**:
   - Visit: `https://arviewer-five.vercel.app`
   - Should load successfully

## 📝 Environment Variables Summary

### Backend (Render Dashboard):
```
NODE_ENV=production
BACKEND_URL=https://ar-viewer.onrender.com
FRONTEND_URL=https://arviewer-five.vercel.app,http://localhost:5173
PORT=(auto-set)
```

### Frontend (Vercel Dashboard):
```
VITE_API_URL=https://ar-viewer.onrender.com/api
```

## ✅ Current URLs

- **Backend API**: `https://ar-viewer.onrender.com/api`
- **Frontend**: `https://arviewer-five.vercel.app`
- **Health Check**: `https://ar-viewer.onrender.com/api/health`

---

**Next Step**: Update `FRONTEND_URL` in Render Dashboard and restart your backend service!

