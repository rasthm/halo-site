import type {ReactNode} from 'react';
import {INSTAGRAM_HANDLE, INSTAGRAM_URL} from '../content';
import {usePublicInfo} from '../live';
import {ArrowRight, ArrowUpRight, Calendar, Instagram} from './Icons';

/** "Book a call": the desk's booking link when one is set, otherwise the contact page. */
export function BookCall({className = 'btn btn--red', children = 'Book a call', icon = true}: {className?: string; children?: ReactNode; icon?: boolean}) {
  const {bookingUrl} = usePublicInfo();
  const external = !!bookingUrl;
  return (
    <a className={className} href={bookingUrl || '/contact/'} {...(external ? {target: '_blank', rel: 'noopener'} : {})}>
      {icon && <Calendar width={16} height={16} />}
      <span>{children}</span>
    </a>
  );
}

/** Instagram link, or a quiet "coming soon" while the account does not exist (set INSTAGRAM_URL in content.ts). */
export function InstagramLink({className = 'link-quiet'}: {className?: string}) {
  if (INSTAGRAM_URL)
    return (
      <a className={className} href={INSTAGRAM_URL} target="_blank" rel="noopener">
        <Instagram width={16} height={16} /> <span>Instagram {INSTAGRAM_HANDLE}</span>
      </a>
    );
  return (
    <span className={`${className} is-soon`}>
      <Instagram width={16} height={16} /> <span>Instagram: coming soon</span>
    </span>
  );
}

export function Label({children, n}: {children: ReactNode; n?: string}) {
  return (
    <p className="label">
      {n && <span className="label__n">{n}</span>}
      <span>{children}</span>
    </p>
  );
}

/** A two-part heading: the statement in Archivo Black, the second line quieter in Instrument Serif italic. */
export function Title({lines, as: Tag = 'h2', className = '', id}: {lines: string[]; as?: 'h1' | 'h2'; className?: string; id?: string}) {
  const [first, ...rest] = lines;
  return (
    <Tag className={`title ${className}`} id={id}>
      <span className="title__a">{first}</span>
      {rest.map((l) => (
        <span key={l} className="title__b">
          {' '}
          {l}
        </span>
      ))}
    </Tag>
  );
}

export function More({href, children}: {href: string; children: ReactNode}) {
  return (
    <a className="more" href={href}>
      <span>{children}</span> <ArrowRight width={16} height={16} />
    </a>
  );
}

export function Ext({href, children, className = 'ext'}: {href: string; children: ReactNode; className?: string}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener">
      <span>{children}</span> <ArrowUpRight width={15} height={15} />
    </a>
  );
}

/** Page header for the inner pages. */
export function PageHead({label, lines, intro, children}: {label: string; lines: string[]; intro?: string; children?: ReactNode}) {
  return (
    <header className="pagehead wrap">
      <Label>{label}</Label>
      <Title lines={lines} as="h1" className="title--xl" />
      {intro && <p className="lede">{intro}</p>}
      {children}
    </header>
  );
}
