import {agents, demo, hero, projectById, selectedWork} from '../content';
import {AgentCard} from '../components/AgentCard';
import {Architecture} from '../components/Architecture';
import {BrainDemo} from '../components/BrainDemo';
import {BrainStory} from '../components/BrainStory';
import {BookCall, Label, More, Title} from '../components/Common';
import {HaloField} from '../components/HaloField';
import {ArrowDown} from '../components/Icons';
import {ProjectCard} from '../components/Project';
import {Closing, Faq, PricingTeaser, Principles, ProcessShort, Stats} from '../components/Sections';

/** The entrance is CSS (it runs with the first paint, so nothing flashes); see .hero in styles.css. */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__text">
          <p className="label hero__kicker">
            <span className="label__dot" aria-hidden="true" />
            {hero.kicker}
          </p>
          <h1 className="hero__title" id="hero-title">
            {hero.title.map((l) => (
              <span key={l} className="hero__line hero__line--a">
                {l}{' '}
              </span>
            ))}
            <span className="hero__line hero__line--b">{hero.accent}</span>
          </h1>
          <p className="hero__sub lede">{hero.sub}</p>
          <div className="hero__actions actions">
            <BookCall className="btn btn--red btn--lg" />
            <a className="btn btn--ghost btn--lg" href="/brain/">
              See how the brain works
            </a>
          </div>
          <p className="hero__for mono">For operations heads, founders and MDs of growing companies · India · GCC · UK · US</p>
        </div>
        <div className="hero__field">
          <HaloField mode="scattered" label="Illustration: your systems, CRM, ERP, docs, email, chats and sheets, scattered and unconnected, with the Halo ring above them" />
        </div>
      </div>
      <a className="hero__scroll mono" href="#cost">
        <ArrowDown width={14} height={14} /> <span>Scroll: watch them connect</span>
      </a>
    </section>
  );
}

export function Home() {
  const picks = selectedWork.map(projectById);
  return (
    <>
      <Hero />
      <div id="cost">
        <Stats n="01" />
      </div>
      <BrainStory />

      <section className="demo-section section" aria-labelledby="demo-title">
        <div className="wrap demo-section__grid">
          <div className="section__head">
            <Label n="03">Try the controls</Label>
            <Title lines={['You decide what it learns', 'and who sees what.']} id="demo-title" />
            <p className="lede">{demo.intro}</p>
            <p className="small muted">HR & payroll starts switched off. Switch it on and look at the brain as Finance, then as Sales.</p>
          </div>
          <BrainDemo />
        </div>
      </section>

      <Architecture n="04" />

      <section className="agents-home section" aria-labelledby="agents-title">
        <div className="wrap">
          <div className="section__head section__head--row">
            <div>
              <Label n="05">Agents on top</Label>
              <Title lines={['Agents do the work.', 'You approve it.']} id="agents-title" />
            </div>
            <More href="/agents/">All six agents, step by step</More>
          </div>
          <div className="agents-grid">
            {agents.map((a, i) => (
              <AgentCard key={a.id} agent={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Principles n="06" />
      <ProcessShort n="07" />

      <section className="selected section" aria-labelledby="selected-title">
        <div className="wrap">
          <div className="section__head section__head--row">
            <div>
              <Label n="08">Selected work</Label>
              <Title lines={['Real systems,', 'already shipped.']} id="selected-title" />
            </div>
            <More href="/work/">All work</More>
          </div>
          <div className="selected__grid">
            {picks.map((p) => (
              <ProjectCard key={p.id} p={p} compact />
            ))}
          </div>
        </div>
      </section>

      <PricingTeaser n="09" />
      <Faq n="10" />
      <Closing />
    </>
  );
}
