import {useRef, useState} from 'react';
import {about, capabilities, disciplines, founder, journey, partners, projectById, skills} from '../content';
import {Label, PageHead, Title} from '../components/Common';
import {Play} from '../components/Icons';
import {Closing} from '../components/Sections';

function FounderMedia() {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => video.current?.play().catch(() => setPlaying(false)));
  };
  const {photo} = founder;
  return (
    <figure className="founder__media">
      {playing ? (
        <video ref={video} className="founder__img" src={founder.video.src} poster={founder.video.poster} muted playsInline preload="metadata" loop controls aria-label={founder.video.label} width={1280} height={720} />
      ) : (
        <img
          className="founder__img"
          src={photo.large}
          srcSet={`${photo.small} 800w, ${photo.large} 1400w`}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          fetchPriority="high"
        />
      )}
      {!playing && (
        <button type="button" className="founder__play" onClick={play}>
          <Play width={14} height={14} /> <span>Play 8 seconds</span>
        </button>
      )}
      <figcaption className="founder__cap mono">
        {founder.name} · {founder.role}, {founder.base}
      </figcaption>
    </figure>
  );
}

export function About() {
  return (
    <>
      <PageHead label={about.label} lines={about.title} intro={about.intro} />

      <section className="founder section section--tight" aria-labelledby="founder-title">
        <div className="wrap founder__grid">
          <FounderMedia />
          <div className="founder__text">
            <Label>The founder</Label>
            <h2 className="title" id="founder-title">
              <span className="title__a">{founder.name},</span> <span className="title__b">founder.</span>
            </h2>
            {about.founderText.map((t) => (
              <p key={t.slice(0, 20)}>{t}</p>
            ))}
            <p className="founder__rule">
              <span className="mono">The rule we build by</span> {about.quote}
            </p>
            <p className="small muted">
              Personal portfolio:{' '}
              <a className="inline" href={founder.portfolio} target="_blank" rel="noopener">
                rasthm.orbit-fm.workers.dev
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="disciplines section" aria-labelledby="disc-title">
        <div className="wrap">
          <Label>How the studio works</Label>
          <h2 className="title" id="disc-title">
            <span className="title__a">Four disciplines,</span> <span className="title__b">on every project.</span>
          </h2>
          <ul className="disciplines__grid">
            {disciplines.map((d, i) => (
              <li key={d.title} data-reveal>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="caps section section--cream" aria-labelledby="caps-title">
        <div className="wrap">
          <Label>What we build</Label>
          <h2 className="title" id="caps-title">
            <span className="title__a">The whole stack,</span> <span className="title__b">from idea to a working link.</span>
          </h2>
          <ul className="caps__grid">
            {capabilities.map((c) => (
              <li key={c.title} data-reveal>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <p className="caps__tools mono">{c.tools.join(' · ')}</p>
                <a className="caps__proof" href={`/work/#${c.proof}`}>
                  Proof: {projectById(c.proof).title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="journey section" aria-labelledby="journey-title">
        <div className="wrap journey__grid">
          <div className="section__head">
            <Label>{journey.label}</Label>
            <Title lines={journey.title} id="journey-title" />
            <p className="lede">{journey.intro}</p>
          </div>
          <ol className="timeline">
            {journey.steps.map((s) => (
              <li key={s.date + s.title} data-reveal>
                <span className="timeline__date mono">{s.date}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.project && (
                    <a className="timeline__link mono" href={`/work/#${s.project}`}>
                      See the project
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="skills section" aria-labelledby="skills-title">
        <div className="wrap">
          <Label>Tools</Label>
          <h2 className="title" id="skills-title">
            <span className="title__a">The tools</span> <span className="title__b">we reach for.</span>
          </h2>
          <div className="skills__grid">
            {skills.map((g) => (
              <div key={g.title} className="skills__group" data-reveal>
                <h3>{g.title}</h3>
                <p className="small muted">{g.note}</p>
                <ul className="chips">
                  {g.items.map((x) => (
                    <li key={x} className="chip">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="partners partners--inline">
            <p className="label">Working with</p>
            <ul>
              {partners.map((p) => (
                <li key={p.name}>
                  <img src={p.logo} alt={`${p.name} logo`} width={96} height={121} loading="lazy" />
                  <span>{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Closing />
    </>
  );
}
