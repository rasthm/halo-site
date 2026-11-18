import {brainBenefits, founder, hero, projectById, selectedWork} from '../content';
import {useRef} from 'react';
import {HeroCircuit, HeroLead, NeonBrain, ServiceCircuit} from '../components/Circuit';
import {BookCall, More, Title} from '../components/Common';
import {Results} from '../components/Growth';
import {WhatsApp} from '../components/Icons';
import {Neon} from '../components/Neon';
import {ProjectCard} from '../components/Project';
import {Closing, Faq, ProcessShort} from '../components/Sections';

/** The wall at night: the headline in sign-shop grotesk, "one team." as the lit tube, the circuit running on to every service. */
function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div ref={stage} className="wrap hero__grid">
        <HeroLead stage={stage} />
        <div className="hero__text">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__line">{hero.title.join(' ')}</span>{' '}
            <Neon text={hero.accent} electrodes className="hero__neon" />
          </h1>
          <p className="hero__sub">{hero.sub}</p>
          <div className="hero__actions">
            <BookCall className="btn btn--lit btn--lg" />
            <a className="btn btn--tube btn--lg" href={founder.whatsapp.url} target="_blank" rel="noopener">
              <WhatsApp width={18} height={18} />
              <span>WhatsApp us</span>
            </a>
          </div>
        </div>
        <HeroCircuit />
      </div>
    </section>
  );
}

function Brain() {
  return (
    <section className="hbrain section" id="brain" aria-labelledby="hbrain-title">
      <div className="wrap hbrain__grid">
        <div className="hbrain__art">
          <NeonBrain label="A brain bent from one neon tube" />
        </div>
        <div className="hbrain__text">
          <Title lines={['A company brain,', 'only yours.']} id="hbrain-title" />
          <p className="lede">A private AI that learns your business from the sources you pick and answers each person only as far as their role allows. It never trains public AI, and it stays when people leave.</p>
          <ul className="gains">
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
          <More href="/brain/">How the company brain works</More>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const picks = selectedWork.map(projectById);
  return (
    <>
      <Hero />

      <section className="services section" id="services" aria-labelledby="services-title">
        <div className="wrap services__grid">
          <div className="services__head">
            <Title lines={['Six things we build.', 'one circuit.']} id="services-title" />
            <p className="lede">Start with whatever hurts most today. It all comes from the same team, so the pieces fit: the site that brings the enquiry, the automation that answers it, the brain that knows the answer.</p>
          </div>
          <ServiceCircuit />
        </div>
      </section>

      <Results />
      <Brain />

      <section className="selected section" aria-labelledby="selected-title">
        <div className="wrap">
          <div className="section__head section__head--row">
            <Title lines={['Real work,', 'already shipped.']} id="selected-title" />
            <More href="/work/">All work</More>
          </div>
          <div className="selected__grid">
            {picks.map((p) => (
              <ProjectCard key={p.id} p={p} compact />
            ))}
          </div>
        </div>
      </section>

      <ProcessShort />
      <Faq />
      <Closing />
    </>
  );
}
