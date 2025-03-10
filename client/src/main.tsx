import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot, useRecoilValue } from 'recoil'; // Import RecoilRoot
import App from './App.tsx';
import Loader from './components/Loader.tsx'; // Import the Loader component
import './index.css';
// Create the root and render the app
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
     <Loader />
      <App />
    </RecoilRoot>
  </React.StrictMode>
);