import {disciplines, howPage, process} from '../content';
import {PageHead} from '../components/Common';
import {Lock} from '../components/Icons';
import {Closing, Faq} from '../components/Sections';

export function HowWeWork() {
  return (
    <>
      <PageHead label={howPage.label} lines={howPage.title} intro={howPage.intro} />

      <section className="section section--tight" aria-label="The four steps">
        <div className="wrap">
          <ol className="steps">
            {process.steps.map((s) => (
              <li key={s.k} className="step" data-reveal>
                <div className="step__head">
                  <span className="step__k">{s.k}</span>
                  <h2>{s.title}</h2>
                  <p>{s.short}</p>
                </div>
                <dl className="step__cols">
                  <div>
                    <dt className="mono">You give</dt>
                    <dd>{s.you}</dd>
                  </div>
                  <div>
                    <dt className="mono">We give</dt>
                    <dd>{s.we}</dd>
                  </div>
                  <div className="step__sec">
                    <dt className="mono">
                      <Lock width={13} height={13} /> Security in this step
                    </dt>
                    <dd>{s.security}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="disciplines section" aria-labelledby="disc-title">
        <div className="wrap">
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

      <Faq />
      <Closing />
    </>
  );
}
