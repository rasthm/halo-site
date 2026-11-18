import {useMemo, useState} from 'react';
import {categories, dives, partners, projectById, projects, workPage, type Category} from '../content';
import {PageHead, Title} from '../components/Common';
import {ProjectCard} from '../components/Project';
import {Closing} from '../components/Sections';

export function Work() {
  const [cat, setCat] = useState<Category>('all');
  const list = useMemo(() => (cat === 'all' ? projects : projects.filter((p) => p.categories.includes(cat))), [cat]);
  const count = (c: Category) => (c === 'all' ? projects.length : projects.filter((p) => p.categories.includes(c)).length);
  const proof = [
    {value: projects.length, label: 'projects shipped'},
    {value: projects.filter((p) => p.live).length, label: 'live and free to open'},
    {value: projects.filter((p) => p.code).length, label: 'with code on GitHub'},
  ];

  return (
    <>
      <PageHead label={workPage.label} lines={workPage.title} intro={workPage.intro}>
        <ul className="proof">
          {proof.map((p) => (
            <li key={p.label}>
              <span className="proof__v">{p.value}</span>
              <span className="proof__l mono">{p.label}</span>
            </li>
          ))}
        </ul>
      </PageHead>

      <section className="section section--tight" aria-label="Projects">
        <div className="wrap">
          <div className="filters" role="group" aria-label="Filter projects">
            {categories.map((c) => (
              <button key={c.id} type="button" className={`pill${cat === c.id ? ' is-on' : ''}`} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label} <span className="mono">{count(c.id)}</span>
              </button>
            ))}
          </div>
          <div className="work-grid" aria-live="polite">
            {list.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>

          <div className="partners">
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

      <section className="dives section" aria-labelledby="dives-title">
        <div className="wrap">
          <div className="section__head">
            <Title lines={workPage.divesTitle} id="dives-title" />
            <p className="lede">{workPage.divesIntro}</p>
          </div>
          <div className="dives__list">
            {dives.map((d) => (
              <details key={d.title} className="divecard" data-reveal>
                <summary>
                  <span className="divecard__hook mono">{d.hook}</span>
                  <span className="divecard__title">{d.title}</span>
                  <span className="divecard__plus" aria-hidden="true" />
                </summary>
                <div className="divecard__body">
                  <ol className="dive__flow mono" aria-label="How it flows">
                    {d.flow.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  {d.body.map((b) => (
                    <p key={b.slice(0, 24)}>{b}</p>
                  ))}
                  <ul className="chips">
                    {d.facts.map((f) => (
                      <li key={f} className="chip">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a className="more" href={`#${d.project}`}>
                    Project: {projectById(d.project).title}
                  </a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Closing />
    </>
  );
}
