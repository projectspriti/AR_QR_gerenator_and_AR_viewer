import React, { useRef, useState } from 'react';
import QrCodeReader from 'qrcode-reader';

const QRTest = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const qr = new QrCodeReader();
        qr.callback = (err, decoded) => {
          if (err) {
            setError('Error decoding QR code: ' + err.message);
            setResult('');
          } else {
            setResult(decoded.result);
            setError('');
          }
        };
        qr.decode(imageData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">QR Code Reader Test</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="mb-4"
      />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Decoded QR Code:</strong> {result}
        </div>
      )}
      <div className="text-sm text-gray-600">
        <p>Select an image containing a QR code to test the reader.</p>
      </div>
    </div>
  );
};

export default QRTest;