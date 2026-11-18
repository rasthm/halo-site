import {agents, agentsPage} from '../content';
import {AgentCard} from '../components/AgentCard';
import {BookCall, PageHead, Title} from '../components/Common';
import {Closing, Principles} from '../components/Sections';

export function Agents() {
  return (
    <>
      <PageHead label={agentsPage.label} lines={agentsPage.title} intro={agentsPage.intro}>
        <ul className="agent-index mono" aria-label="The six agents">
          {agents.map((a, i) => (
            <li key={a.id}>
              <a href={`#${a.id}`}>
                <span>{String(i + 1).padStart(2, '0')}</span> {a.name}
              </a>
            </li>
          ))}
        </ul>
      </PageHead>

      <section className="section section--tight" aria-label="The agents">
        <div className="wrap agents-list">
          {agents.map((a, i) => (
            <AgentCard key={a.id} agent={a} index={i} full />
          ))}
        </div>
      </section>

      <section className="built section section--cream" aria-labelledby="built-title">
        <div className="wrap built__grid">
          <div className="section__head">
            <Title lines={agentsPage.built.title} id="built-title" />
            <BookCall className="btn btn--ink btn--lg">Talk about your workflow</BookCall>
          </div>
          <ol className="built__list">
            {agentsPage.built.items.map((b, i) => (
              <li key={b.title} data-reveal>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Principles />
      <Closing />
    </>
  );
}
