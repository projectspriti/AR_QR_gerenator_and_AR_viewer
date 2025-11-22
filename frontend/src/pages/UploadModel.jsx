import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import QRCodeViewer from '../components/QRCodeViewer';

const UploadModel = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase().split('.').pop();
      if (ext !== 'glb' && ext !== 'gltf') {
        setError('Please select a .glb or .gltf file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('model', file);

      const response = await api.post('/models/upload', formData);
      setUploadResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to upload file. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Upload 3D Model
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Upload a .glb or .gltf file to generate an AR QR code
          </p>

          {!uploadResult ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select 3D Model File (.glb or .gltf)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".glb,.gltf"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">GLB or GLTF up to 50MB</p>
                  </div>
                </div>
                {file && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Selected:</strong> {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
                >
                  {uploading ? 'Uploading...' : 'Upload & Generate QR Code'}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <QRCodeViewer
                qrDataUrl={uploadResult.qrCode?.dataUrl}
                arViewUrl={uploadResult.arViewUrl}
              />
              <button
                onClick={handleReset}
                className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Upload Another Model
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModel;

