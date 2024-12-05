import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Import BrowserRouter
import App from './App.tsx';
import AuthProvider from './context/AuthProvider.tsx';  // Import AuthProvider
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> {/* Wrap everything with Router here */}
      <AuthProvider> {/* Wrap AuthProvider around the app */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
