import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- Add Service Worker Unregistration Logic ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
    console.log('Attempted to unregister existing service worker.');
  }).catch(error => {
    console.error('Service Worker unregistration failed:', error);
  });
  // Also try to unregister any waiting/installing workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
     registration.unregister();
     console.log('Unregistering service worker:', registration);
    }
  });
}
// --- End Service Worker Unregistration Logic ---


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);

reportWebVitals();
