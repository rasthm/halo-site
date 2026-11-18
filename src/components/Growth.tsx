import {useState} from 'react';
import {brainBenefits, currencies, results} from '../content';
import {Title} from './Common';

const clampNum = (v: number, lo: number, hi: number) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : lo);
const WEEKS_PER_MONTH = 52 / 12;

function Field({label, value, min, max, step = 1, suffix, onChange}: {label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void}) {
  const id = `calc-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="calc__field">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id} className="mono">
          {value.toLocaleString('en-US')}
          {suffix}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{['--fill' as string]: `${(((value - min) / (max - min)) * 100).toFixed(1)}%`}}
        onChange={(e) => onChange(clampNum(Number(e.target.value), min, max))}
      />
    </div>
  );
}

/** The savings estimate: the visitor's own numbers, multiplied. Nothing here is a client result. */
function Calculator() {
  const [people, setPeople] = useState(5);
  const [hours, setHours] = useState(7);
  const [share, setShare] = useState(50);
  const [cur, setCur] = useState(0);
  const [rate, setRate] = useState<number>(currencies[0].rate);
  const c = currencies[cur];

  const hoursMonth = people * hours * WEEKS_PER_MONTH * (share / 100);
  const moneyMonth = hoursMonth * rate;
  const daysPerPerson = hoursMonth / people / 8;
  const fmt = (v: number) => `${c.symbol}${Math.round(v).toLocaleString(c.locale)}`;

  return (
    <div className="calc" data-reveal>
      <div className="calc__head">
        <h3>{results.calc.title}</h3>
      </div>
      <div className="calc__inputs">
        <Field label="People doing the repeated work" value={people} min={1} max={50} onChange={setPeople} />
        <Field label="Hours each, per week" value={hours} min={1} max={30} suffix=" h" onChange={setHours} />
        <Field label="Share of that work automated" value={share} min={20} max={80} step={5} suffix="%" onChange={setShare} />
        <div className="calc__field calc__rate">
          <label htmlFor="calc-rate">
            <span>Cost of one hour of their time</span>
          </label>
          <div className="calc__rateRow">
            <select
              aria-label="Currency"
              value={cur}
              onChange={(e) => {
                const i = Number(e.target.value);
                setCur(i);
                setRate(currencies[i].rate);
              }}
            >
              {currencies.map((x, i) => (
                <option key={x.id} value={i}>
                  {x.id}
                </option>
              ))}
            </select>
            <input id="calc-rate" type="number" inputMode="decimal" min={1} max={100000} value={rate} onChange={(e) => setRate(clampNum(Number(e.target.value), 0, 100000))} />
          </div>
        </div>
      </div>
      <dl className="calc__out" aria-live="polite">
        <div>
          <dt>Hours back, every month</dt>
          <dd>{Math.round(hoursMonth).toLocaleString('en-US')} h</dd>
        </div>
        <div>
          <dt>Saved per month</dt>
          <dd>{fmt(moneyMonth)}</dd>
        </div>
        <div className="calc__big">
          <dt>Saved per year</dt>
          <dd>{fmt(moneyMonth * 12)}</dd>
        </div>
        <div>
          <dt>Working days back, per person per month</dt>
          <dd>{daysPerPerson.toFixed(1)}</dd>
        </div>
      </dl>
      <p className="calc__note small muted">{results.calc.note}</p>
      <p className="calc__anchor small">
        {results.calc.anchor.text} <span className="mono">Source: {results.calc.anchor.source}</span>
      </p>
    </div>
  );
}

/** "What you gain": when you see which numbers, and an estimate from your own. */
export function Results() {
  return (
    <section className="results section section--cream" id="results" aria-labelledby="results-title">
      <div className="wrap">
        <div className="section__head">
          <Title lines={results.title} id="results-title" />
          <p className="lede">{results.intro}</p>
        </div>
        <ol className="gain">
          {results.timeline.map((t, i) => (
            <li key={t.when} className="gain__step" data-reveal style={{['--i' as string]: i}}>
              <h3>{t.title}</h3>
              <p className="gain__text">{t.text}</p>
              <ul className="gain__nums">
                {t.numbers.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="results__calc">
          <Calculator />
          <div className="report" data-reveal>
            <h3 className="report__title">{results.report.title}</h3>
            <ul className="report__list">
              {results.report.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="small muted">Same numbers every week, next to the baseline from week one. If a number doesn’t move, we say so and fix it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Why a company brain pays: what changes for the team, and what we measure for each. */
export function BrainBenefits() {
  return (
    <section className="benefits section" aria-labelledby="benefits-title">
      <div className="wrap">
        <div className="section__head">
          <Title lines={brainBenefits.title} id="benefits-title" />
        </div>
        <ul className="gains gains--wide">
          {brainBenefits.items.map((b) => (
            <li key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              <p className="gains__m">
                <span className="mono">We measure</span> {b.measure}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
