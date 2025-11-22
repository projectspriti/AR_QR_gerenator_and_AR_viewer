import path from 'path';
import { fileURLToPath } from 'url';
import { generateQRCode, generateQRCodeDataURL } from '../utils/qrGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload 3D model and generate QR code
 */
export const uploadModel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    // Use environment variable or construct from request
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    
    // Generate URLs
    const modelUrl = `${baseUrl}/uploads/${file.filename}`;
    // PERFECT AR VIEWER: Use the perfect AR viewer
    const arViewUrl = `${baseUrl}/ar-view/ar-view.html?model=${encodeURIComponent(modelUrl)}&auto=1`;
    
    // Generate QR code
    const qrFilename = path.parse(file.filename).name;
    const qrPath = await generateQRCode(arViewUrl, qrFilename);
    const qrUrl = `${baseUrl}/uploads/${path.basename(qrPath)}`;
    
    // Also generate data URL for immediate use
    const qrDataURL = await generateQRCodeDataURL(arViewUrl);

    res.json({
      success: true,
      model: {
        filename: file.originalname,
        url: modelUrl,
        size: file.size,
        mimetype: file.mimetype
      },
      arViewUrl: arViewUrl,
      qrCode: {
        imageUrl: qrUrl,
        dataUrl: qrDataURL
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get model information
 */
export const getModel = async (req, res, next) => {
  try {
    const { modelId } = req.params;
    // In a real app, you'd fetch from database
    // For now, return a simple response
    res.json({ message: 'Model retrieval not implemented yet' });
  } catch (error) {
    next(error);
  }
};