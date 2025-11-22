import React from 'react';
import { useLocation } from 'react-router-dom';
import QRCodeViewer from '../components/QRCodeViewer';

const GenerateQR = () => {
  const location = useLocation();
  const { qrDataUrl, arViewUrl } = location.state || {};

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
      </div>
    </div>
  );
};

export default GenerateQR;

