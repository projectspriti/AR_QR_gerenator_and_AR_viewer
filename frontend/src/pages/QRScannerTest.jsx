import React, { useState } from 'react';
import QRScannerNew from '../components/QRScannerNew';

const QRScannerTest = () => {
  const [scanResult, setScanResult] = useState('');

  const handleScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    alert(`QR Code Scanned Successfully!\n\nContent: ${decodedText}`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            QR Scanner Test
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Click "Start Camera" to begin scanning</li>
              <li>Point your camera at a QR code</li>
              <li>The scanner will automatically detect and decode the QR code</li>
              <li>Results will be displayed in an alert and below</li>
            </ol>
          </div>
          
          <div className="mb-8">
            <QRScannerNew onScanSuccess={handleScanSuccess} />
          </div>
          
          {scanResult && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Scan Result</h3>
              <p className="text-green-700 break-all">{scanResult}</p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerTest;