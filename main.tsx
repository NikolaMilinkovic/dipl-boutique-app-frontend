import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global/index.scss';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navigation/Navbar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
