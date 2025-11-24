# Environment Configuration Summary

## Backend URL: `https://ar-viewer.onrender.com`

All configurations have been set up correctly for deployment.

## Frontend Environment Variables

### For Production (Vercel):
Set in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL=https://ar-viewer.onrender.com/api
```

### For Local Development:
The `.env` file in `frontend/` directory is currently set to:
```
VITE_API_URL=https://ar-viewer.onrender.com/api
```

If you want to test locally, change it to:
```
VITE_API_URL=http://localhost:5000/api
```

Or use the `.env.example` file which defaults to localhost for development.

## Backend Environment Variables

### For Production (Render):
Set in Render Dashboard → Environment tab:

```
NODE_ENV=production
BACKEND_URL=https://ar-viewer.onrender.com
FRONTEND_URL=https://your-frontend-url.vercel.app,http://localhost:5173
PORT=(auto-set by Render)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ar_qr_models?retryWrites=true&w=majority
```

**Important**: 
- Replace `https://your-frontend-url.vercel.app` with your actual Vercel frontend URL after deploying.
- Replace `MONGODB_URI` with your MongoDB Atlas connection string (see MONGODB_SETUP.md for details).

### For Local Development:
Create a `.env` file in `backend/` directory:
```
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ar_qr_models?retryWrites=true&w=majority
```

**Note**: See `MONGODB_SETUP.md` for detailed MongoDB Atlas setup instructions.

## Configuration Files

✅ **render.yaml** - Render deployment configuration (in root directory)
✅ **vercel.json** - Vercel deployment configuration (in frontend directory)
✅ **DEPLOYMENT.md** - Complete deployment guide
✅ **Backend CORS** - Configured to handle multiple origins (Vercel + localhost)
✅ **Backend Controller** - Uses `BACKEND_URL` environment variable correctly

## Current Status

- ✅ Backend URL: `https://ar-viewer.onrender.com`
- ✅ Frontend API URL: `https://ar-viewer.onrender.com/api`
- ✅ CORS configured for production and development
- ✅ All environment variables properly referenced in code
- ✅ Deployment configurations ready
- ✅ MongoDB Atlas integration for QR code storage and matching
- ✅ WebXR/AR.js technology for perfect AR experience

## Quick Verification

1. **Backend Health Check**: `https://ar-viewer.onrender.com/api/health`
2. **Frontend API calls**: Will use `https://ar-viewer.onrender.com/api`
3. **Local development**: Uses `.env` files (can be overridden)

