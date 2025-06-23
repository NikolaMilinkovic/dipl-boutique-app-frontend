import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global/index.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
