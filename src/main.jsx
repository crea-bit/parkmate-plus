import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import './App.css';
import "leaflet/dist/leaflet.css";  
// ─── Entry Point ──────────────────────────────────────────────────────────────
// Mounts the React app into the #root div defined in index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
