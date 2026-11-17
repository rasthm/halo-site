import {architecture} from '../content';
import {Label, Title} from './Common';

/** Sources → connectors → brain → agents → human approval → back into your systems, drawn in HTML so every word stays text. */
export function Architecture({n, heading = true}: {n?: string; heading?: boolean}) {
  return (
    <section className="arch section" aria-labelledby="arch-title">
      <div className="wrap">
        {heading && (
          <div className="section__head">
            <Label n={n}>{architecture.label}</Label>
            <Title lines={architecture.title} id="arch-title" />
            <p className="lede">{architecture.intro}</p>
          </div>
        )}
        {!heading && (
          <h2 className="sr-only" id="arch-title">
            {architecture.label}
          </h2>
        )}

        <ol className="arch__flow" data-reveal>
          {architecture.stages.map((s, i) => (
            <li key={s.id} className={`arch__stage arch__stage--${s.id}`} style={{['--i' as string]: i}}>
              <div className="arch__card">
                <p className="arch__n mono">{String(i + 1).padStart(2, '0')}</p>
                {s.id === 'brain' && (
                  <svg className="arch__ring" viewBox="0 0 120 30" aria-hidden="true">
                    <ellipse cx="60" cy="15" rx="52" ry="10" />
                  </svg>
                )}
                <h3>{s.title}</h3>
                <ul>
                  {s.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="arch__tech mono">{s.tech}</p>
              </div>
              {i < architecture.stages.length - 1 && <span className="arch__arrow" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <div className="arch__loop mono" aria-hidden="true">
          <span>results flow back into the systems you already use</span>
        </div>

        <div className="arch__stack" data-reveal>
          <p className="label">{architecture.stack.label}</p>
          <ul className="chips">
            {architecture.stack.items.map((x) => (
              <li key={x} className="chip">
                {x}
              </li>
            ))}
          </ul>
          <p className="small muted">{architecture.stack.note}</p>
        </div>
      </div>
    </section>
  );
}
