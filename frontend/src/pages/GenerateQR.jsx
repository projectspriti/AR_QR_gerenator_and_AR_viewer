import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCodeViewer from '../components/QRCodeViewer';
import ModernQRScanner from '../components/ModernQRScanner';

const GenerateQR = () => {
  const location = useLocation();
  const { qrDataUrl, arViewUrl } = location.state || {};
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = (decodedText) => {
    try {
      setShowScanner(false);
      
      // Validate and normalize the URL
      let targetUrl = decodedText.trim();
      
      // If it's a relative URL, make it absolute
      if (targetUrl.startsWith('/')) {
        const baseUrl = window.location.origin;
        targetUrl = `${baseUrl}${targetUrl}`;
      }
      
      // Validate it's a proper URL
      try {
        new URL(targetUrl);
      } catch (e) {
        alert('Invalid QR code URL. Please scan a valid AR viewer QR code.');
        setShowScanner(true);
        return;
      }
      
      // CRITICAL FIX: Ensure proper AR viewer activation
      // Check if it's an AR viewer URL
      if (targetUrl.includes('/ar-view/ar-view.html') || targetUrl.includes('ar-view.html')) {
        // Ensure auto=1 parameter is present for automatic AR activation
        if (!targetUrl.includes('auto=1')) {
          const separator = targetUrl.includes('?') ? '&' : '?';
          targetUrl = `${targetUrl}${separator}auto=1`;
        }
        
        // Use window.open with user gesture context to preserve activation capability
        // CRITICAL FIX: Add focus and resize features for better AR experience
        const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer,width=screen.width,height=screen.height,fullscreen=yes');
        if (newWindow) {
          // Try to focus the new window
          newWindow.focus();
        } else {
          // Fallback if popup blocked
          window.location.href = targetUrl;
        }
      } else {
        // For other URLs, just navigate normally
        window.location.href = targetUrl;
      }
    } catch (error) {
      console.error('Error handling scan success:', error);
      alert('Error processing QR code. Please try again.');
      setShowScanner(true);
    }
  };

  if (!qrDataUrl || !arViewUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No QR Code Data
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload a model first to generate a QR code.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Upload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <QRCodeViewer qrDataUrl={qrDataUrl} arViewUrl={arViewUrl} />
        
        <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Scan Another QR Code
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Scan another QR code to view a different 3D model in AR
          </p>
          <button
            onClick={() => setShowScanner(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Scan QR Code
          </button>
        </div>
      </div>
      
      {showScanner && (
        <ModernQRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default GenerateQR;