import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught third-party script errors (e.g., ad blocker blocking external ad script domains in sandbox) from crashing app
window.addEventListener('error', (event) => {
  if (event.message === 'Script error.' || (event.filename && event.filename.includes('undergocutlery'))) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
