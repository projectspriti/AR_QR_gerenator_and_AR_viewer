# Deployment Guide

This guide will help you deploy the AR Viewer application to Render (backend) and Vercel (frontend).

## Backend Deployment on Render

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)

### Steps

1. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Web Service**
   - **Name**: `ar-viewer-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

3. **Set Environment Variables in Render Dashboard**
   
   Go to your service → Environment tab and add:
   
   ```
   NODE_ENV=production
   BACKEND_URL=https://ar-viewer.onrender.com
   FRONTEND_URL=https://your-frontend-url.vercel.app,http://localhost:5173
   ```
   
   **Important**: Replace `https://your-frontend-url.vercel.app` with your actual Vercel frontend URL after deploying the frontend.

4. **Configure Persistent Disk (for file uploads)**
   - Go to "Disks" section
   - Create a new disk named `uploads`
   - Mount path: `/opt/render/project/src/uploads`
   - Size: 1GB (minimum)

5. **Health Check**
   - Health Check Path: `/api/health`

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend will be available at: `https://ar-viewer.onrender.com`

## Frontend Deployment on Vercel

### Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)

### Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (use "Override" option)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables in Vercel Dashboard**
   
   Go to your project → Settings → Environment Variables and add:
   
   ```
   VITE_API_URL=https://ar-viewer.onrender.com/api
   ```
   
   **Important**: Make sure to add this for all environments:
   - Production
   - Preview
   - Development

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be available at your Vercel URL

5. **Update Backend CORS**
   - After getting your Vercel frontend URL, go back to Render dashboard
   - Update the `FRONTEND_URL` environment variable:
     ```
     FRONTEND_URL=https://your-frontend-url.vercel.app,http://localhost:5173
     ```
   - Restart the backend service

## Environment Variables Summary

### Backend (Render)
| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `BACKEND_URL` | `https://ar-viewer.onrender.com` | Your Render backend URL |
| `FRONTEND_URL` | `https://your-frontend.vercel.app,http://localhost:5173` | Comma-separated frontend URLs for CORS |
| `PORT` | (auto) | Port (automatically set by Render) |

### Frontend (Vercel)
| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://ar-viewer.onrender.com/api` | Backend API URL |

## Local Development Setup

### Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Update values if needed:
   ```
   PORT=5000
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
3. Run `npm install` in `backend/` directory
4. Run `npm start` or `npm run dev`

### Frontend
1. Copy `frontend/.env.example` to `frontend/.env`
2. Update values if needed:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run `npm install` in `frontend/` directory
4. Run `npm run dev`

## Important Notes

1. **File Storage**: On Render's free tier, uploaded files are stored on a persistent disk. However, files may be lost if the disk is deleted. Consider upgrading or using cloud storage (AWS S3, Cloudinary) for production.

2. **CORS Configuration**: Make sure your `FRONTEND_URL` in Render includes both your Vercel URL and localhost for development.

3. **HTTPS**: Both Render and Vercel provide HTTPS by default, which is required for WebXR/AR features.

4. **Cold Starts**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down may be slower.

5. **API Base URL**: The frontend uses `VITE_` prefix for environment variables because Vite requires this prefix to expose variables to the client-side code.

## Troubleshooting

### Backend Issues
- **CORS Errors**: Check that `FRONTEND_URL` includes your Vercel frontend URL
- **File Upload Fails**: Verify disk is mounted correctly in Render dashboard
- **Health Check Fails**: Ensure `/api/health` route is accessible

### Frontend Issues
- **API Calls Fail**: Verify `VITE_API_URL` is set correctly in Vercel environment variables
- **Build Fails**: Check that all dependencies are in `package.json`
- **404 on Routes**: Verify `vercel.json` rewrite rules are configured correctly

## Verification

After deployment:

1. **Test Backend**: 
   - Visit: `https://ar-viewer.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try uploading a 3D model
   - Scan the QR code to test AR functionality

3. **Test Integration**:
   - Upload a model from the frontend
   - Verify the QR code is generated
   - Scan QR code to open AR view

