import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App';
import './fonts.css';
import './styles.css';
import './styles-neon.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App pathname={window.location.pathname} />
  </StrictMode>
);

// Every page is pre-rendered into #root at build time; take it over instead of redrawing it.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
