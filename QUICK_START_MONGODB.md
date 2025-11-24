# Quick Start: MongoDB Integration

## 🚀 Quick Setup (5 minutes)

### Step 1: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. Create a free M0 cluster
3. Create a database user (save username/password)
4. Add IP address: `0.0.0.0/0` (allow from anywhere) or your current IP
5. Get connection string: Click "Connect" → "Connect your application" → Copy connection string

### Step 2: Configure Environment
Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ar_qr_models?retryWrites=true&w=majority
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Install & Run
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Step 4: Test
1. Upload a 3D model (.glb or .gltf)
2. Get QR code
3. Scan QR code
4. Model should load in AR viewer with WebXR

## ✅ What's Working Now

- ✅ **Database Storage**: All models saved to MongoDB
- ✅ **QR Code Matching**: Scanned QR codes matched with database
- ✅ **WebXR AR**: Perfect AR experience with plane detection
- ✅ **Access Tracking**: Track model views
- ✅ **Error Handling**: Graceful fallbacks

## 📚 Full Documentation

- **MongoDB Setup**: See `MONGODB_SETUP.md` for detailed instructions
- **Integration Details**: See `MONGODB_INTEGRATION_SUMMARY.md`
- **Environment Config**: See `ENV_CONFIGURATION.md`

## 🎯 Key Endpoints

- `POST /api/models/upload` - Upload model (saves to DB)
- `POST /api/models/match-qr` - Match QR code
- `GET /api/models` - List all models
- `GET /api/models/:id` - Get specific model

## 🔧 Troubleshooting

**Can't connect to MongoDB?**
- Check connection string format
- Verify IP is whitelisted
- Check username/password

**QR code not matching?**
- Ensure model was uploaded after MongoDB setup
- Check database has records: `GET /api/models`

**AR not working?**
- Requires HTTPS (use ngrok for local testing)
- Use Chrome/Edge browser (WebXR support)
- Check browser console for errors

## 🎉 You're Ready!

Your AR QR scanner now has:
- ✅ MongoDB database storage
- ✅ QR code matching
- ✅ WebXR AR technology
- ✅ Perfect plane detection

Start uploading models and scanning QR codes!

