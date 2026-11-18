import {brainPage, demo, dives, projectById} from '../content';
import {Architecture} from '../components/Architecture';
import {BrainDemo} from '../components/BrainDemo';
import {BookCall, More, Title} from '../components/Common';
import {NeonBrain} from '../components/Circuit';
import {BrainBenefits} from '../components/Growth';
import {Closing, Principles, Stats} from '../components/Sections';

export function Brain() {
  const dive = dives[0];
  const project = projectById(dive.project);
  return (
    <>
      <section className="pagehero" aria-labelledby="page-title">
        <div className="wrap pagehero__grid">
          <div>
            <Title lines={brainPage.title} as="h1" id="page-title" className="title--xl" />
            <p className="lede">{brainPage.intro}</p>
            <div className="actions">
              <BookCall className="btn btn--red btn--lg" />
              <a className="btn btn--ghost btn--lg" href="#settings">
                Try the settings
              </a>
            </div>
          </div>
          <div className="pagehero__field">
            <NeonBrain label="A brain bent from one neon tube" />
          </div>
        </div>
      </section>

      <BrainBenefits />
      <Stats />

      <section className="learns section" aria-labelledby="learns-title">
        <div className="wrap learns__grid">
          <div className="section__head">
            <Title lines={brainPage.learns.title} id="learns-title" />
          </div>
          <ul className="learns__list">
            {brainPage.learns.items.map((x) => (
              <li key={x.src} data-reveal>
                <span className="learns__src mono">{x.src}</span>
                <p>{x.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="demo-section section" id="settings" aria-labelledby="demo-title">
        <div className="wrap demo-section__grid">
          <div className="section__head">
            <Title lines={['Switch a source off.', 'Watch the answers change.']} id="demo-title" />
            <p className="lede">{demo.intro}</p>
          </div>
          <BrainDemo />
        </div>
      </section>

      <section className="facts section section--cream" aria-labelledby="facts-title">
        <div className="wrap">
          <h2 className="title" id="facts-title">
            <span className="title__a">The questions your</span> <span className="title__b">IT lead will ask.</span>
          </h2>
          <div className="facts__grid">
            {brainPage.facts.map((f) => (
              <article key={f.title} className="facts__col" data-reveal>
                <h3>{f.title}</h3>
                <ul>
                  {f.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Architecture />

      <section className="dive section" aria-labelledby="dive-title">
        <div className="wrap dive__grid">
          <div>
            <h2 className="title" id="dive-title">
              <span className="title__a">{dive.title}</span>
            </h2>
            <ol className="dive__flow mono" aria-label="How it flows">
              {dive.flow.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="dive__body">
            {dive.body.map((b) => (
              <p key={b.slice(0, 24)}>{b}</p>
            ))}
            <ul className="chips">
              {dive.facts.map((f) => (
                <li key={f} className="chip">
                  {f}
                </li>
              ))}
            </ul>
            <More href={`/work/#${project.id}`}>See {project.title} on the Work page</More>
          </div>
        </div>
      </section>

      <Principles />
      <Closing />
    </>
  );
}
