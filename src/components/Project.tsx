import type {Project, Visual} from '../content';
import {Ext} from './Common';

/** Real output from `node bin/fssai.js 12421012003663` (a public licence used in the tool's README). */
const TERMINAL = [
  ['FSSAI number', '12421012003663'],
  ['Company', 'Sapphire Foods India Limited (KFC)'],
  ['District', 'Madurai'],
  ['State', 'Tamil Nadu'],
  ['Licence type', 'State License'],
  ['Status', 'License Issued'],
];

export function ProjectVisual({visual}: {visual: Visual}) {
  if (visual.kind === 'image')
    return <img className="pv__img" src={visual.src} alt={visual.alt} width={1280} height={800} loading="lazy" decoding="async" style={{objectPosition: visual.position ?? 'center top'}} />;

  if (visual.kind === 'terminal')
    return (
      <div className="pv__term" role="img" aria-label="Terminal: an FSSAI licence lookup returning the company, district, state and licence status">
        <div className="term__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="mono">fssai-lookup-nokey</span>
        </div>
        <pre className="term__body mono" aria-hidden="true">
          <span className="term__prompt">$</span> node bin/fssai.js 12421012003663{'\n'}
          {TERMINAL.map(([k, v]) => (
            <span key={k}>
              <span className="term__key">{k.padEnd(13)}</span> <span className="term__val">{v}</span>
              {'\n'}
            </span>
          ))}
          <span className="term__ok">found</span>
        </pre>
      </div>
    );

  if (visual.kind === 'partner')
    return (
      <div className="pv__partner">
        <div className="pv__partnerlogo">
          <img src={visual.logo} alt={`${visual.name} logo`} width={96} height={121} loading="lazy" />
          <span className="mono">with {visual.name}</span>
        </div>
        <ol className="pv__flow mono" aria-label="How it flows">
          {visual.flow.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    );

  if (visual.kind === 'island')
    return (
      <div className="pv__island" role="img" aria-label="Illustration: Casper’s pill at the top of the screen while listening, thinking and speaking">
        {['Listening', 'Thinking', 'Speaking'].map((state, i) => (
          <span key={state} className={`island island--${i}`} aria-hidden="true">
            <span className="island__orb" />
            <span className="island__state mono">{state}</span>
            <span className="island__wave">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </span>
        ))}
      </div>
    );

  return (
    <div className={`pv__reels pv__reels--${visual.tone}`}>
      {visual.frames.map((f, i) => (
        <img key={f.src} className={`reel reel--${i}`} src={f.src} alt={f.alt} width={720} height={1280} loading="lazy" decoding="async" />
      ))}
    </div>
  );
}

export function ProjectCard({p, compact = false}: {p: Project; compact?: boolean}) {
  return (
    <article className={`project${compact ? ' project--compact' : ''}`} id={p.id} data-reveal>
      <div className="project__visual">
        <ProjectVisual visual={p.visual} />
      </div>
      <div className="project__body">
        <p className="project__label mono">{p.label}</p>
        <h3>{p.title}</h3>
        <p className="project__one">{p.oneLiner}</p>
        {!compact && <p className="project__desc">{p.description}</p>}
        {!compact && (
          <ul className="tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="project__links">
          {p.live && (
            <Ext href={p.live} className="ext ext--live">
              Open live
            </Ext>
          )}
          {p.code && <Ext href={p.code}>Code on GitHub</Ext>}
          {p.note && <span className="project__note mono">{p.note}</span>}
        </div>
      </div>
    </article>
  );
}
