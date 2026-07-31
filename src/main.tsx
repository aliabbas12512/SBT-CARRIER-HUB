import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught third-party script errors (e.g., ad blocker blocking external ad script domains in sandbox) from crashing app
window.onerror = (message) => {
  if (message === 'Script error.' || typeof message === 'string' && message.includes('Script error')) {
    return true; // Suppress cross-origin script errors from third-party ads in preview
  }
  return false;
};

window.addEventListener('error', (event) => {
  if (
    event.message === 'Script error.' ||
    (event.filename && (event.filename.includes('undergocutlery') || event.filename.includes('googlesyndication') || event.filename.includes('pagead')))
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
