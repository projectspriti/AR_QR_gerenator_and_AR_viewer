import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadModel from '../pages/UploadModel';
import GenerateQR from '../pages/GenerateQR';
import ARViewerLoader from '../pages/ARViewerLoader';
import Home from '../pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadModel />} />
      <Route path="/qr" element={<GenerateQR />} />
      <Route path="/ar-view" element={<ARViewerLoader />} />
    </Routes>
  );
};

export default AppRoutes;