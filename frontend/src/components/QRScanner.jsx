import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { qrScannerConfig } from '../utils/qrScannerConfig';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanStatus, setScanStatus] = useState('Ready to scan');
  const html5QrCodeRef = useRef(null);
  const scannerId = 'qr-reader';
  const scanAttemptsRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  const isScanSuccessRef = useRef(false);

  useEffect(() => {
    // Initialize scanner container
    const scannerElement = document.getElementById(scannerId);
    if (scannerElement) {
      scannerElement.innerHTML = '';
    }
    
    return () => {
      // Cleanup on unmount
      cleanupScanner();
    };
  }, []);

  const cleanupScanner = async () => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;
    
    try {
      if (html5QrCodeRef.current) {
        // Check if scanner is actually running before trying to stop
        const state = html5QrCodeRef.current.getState();
        if (state !== Html5QrcodeScannerState.NOT_STARTED && 
            state !== Html5QrcodeScannerState.STOPPED) {
          try {
            await html5QrCodeRef.current.stop();
          } catch (e) {
            console.warn('Error stopping scanner:', e);
          }
        }
        
        // Only clear if the element still exists in the DOM and has children
        const scannerElement = document.getElementById(scannerId);
        if (scannerElement && scannerElement.children && scannerElement.children.length > 0) {
          try {
            await html5QrCodeRef.current.clear();
          } catch (e) {
            console.warn('Error clearing scanner:', e);
          }
        }
        html5QrCodeRef.current = null;
      }
    } catch (e) {
      console.warn('Error during scanner cleanup:', e);
    } finally {
      isCleaningUpRef.current = false;
    }
  };

  const startScanning = async () => {
    try {
      setError(null);
      setScanStatus('Initializing camera...');
      scanAttemptsRef.current = 0;
      isCleaningUpRef.current = false;
      isScanSuccessRef.current = false;
      
      // Ensure the scanner element exists
      const scannerElement = document.getElementById(scannerId);
      if (!scannerElement) {
        setError('Scanner element not found. Please try again.');
        return;
      }

      // Clean up any existing scanner instance properly
      await cleanupScanner();

      // Clear the scanner container
      scannerElement.innerHTML = '';

      const html5QrCode = new Html5Qrcode(scannerId, qrScannerConfig.experimentalFeatures);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: qrScannerConfig.fps,
          qrbox: qrScannerConfig.qrbox,
          aspectRatio: qrScannerConfig.aspectRatio,
          disableFlip: qrScannerConfig.disableFlip,
        },
        (decodedText) => {
          // Prevent multiple scan success callbacks
          if (isScanSuccessRef.current) return;
          isScanSuccessRef.current = true;
          
          // Success callback - validate URL before processing
          if (decodedText && decodedText.trim()) {
            handleScanSuccess(decodedText.trim());
          }
        },
        (errorMessage) => {
          // Error callback - only log, don't show to user
          // This is called frequently when scanning (normal behavior)
          // Only update status for actual scanning attempts
          if (errorMessage && !errorMessage.includes('NotFoundException')) {
            scanAttemptsRef.current++;
            if (scanAttemptsRef.current % 30 === 0) {
              setScanStatus('Point camera at QR code...');
            }
          }
        }
      );

      setIsScanning(true);
      setScanStatus('Scanning... Point camera at QR code');
    } catch (err) {
      console.error('Error starting scanner:', err);
      let errorMsg = 'Failed to start camera. ';
      
      if (err.name === 'NotAllowedError' || err.message?.includes('permission')) {
        errorMsg += 'Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError' || err.message?.includes('camera')) {
        errorMsg += 'No camera found. Please check your device.';
      } else if (err.message?.includes('NotReadableError')) {
        errorMsg += 'Camera is already in use by another application.';
      } else if (err.message?.includes('OverconstrainedError')) {
        errorMsg += 'Camera constraints cannot be satisfied. Try a different camera.';
      } else {
        errorMsg += 'Please check permissions and try again.';
      }
      
      setError(errorMsg);
      setIsScanning(false);
      setScanStatus('Camera error');
    }
  };

  const stopScanning = async () => {
    try {
      await cleanupScanner();
      setIsScanning(false);
      setScanStatus('Stopped');
    } catch (err) {
      console.error('Error stopping scanner:', err);
      setIsScanning(false);
    }
  };

  const handleScanSuccess = (decodedText) => {
    // Validate the scanned text
    if (!decodedText || !decodedText.trim()) {
      setError('Invalid QR code. Please try scanning again.');
      isScanSuccessRef.current = false;
      return;
    }

    const trimmedText = decodedText.trim();
    
    // Basic validation - check if it looks like a URL or path
    const isAbsoluteUrl = /^https?:\/\//i.test(trimmedText);
    const isRelativePath = trimmedText.startsWith('/');
    const looksLikeUrl = isAbsoluteUrl || isRelativePath || trimmedText.includes('.html') || trimmedText.includes('/ar-view');
    
    if (!looksLikeUrl) {
      setError('QR code does not appear to contain a valid AR viewer URL. Please scan a valid QR code.');
      isScanSuccessRef.current = false;
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

        <div id={scannerId} className="w-full mb-4 rounded-lg overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center">
          {!isScanning && (
            <div className="text-gray-400 text-center p-8">
              <div className="text-4xl mb-2">📷</div>
              <p>Camera preview will appear here</p>
            </div>
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

export default QRScanner;