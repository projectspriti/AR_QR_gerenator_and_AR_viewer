import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate QR code for AR viewer URL
 * @param {string} arViewUrl - The AR viewer URL
 * @param {string} filename - Base filename for the QR code image
 * @returns {Promise<string>} - Path to the generated QR code image
 */
export async function generateQRCode(arViewUrl, filename) {
  try {
    const qrPath = path.join(__dirname, '../../uploads', `${filename}-qr.png`);
    
    // Generate QR code as PNG
    await QRCode.toFile(qrPath, arViewUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrPath;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

/**
 * Generate QR code as data URL (base64)
 * @param {string} arViewUrl - The AR viewer URL
 * @returns {Promise<string>} - Data URL of the QR code
 */
export async function generateQRCodeDataURL(arViewUrl) {
  try {
    const dataURL = await QRCode.toDataURL(arViewUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return dataURL;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

