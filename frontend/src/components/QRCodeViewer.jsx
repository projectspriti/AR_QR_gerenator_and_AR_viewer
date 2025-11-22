import React from 'react';

const QRCodeViewer = ({ qrDataUrl, arViewUrl, onDownload }) => {
  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = 'ar-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenAR = () => {
    if (arViewUrl) {
      window.open(arViewUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        QR Code Generated! 🎉
      </h2>
      
      {qrDataUrl && (
        <div className="mb-6 flex justify-center">
          <img 
            src={qrDataUrl} 
            alt="QR Code" 
            className="border-4 border-gray-200 rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md"
        >
          📥 Download QR Code
        </button>
        
        <button
          onClick={handleOpenAR}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md"
        >
          🎯 Open AR Viewer
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Instructions:</strong>
        </p>
        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
          <li>Download or screenshot the QR code</li>
          <li>Open the QR code on another device</li>
          <li>Scan it with your phone's camera</li>
          <li>The AR viewer will open automatically</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeViewer;

