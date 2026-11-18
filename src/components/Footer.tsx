import {brand, footerNav, founder} from '../content';
import {InstagramLink} from './Common';
import {Github, WhatsApp} from './Icons';
import {Logo} from './Logo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__brand">
          <Logo className="logo--footer" />
          <p>{brand.what}</p>
        </div>
        <nav aria-label="Footer">
          <p className="label">Pages</p>
          <ul>
            {footerNav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label">Talk to us</p>
          <ul className="site-footer__contact">
            <li>
              <a href={founder.whatsapp.url} target="_blank" rel="noopener">
                <WhatsApp width={16} height={16} /> <span>WhatsApp {founder.whatsapp.handle}</span>
              </a>
            </li>
            <li>
              <InstagramLink />
            </li>
            <li>
              <a href={founder.github.url} target="_blank" rel="noopener">
                <Github width={16} height={16} /> <span>GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap site-footer__base">
        <span>© 2026 {brand.name}</span>
        <span>Built and hosted on Cloudflare’s edge · No cookies, no trackers</span>
      </div>
    </footer>
  );
}
