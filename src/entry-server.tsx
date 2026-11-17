import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App';

/** Renders one page to HTML at build time, so every word is there without JavaScript. */
export function render(pathname = '/') {
  return renderToString(
    <StrictMode>
      <App pathname={pathname} />
    </StrictMode>,
  );
}

// scripts/prerender.mjs builds meta tags, structured data and the sitemap from the same content.
export {brand, founder, pages, projects, SITE, packages, DEFAULT_PRICES} from './content';
