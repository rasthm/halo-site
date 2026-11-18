import {closing, faq, founder, principles, process, stats} from '../content';
import {BookCall, More, Title} from './Common';
import {OpenSign} from './Circuit';
import {Plus, WhatsApp} from './Icons';

export function Stats() {
  return (
    <section className="stats section section--cream" aria-labelledby="stats-title">
      <div className="wrap">
        <h2 className="stats__lead" id="stats-title">
          {stats.lead.map((l, i) => (
            <span key={l} className={i === stats.lead.length - 1 ? 'is-accent' : ''}>
              {l}{' '}
            </span>
          ))}
        </h2>
        <ul className="stats__grid">
          {stats.items.map((s) => (
            <li key={s.value} className="stat" data-reveal>
              <p className="stat__value">
                {s.prefix && <span className="stat__prefix">{s.prefix}</span>}
                {s.value}
              </p>
              <p className="stat__text">{s.text}</p>
              <p className="stat__source mono">Source: {s.source}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Principles() {
  return (
    <section className="principles section" aria-labelledby="principles-title">
      <div className="wrap principles__grid">
        <div className="section__head">
          <Title lines={principles.title} id="principles-title" />
        </div>
        <ol className="principles__list">
          {principles.items.map((p, i) => (
            <li key={p.title} data-reveal>
              <span className="principles__n mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProcessShort() {
  return (
    <section className="process section" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section__head section__head--row">
          <div>
            <Title lines={process.title} id="process-title" />
          </div>
          <More href="/how-we-work/">How we work, in detail</More>
        </div>
        <ol className="process__track">
          {process.steps.map((s) => (
            <li key={s.k} data-reveal>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="faq section section--cream" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="section__head">
          <h2 className="title" id="faq-title">
            <span className="title__a">Asked before</span> <span className="title__b">every first call.</span>
          </h2>
        </div>
        <div className="faq__list">
          {faq.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>
                <span>{f.q}</span>
                <Plus width={20} height={20} />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="wrap closing__grid">
        <OpenSign text={closing.accent} />
        <div className="closing__text">
          <h2 className="closing__title" id="closing-title">
            {closing.title}
          </h2>
          <p className="lede">{closing.text}</p>
          <div className="actions">
            <BookCall className="btn btn--lit btn--lg" />
            <a className="btn btn--tube btn--lg" href={founder.whatsapp.url} target="_blank" rel="noopener">
              <WhatsApp width={18} height={18} />
              <span>WhatsApp us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
