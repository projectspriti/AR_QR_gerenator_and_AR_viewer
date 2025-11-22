import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = (decodedText) => {
    setShowScanner(false);
    // Check if it's an AR viewer URL
    if (decodedText.includes('/ar-view/ar-view.html')) {
      // Extract model parameter if present
      window.location.href = decodedText;
    } else {
      // Try to open as AR viewer URL
      window.location.href = decodedText;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            3D Model AR Viewer
          </h1>
          <p className="text-xl text-white opacity-90 mb-2">
            Upload 3D models and view them in AR
          </p>
          <p className="text-white opacity-75">
            Scan QR codes to instantly view models in augmented reality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-6xl mb-4 text-center">📤</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Upload Model
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Upload a .glb or .gltf file and generate a QR code for AR viewing
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
            >
              Upload Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-6xl mb-4 text-center">📷</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Scan QR Code
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Scan a QR code to view a 3D model in AR on your device
            </p>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
            >
              Scan QR Code
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            How It Works
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">Upload Your Model</h4>
                <p className="text-gray-600 text-sm">
                  Upload a .glb or .gltf 3D model file
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">Get QR Code</h4>
                <p className="text-gray-600 text-sm">
                  Receive a QR code that links to your AR viewer
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">Scan & View</h4>
                <p className="text-gray-600 text-sm">
                  Scan the QR code with your phone to view in AR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Home;

