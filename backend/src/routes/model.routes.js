import express from 'express';
import upload from '../config/storage.js';
import { uploadModel, getModel, matchQRCode, getAllModels } from '../controllers/model.controller.js';

const router = express.Router();

// Upload 3D model
router.post('/upload', upload.single('model'), uploadModel);

// Match QR code (for scanning)
router.post('/match-qr', matchQRCode);

// Get all models (with pagination and search)
router.get('/', getAllModels);

// Get model info by ID
router.get('/:modelId', getModel);

export default router;

