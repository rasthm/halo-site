import {closing, faq, packages, pricing, principles, process, stats} from '../content';
import {money, usePublicInfo} from '../live';
import {BookCall, Label, More, Title} from './Common';
import {HaloField} from './HaloField';
import {Plus} from './Icons';

export function Stats({n}: {n?: string}) {
  return (
    <section className="stats section section--cream" aria-labelledby="stats-title">
      <div className="wrap">
        <Label n={n}>{stats.label}</Label>
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

export function Principles({n}: {n?: string}) {
  return (
    <section className="principles section" aria-labelledby="principles-title">
      <div className="wrap principles__grid">
        <div className="section__head">
          <Label n={n}>{principles.label}</Label>
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

export function ProcessShort({n}: {n?: string}) {
  return (
    <section className="process section" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section__head section__head--row">
          <div>
            <Label n={n}>{process.label}</Label>
            <Title lines={process.title} id="process-title" />
          </div>
          <More href="/how-we-work/">How we work, in detail</More>
        </div>
        <ol className="process__track">
          {process.steps.map((s) => (
            <li key={s.k} data-reveal>
              <span className="process__k mono">{s.k}</span>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PricingTeaser({n}: {n?: string}) {
  const {prices} = usePublicInfo();
  return (
    <section className="teaser section" aria-labelledby="teaser-title">
      <div className="wrap">
        <div className="section__head section__head--row">
          <div>
            <Label n={n}>{pricing.label}</Label>
            <Title lines={pricing.title} id="teaser-title" />
          </div>
          <More href="/pricing/">Build your package</More>
        </div>
        <ul className="teaser__grid">
          {packages.map((p) => (
            <li key={p.id} className="teaser__card" data-reveal>
              <p className="teaser__time mono">{p.time}</p>
              <h3>{p.name}</h3>
              <p className="teaser__text">{p.text}</p>
              <p className="teaser__price">
                <span className="mono">from</span> {money(prices[p.id])}
              </p>
            </li>
          ))}
          <li className="teaser__card teaser__card--brain" data-reveal>
            <p className="teaser__time mono">Per workflow</p>
            <h3>{pricing.brain.name}</h3>
            <p className="teaser__text">A brain over your systems, with agents and approvals on top.</p>
            <p className="teaser__price teaser__price--call">{pricing.brain.price}</p>
          </li>
        </ul>
        {prices.foundingDiscountPct > 0 && (
          <p className="teaser__founding mono">
            {pricing.founding}: {prices.foundingDiscountPct}% off the build for our first clients.
          </p>
        )}
      </div>
    </section>
  );
}

export function Faq({n}: {n?: string}) {
  return (
    <section className="faq section section--cream" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="section__head">
          <Label n={n}>Questions</Label>
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
        <div className="closing__text">
          <h2 className="closing__title" id="closing-title">
            <span>{closing.title}</span> <em>{closing.accent}</em>
          </h2>
          <p className="lede">{closing.text}</p>
          <div className="actions">
            <BookCall className="btn btn--red btn--lg" />
            <a className="btn btn--ghost btn--lg" href="/contact/">
              Send an enquiry
            </a>
          </div>
        </div>
        <div className="closing__field" aria-hidden="true">
          <HaloField mode="connected" label="" />
        </div>
      </div>
    </section>
  );
}
