import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { qrScannerConfig, qrScannerErrorCallback } from '../utils/qrScannerConfig';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const scannerId = 'qr-reader';

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode(scannerId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: qrScannerConfig.fps,
          qrbox: qrScannerConfig.qrbox,
          aspectRatio: qrScannerConfig.aspectRatio,
        },
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback
          qrScannerErrorCallback(errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please check permissions.');
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleScanSuccess = (decodedText) => {
    stopScanning();
    if (onScanSuccess) {
      onScanSuccess(decodedText);
    }
  };

  const handleClose = () => {
    stopScanning();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Scan QR Code</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div id={scannerId} className="w-full mb-4 rounded-lg overflow-hidden"></div>

        <div className="flex gap-3">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Stop Scanning
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Close
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Point your camera at the QR code to scan
        </p>
      </div>
    </div>
  );
};

export default QRScanner;

