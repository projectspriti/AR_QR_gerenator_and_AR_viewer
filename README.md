# 3D Model AR Viewer with QR Code Generation and Scanner

A full-stack application that allows users to upload 3D models (.glb/.gltf), generate QR codes, and view them in Augmented Reality using WebXR.

## ⚠️ IMPORTANT: AR Plane Detection Requirements

**Plane detection (surface tracking) requires HTTPS connection.** This is a browser security requirement for WebXR. Without HTTPS, plane detection will not work.

- **For local testing:** Use ngrok or similar tool to create HTTPS tunnel
- **For production:** Deploy with SSL certificate
- **See:** `QUICK_START_AR.md` and `AR_TROUBLESHOOTING.md` for setup guides

## 🚀 Features

- **3D Model Upload**: Upload .glb or .gltf files (up to 50MB)
- **QR Code Generation**: Automatically generates QR codes linking to AR viewer
- **QR Code Scanner**: Built-in QR scanner to open AR experiences
- **AR Viewing**: WebXR-based AR viewer with surface tracking
- **Mobile Support**: Optimized for mobile devices with camera access
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser with WebXR support (Chrome/Edge on Android, Safari on iOS 12+)

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (or use the provided template):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
ar-3d-model-qr-project/
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env                    # Environment variables
│   ├── uploads/               # Uploaded .glb files
│   └── src/
│       ├── config/
│       │   └── storage.js      # Multer configuration
│       ├── routes/
│       │   └── model.routes.js # Upload API route
│       ├── controllers/
│       │   └── model.controller.js # Core upload + QR logic
│       ├── utils/
│       │   └── qrGenerator.js  # QR code generator
│       ├── public/
│       │   └── ar-view.html    # AR viewing page
│       └── middlewares/
│           └── errorHandler.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   └── api.js           # Axios instance
        ├── components/
        │   ├── QRScanner.jsx    # Component for scanning QR code
        │   └── QRCodeViewer.jsx # Showing QR returned from backend
        ├── pages/
        │   ├── UploadModel.jsx  # Upload .glb page with preview
        │   ├── GenerateQR.jsx   # Display generated QR code
        │   ├── ARViewerLoader.jsx # Opens ar-view page with model param
        │   └── Home.jsx         # Home page
        ├── utils/
        │   └── qrScannerConfig.js # QR scanning utilities
        └── routes/
            └── AppRoutes.jsx    # All frontend route definitions
```

## 🎯 Usage

### Uploading a 3D Model

1. Open the application in your browser
2. Click "Upload Model" or navigate to `/upload`
3. Select a .glb or .gltf file
4. Click "Upload & Generate QR Code"
5. The QR code will be displayed with options to:
   - Download the QR code image
   - Open the AR viewer directly

### Scanning a QR Code

1. Click "Scan QR Code" on the home page
2. Allow camera permissions when prompted
3. Point your camera at the QR code
4. The AR viewer will automatically open

### Viewing in AR

1. Open the AR viewer (via QR code or direct link)
2. Allow camera access when prompted
3. Point your device at a flat surface (table, floor, etc.)
4. Wait for surface detection
5. Tap on the detected surface to place the 3D model
6. Move around to view from different angles

## 🔧 API Endpoints

### POST `/api/models/upload`
Upload a 3D model file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `model` (file)

**Response:**
```json
{
  "success": true,
  "model": {
    "filename": "model.glb",
    "url": "http://localhost:5000/uploads/model-1234567890.glb",
    "size": 1024000,
    "mimetype": "model/gltf-binary"
  },
  "arViewUrl": "http://localhost:5000/ar-view/ar-view.html?model=...",
  "qrCode": {
    "imageUrl": "http://localhost:5000/uploads/model-1234567890-qr.png",
    "dataUrl": "data:image/png;base64,..."
  }
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎨 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Multer** - File upload handling
- **qrcode** - QR code generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Axios** - HTTP client
- **html5-qrcode** - QR code scanning
- **Tailwind CSS** - Styling
- **html5-qrcode** - QR code scanning

### AR
- **model-viewer** - 3D model rendering and WebXR support
- **WebXR** - Augmented Reality API

## 📱 Mobile Support

The application is optimized for mobile devices:
- Responsive design works on all screen sizes
- QR scanner uses device camera
- AR viewer supports WebXR on compatible devices
- Touch-friendly interface

## ⚠️ Limitations

- WebXR support is limited to specific browsers and devices
- iOS requires iOS 12+ with Safari
- Android requires Chrome/Edge with ARCore support
- File size limit: 50MB
- Supported formats: .glb and .gltf only

## 🐛 Troubleshooting

### Camera not working
- Ensure you've granted camera permissions
- Try using HTTPS (required for camera access in some browsers)
- Check browser compatibility

### AR not working / No plane detection
- **⚠️ CRITICAL: Must use HTTPS** - Plane detection requires HTTPS connection
- Verify WebXR support in your browser
- Use a compatible device (Android with ARCore or iOS 12+)
- Test on mobile device (not desktop)
- Ensure good lighting and textured surfaces
- Move device slowly for better tracking
- See `AR_TROUBLESHOOTING.md` for detailed guide

### Upload fails
- Check file size (max 50MB)
- Verify file format (.glb or .gltf)
- Ensure backend server is running
- Check backend logs for errors

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

---

**Note**: Make sure both backend and frontend servers are running for the application to work properly.

