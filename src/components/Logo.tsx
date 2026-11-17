import {logo} from '../logo';

/** The Halo mark: a red ring floating over HALO, with AUTOMATIONS spaced out beneath. Outlined paths, so it needs no font. */
export function Logo({className = '', title = 'Halo Automations'}: {className?: string; title?: string}) {
  const {ring} = logo;
  return (
    <svg className={`logo ${className}`} viewBox={`0 0 ${logo.width} ${logo.height}`} {...(title ? {role: 'img', 'aria-label': title} : {'aria-hidden': true})}>
      <ellipse className="logo__ring" cx={ring.cx} cy={ring.cy} rx={ring.rx} ry={ring.ry} fill="none" stroke="currentColor" strokeWidth={ring.stroke} />
      <path className="logo__word" d={logo.halo} />
      <path className="logo__sub" d={logo.sub} />
    </svg>
  );
}
