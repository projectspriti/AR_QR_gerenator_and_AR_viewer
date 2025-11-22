import express from 'express';
import upload from '../config/storage.js';
import { uploadModel, getModel } from '../controllers/model.controller.js';

const router = express.Router();

// Upload 3D model
router.post('/upload', upload.single('model'), uploadModel);

// Get model info (placeholder)
router.get('/:modelId', getModel);

export default router;

