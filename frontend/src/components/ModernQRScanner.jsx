import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const ModernQRScanner = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanStatus, setScanStatus] = useState('Ready to scan');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setScanStatus('Initializing camera...');
      isProcessingRef.current = false;
      
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsScanning(true);
      setScanStatus('Scanning... Point camera at QR code');
      
      // Start scanning interval
      scanIntervalRef.current = setInterval(scanFrame, 200);
    } catch (err) {
      console.error('Error starting scanner:', err);
      let errorMsg = 'Failed to start camera. ';
      
      if (err.name === 'NotAllowedError' || err.message?.includes('permission')) {
        errorMsg += 'Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError' || err.message?.includes('camera')) {
        errorMsg += 'No camera found. Please check your device.';
      } else if (err.message?.includes('NotReadableError')) {
        errorMsg += 'Camera is already in use by another application.';
      } else {
        errorMsg += 'Please check permissions and try again.';
      }
      
      setError(errorMsg);
      setIsScanning(false);
      setScanStatus('Camera error');
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || isProcessingRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      try {
        isProcessingRef.current = true;
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          handleScanSuccess(code.data);
        }
      } catch (err) {
        console.error('QR decoding error:', err);
      } finally {
        isProcessingRef.current = false;
      }
    }
  };

  const stopScanning = () => {
    // Clear scanning interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    setScanStatus('Stopped');
    isProcessingRef.current = false;
  };

  const handleScanSuccess = (decodedText) => {
    if (!decodedText || !decodedText.trim()) {
      setError('Invalid QR code. Please try scanning again.');
      return;
    }

    const trimmedText = decodedText.trim();
    
    // Basic validation - check if it looks like a URL or path
    const isAbsoluteUrl = /^https?:\/\//i.test(trimmedText);
    const isRelativePath = trimmedText.startsWith('/');
    const looksLikeUrl = isAbsoluteUrl || isRelativePath || trimmedText.includes('.html') || trimmedText.includes('/ar-view');
    
    if (!looksLikeUrl) {
      setError('QR code does not appear to contain a valid AR viewer URL. Please scan a valid QR code.');
      return;
    }

    // Stop scanning and process
    stopScanning();
    setScanStatus('QR code detected! Redirecting...');
    
    if (onScanSuccess) {
      onScanSuccess(trimmedText);
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
            aria-label="Close scanner"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="mb-2 text-sm text-gray-600 text-center">
          {scanStatus}
        </div>

        <div className="w-full mb-4 rounded-lg overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center relative">
          {!isScanning ? (
            <div className="text-gray-400 text-center p-8">
              <div className="text-4xl mb-2">📷</div>
              <p>Camera preview will appear here</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas 
                ref={canvasRef}
                className="hidden"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white rounded-lg w-64 h-64 opacity-50"></div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              aria-label="Start camera"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              aria-label="Stop scanning"
            >
              Stop Scanning
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            aria-label="Close scanner"
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

export default ModernQRScanner;