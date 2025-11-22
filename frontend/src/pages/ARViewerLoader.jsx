import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ARViewerLoader = () => {
  const [searchParams] = useSearchParams();
  const modelUrl = searchParams.get('model');

  useEffect(() => {
    if (modelUrl) {
      // Get base backend URL from VITE_API_URL (remove /api if present)
      const apiUrl = import.meta.env.VITE_API_URL || 'https://ar-viewer.onrender.com/api';
      const baseUrl = apiUrl.replace('/api', '');
      // Redirect to the AR viewer page
      const arViewUrl = `${baseUrl}/ar-view/ar-view.html?model=${encodeURIComponent(modelUrl)}`;
      window.location.href = arViewUrl;
    }
  }, [modelUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Loading AR Viewer...
        </h2>
        <p className="text-gray-600">
          {modelUrl ? 'Redirecting to AR experience' : 'No model URL provided'}
        </p>
      </div>
    </div>
  );
};

export default ARViewerLoader;

