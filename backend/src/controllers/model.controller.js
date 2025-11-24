import path from 'path';
import { fileURLToPath } from 'url';
import { generateQRCode, generateQRCodeDataURL } from '../utils/qrGenerator.js';
import Model from '../models/Model.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a unique QR code ID
 */
const generateQRCodeId = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

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
    
    // Generate unique QR code ID
    let qrCodeId = generateQRCodeId();
    // Ensure uniqueness
    let existingModel = await Model.findOne({ qrCodeId });
    while (existingModel) {
      qrCodeId = generateQRCodeId();
      existingModel = await Model.findOne({ qrCodeId });
    }
    
    // Generate QR code
    const qrFilename = path.parse(file.filename).name;
    const qrPath = await generateQRCode(arViewUrl, qrFilename);
    const qrUrl = `${baseUrl}/uploads/${path.basename(qrPath)}`;
    
    // Also generate data URL for immediate use
    const qrDataURL = await generateQRCodeDataURL(arViewUrl);

    // Save to MongoDB
    const modelData = new Model({
      filename: file.filename,
      originalFilename: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      modelUrl: modelUrl,
      arViewUrl: arViewUrl,
      qrCodeUrl: qrUrl,
      qrCodeData: arViewUrl, // Store the AR view URL as QR code data
      qrCodeId: qrCodeId,
      description: req.body.description || '',
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',')) : [],
    });

    const savedModel = await modelData.save();

    res.json({
      success: true,
      model: {
        id: savedModel._id,
        filename: file.originalname,
        url: modelUrl,
        size: file.size,
        mimetype: file.mimetype
      },
      arViewUrl: arViewUrl,
      qrCode: {
        id: qrCodeId,
        imageUrl: qrUrl,
        dataUrl: qrDataURL,
        data: arViewUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get model information by ID
 */
export const getModel = async (req, res, next) => {
  try {
    const { modelId } = req.params;
    
    const model = await Model.findById(modelId);
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    // Increment access count
    await model.incrementAccess();
    
    res.json({
      success: true,
      model: {
        id: model._id,
        filename: model.originalFilename,
        url: model.modelUrl,
        size: model.fileSize,
        mimetype: model.mimeType,
        arViewUrl: model.arViewUrl,
        qrCodeId: model.qrCodeId,
        qrCodeUrl: model.qrCodeUrl,
        uploadedAt: model.uploadedAt,
        accessCount: model.accessCount,
        description: model.description,
        tags: model.tags
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Match QR code and get model information
 * This endpoint is used when scanning a QR code
 */
export const matchQRCode = async (req, res, next) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ error: 'QR code data is required' });
    }
    
    // Find model by QR code data or ID
    const model = await Model.findByQRCode(qrData);
    
    if (!model) {
      return res.status(404).json({ 
        error: 'QR code not found',
        message: 'The scanned QR code does not match any model in the database'
      });
    }
    
    // Increment access count
    await model.incrementAccess();
    
    res.json({
      success: true,
      model: {
        id: model._id,
        filename: model.originalFilename,
        url: model.modelUrl,
        size: model.fileSize,
        mimetype: model.mimeType,
        arViewUrl: model.arViewUrl,
        qrCodeId: model.qrCodeId,
        qrCodeUrl: model.qrCodeUrl,
        uploadedAt: model.uploadedAt,
        accessCount: model.accessCount,
        description: model.description,
        tags: model.tags
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all models (for admin/listing purposes)
 */
export const getAllModels = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { originalFilename: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { qrCodeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const models = await Model.find(query)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await Model.countDocuments(query);
    
    res.json({
      success: true,
      models: models.map(model => ({
        id: model._id,
        filename: model.originalFilename,
        url: model.modelUrl,
        arViewUrl: model.arViewUrl,
        qrCodeId: model.qrCodeId,
        qrCodeUrl: model.qrCodeUrl,
        uploadedAt: model.uploadedAt,
        accessCount: model.accessCount,
        description: model.description,
        tags: model.tags
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};