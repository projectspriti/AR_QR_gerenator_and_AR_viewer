import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const ModernQRScanner = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanStatus, setScanStatus] = useState('Initializing camera...');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Check for camera permission on component mount
    checkCameraPermission();
    
    // Automatically start scanning when component mounts
    startScanning();
    
    return () => {
      stopScanning();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setError('Camera API not supported in your browser. Please try a modern browser.');
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setError('No camera found on this device.');
        return;
      }

      // Check permission status if available
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' });
          setHasCameraPermission(permissionStatus.state === 'granted');
        } catch (err) {
          // Permission API not supported, continue with normal flow
          setHasCameraPermission(null);
        }
      }
    } catch (err) {
      console.warn('Could not check camera permission:', err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      setScanStatus('Requesting camera permission...');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Permission granted
      setHasCameraPermission(true);
      streamRef.current = stream;
      
      return stream;
    } catch (err) {
      console.error('Camera permission error:', err);
      
      // Handle different error types
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please allow camera permission in your browser settings.');
        setHasCameraPermission(false);
      } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        setError('No suitable camera found. Please check your device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else {
        setError('Failed to access camera. Please check permissions and try again.');
      }
      
      setScanStatus('Camera error');
      return null;
    }
  };

  const startScanning = async () => {
    try {
      setError(null);
      setScanStatus('Initializing camera...');
      isProcessingRef.current = false;
      setIsScanning(true);
      
      // Request camera permission
      const stream = await requestCameraPermission();
      if (!stream) {
        setIsScanning(false);
        return;
      }
      
      // Set up video element
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
      setError('Failed to start camera. Please try again.');
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
    setScanStatus('QR code detected! Opening AR viewer...');
    
    // CRITICAL FIX: Ensure proper handling of the scanned URL
    if (onScanSuccess) {
      // Add a small delay to ensure scanning is fully stopped before opening AR viewer
      setTimeout(() => {
        onScanSuccess(trimmedText);
      }, 300);
    }
  };

  const handleClose = () => {
    stopScanning();
    if (onClose) {
      onClose();
    }
  };

  const handleRetry = () => {
    setError(null);
    setScanStatus('Initializing camera...');
    stopScanning();
    startScanning(); // Restart scanning on retry
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h2 className="text-xl font-bold">Scan QR Code</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Close scanner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Scanner Area */}
        <div className="relative p-4 bg-black">
          {/* Camera Preview */}
          <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${!isScanning ? 'opacity-50' : ''}`}
              playsInline
              muted
              autoPlay
            />
            
            {/* Scanner Frame */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full max-w-xs h-64 border-4 border-white rounded-xl">
                {/* Corner borders */}
                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                
                {/* Animated scanning line */}
                {isScanning && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-scan rounded-full" style={{
                    animation: 'scan 2s linear infinite',
                    boxShadow: '0 0 10px rgba(96, 165, 250, 0.8)'
                  }}></div>
                )}
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white"></div>
                </div>
              </div>
            </div>
            
            {/* Status overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-3 text-center transition-all duration-300 ${
              error ? 'bg-red-600/80' : 'bg-black/70'
            }`}>
              <p className={`text-sm font-medium ${
                error ? 'text-red-100' : 'text-white'
              }`}>
                {error || scanStatus}
              </p>
              {!isScanning && !error && (
                <button
                  onClick={startScanning}
                  className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Start Scanning
                </button>
              )}
            </div>
          </div>
          
          {/* Help text */}
          <div className="mt-4 text-center text-gray-300 text-sm">
            <p>Position the QR code within the frame to scan</p>
            <p className="text-xs text-gray-500 mt-1">Make sure there's enough light and the code is clear</p>
          </div>
          
          {/* Manual input option */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => {
                const manualInput = prompt('Enter the model URL or ID:');
                if (manualInput) {
                  onScanSuccess(manualInput);
                }
              }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
            >
              <span>Enter code manually</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Canvas for QR code processing (hidden) */}
      <canvas ref={canvasRef} className="hidden" />
      
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100% - 1rem)); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ModernQRScanner;