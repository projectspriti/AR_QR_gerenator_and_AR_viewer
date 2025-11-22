// QR Scanner configuration
export const qrScannerConfig = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
  disableFlip: false,
  videoConstraints: {
    facingMode: 'environment', // Use back camera
  },
};

export const qrScannerErrorCallback = (errorMessage) => {
  console.error('QR Scanner Error:', errorMessage);
};

