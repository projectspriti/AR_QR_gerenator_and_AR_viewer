# Deploy Frontend to Vercel - Step by Step Guide

This guide will walk you through deploying your frontend to Vercel with the correct backend API URL configuration.

## Prerequisites

1. ✅ GitHub account
2. ✅ Code pushed to GitHub repository
3. ✅ Vercel account (free tier available)
4. ✅ Backend already deployed on Render at `https://ar-viewer.onrender.com`

## Step-by-Step Deployment

### Step 1: Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** button (top right)
3. Select **"Project"**
4. Click **"Import Git Repository"**
5. Connect your GitHub account if not already connected
6. Select your repository: `AR_qr_scan` (or your repository name)
7. Click **"Import"**

### Step 2: Configure Project Settings

In the project configuration page:

1. **Framework Preset**: Select **"Vite"** (Vercel should auto-detect it)

2. **Root Directory**: 
   - Click **"Override"** next to Root Directory
   - Enter: `frontend`
   - This tells Vercel to look in the `frontend` folder

3. **Build Command**: 
   - Should auto-fill as: `npm run build`
   - If not, enter: `npm run build`

4. **Output Directory**: 
   - Should auto-fill as: `dist`
   - If not, enter: `dist`

5. **Install Command**: 
   - Should be: `npm install`
   - This is usually auto-detected

6. **Node.js Version**: 
   - Select **18.x** or **20.x** (latest LTS)

### Step 3: Configure Environment Variables (IMPORTANT!)

**This is the most critical step!**

1. In the project configuration page, scroll down to **"Environment Variables"** section

2. Click **"Add"** to add a new environment variable

3. Add the following variable:

   **Variable Name**: `VITE_API_URL`
   
   **Value**: `https://ar-viewer.onrender.com/api`
   
   **Environment**: Select all three:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development

4. Click **"Add"** to save

5. **VERIFY** the variable is added correctly:
   ```
   VITE_API_URL = https://ar-viewer.onrender.com/api
   ```

### Step 4: Deploy

1. Review all settings to make sure:
   - ✅ Root Directory: `frontend`
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `dist`
   - ✅ Environment Variable `VITE_API_URL` is set

2. Click **"Deploy"** button

3. Wait for the build to complete (usually 1-3 minutes)

4. Once deployed, you'll see a success message with your frontend URL

### Step 5: Update Backend CORS Settings

After you get your Vercel frontend URL:

1. Go to your **Render Dashboard**
2. Select your backend service: `ar-viewer-backend`
3. Go to **"Environment"** tab
4. Find the `FRONTEND_URL` variable
5. Update it to include your Vercel URL:
   ```
   https://arviewer-five.vercel.app,http://localhost:5173
   ```
6. Click **"Save Changes"**
7. Your backend will automatically redeploy

### Step 6: Verify Deployment

1. **Test Frontend**:
   - Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Should load the homepage

2. **Test API Connection**:
   - Try uploading a 3D model
   - Check browser console (F12) for any errors
   - Should successfully connect to `https://ar-viewer.onrender.com/api`

3. **Test Health Check**:
   - Visit: `https://ar-viewer.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

## Environment Variables Summary

### In Vercel Dashboard:

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_API_URL` | `https://ar-viewer.onrender.com/api` | Production, Preview, Development |

### In Render Dashboard (Backend):

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `BACKEND_URL` | `https://ar-viewer.onrender.com` |
| `FRONTEND_URL` | `https://your-vercel-url.vercel.app,http://localhost:5173` |
| `PORT` | (auto-set) |

## Troubleshooting

### Issue: Frontend can't connect to backend

**Solution**: 
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify the backend is running: `https://ar-viewer.onrender.com/api/health`
- Check browser console for CORS errors
- Make sure `FRONTEND_URL` in Render includes your Vercel URL

### Issue: Build fails

**Solution**:
- Verify Root Directory is set to `frontend`
- Check that `package.json` exists in `frontend/` directory
- Review build logs in Vercel dashboard for specific errors

### Issue: 404 errors on routes

**Solution**:
- Verify `vercel.json` exists in `frontend/` directory
- Check that rewrites are configured correctly

### Issue: Environment variable not working

**Solution**:
- Remember: Vite requires `VITE_` prefix for client-side variables
- After adding env vars, redeploy the project
- Clear browser cache and hard refresh (Ctrl+Shift+R)

## Quick Reference

### Your URLs:
- **Backend API**: `https://ar-viewer.onrender.com/api`
- **Frontend**: `https://arviewer-five.vercel.app`
- **Health Check**: `https://ar-viewer.onrender.com/api/health`

### Important Files:
- ✅ `frontend/.env` - Contains production URL
- ✅ `frontend/.env.example` - Template file
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ `frontend/src/api/api.js` - Uses `VITE_API_URL`
- ✅ `frontend/src/pages/ARViewerLoader.jsx` - Uses backend URL

### After Deployment:

1. ✅ Frontend is live on Vercel
2. ✅ Backend API is accessible
3. ✅ CORS is configured
4. ✅ All API calls use production URL
5. ✅ QR codes will work correctly

## Next Steps

After successful deployment:

1. Test the complete flow:
   - Upload a 3D model
   - Generate QR code
   - Scan QR code with phone
   - View in AR

2. Set up custom domain (optional):
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

3. Monitor your deployments:
   - Check Vercel analytics
   - Monitor Render logs
   - Set up error tracking if needed

---

**Need Help?** Check the main `DEPLOYMENT.md` file for more details.

