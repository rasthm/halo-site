import {createRoot} from 'react-dom/client';
import {Desk} from './Desk';

// Fonts first, so the key legends and readout draw in Rubik and JetBrains Mono, not a fallback.
const ready = Promise.all([
  document.fonts.load('500 58px Rubik'),
  document.fonts.load('700 120px Rubik'),
  document.fonts.load('700 46px "JetBrains Mono"'),
]).catch(() => undefined);

ready.then(() => {
  const host = document.getElementById('desk')!;
  createRoot(host).render(<Desk />);
});
