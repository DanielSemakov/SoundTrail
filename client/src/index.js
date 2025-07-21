import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TrackProvider } from './context/TrackContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TrackProvider>
        <App />
      </TrackProvider>
    </BrowserRouter>
  </React.StrictMode>
);
