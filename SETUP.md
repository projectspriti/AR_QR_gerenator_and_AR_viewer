# Quick Setup Guide

## Step 1: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
Create a file named `.env` in the `backend` directory with the following content:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

4. Ensure uploads directory exists:
The `backend/uploads` directory should already exist. If not, create it:
```bash
mkdir uploads
```

5. Start the backend:
```bash
npm start
```

## Step 2: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
Create a file named `.env` in the `frontend` directory with:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm run dev
```

## Step 3: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Click "Upload Model"
3. Upload a .glb or .gltf file
4. Download or scan the generated QR code
5. Scan the QR code with your phone to view in AR

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Errors
Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL.

### Camera Not Working
- Use HTTPS in production
- Grant camera permissions in browser settings
- Test on a mobile device for best results

