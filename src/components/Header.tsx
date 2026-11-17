import {useEffect, useState} from 'react';
import {nav} from '../content';
import {BookCall, InstagramLink} from './Common';
import {Close, Menu} from './Icons';
import {Logo} from './Logo';

export function Header({path}: {path: string}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, {passive: true});
    return () => window.removeEventListener('scroll', on);
  }, []);

  // The phone menu covers the page: lock scrolling behind it and close it with Escape.
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open]);

  const current = (href: string) => path === href || (href !== '/' && path.startsWith(href));

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="site-header__bar wrap">
        <a className="site-header__logo" href="/" aria-label="Halo Automations, home">
          <Logo />
        </a>
        <nav className="site-nav" aria-label="Main">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={current(n.href) ? 'page' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <BookCall className="btn btn--red btn--sm site-header__cta" icon={false} />
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          {open ? <Close width={22} height={22} /> : <Menu width={22} height={22} />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Main, mobile">
          <ul>
            {[...nav, {label: 'How we work', href: '/how-we-work/'}, {label: 'Contact', href: '/contact/'}].map((n, i) => (
              <li key={n.href} style={{['--i' as string]: i}}>
                <a href={n.href} aria-current={current(n.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                  <span className="mobile-menu__n mono">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <BookCall className="btn btn--red btn--lg btn--block" />
          <InstagramLink />
        </div>
      </div>
    </header>
  );
}
