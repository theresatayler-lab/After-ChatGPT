import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import EarlyAccessPage from './pages/EarlyAccess';
import './App.css';

// =============================================================================
// EARLY ACCESS MODE: All routes redirect to /early-access
// To restore full site, replace this file with App.js.full-site-backup
// =============================================================================

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Early Access page - the only accessible page */}
          <Route path="/early-access" element={<EarlyAccessPage />} />
          
          {/* ALL other routes redirect to /early-access */}
          <Route path="*" element={<Navigate to="/early-access" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
