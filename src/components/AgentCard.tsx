import {useEffect, useRef, useState} from 'react';
import type {Agent} from '../content';
import {loadGsap, prefersReduced} from '../motion';
import {Check, Person} from './Icons';

/**
 * One agent as a flow: trigger → steps → a person approves → result.
 * With motion allowed, the full card plays the flow once when it scrolls into view, pausing on the approval
 * step, so the "a person decides" moment is the one you notice.
 */
export function AgentCard({agent, full = false, index}: {agent: Agent; full?: boolean; index: number}) {
  const root = useRef<HTMLElement>(null);
  const [approved, setApproved] = useState(true);

  useEffect(() => {
    if (!full || prefersReduced()) return;
    const el = root.current!;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>('.flow__node'));
    let tl: {kill(): void} | undefined;
    setApproved(false);
    el.classList.add('is-armed');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        loadGsap().then(({gsap}) => {
          const t = gsap.timeline({delay: 0.2});
          nodes.forEach((n, i) => {
            const isApproval = n.classList.contains('flow__node--approval');
            t.call(() => n.classList.add('is-lit'), [], i === 0 ? 0 : '+=0.34');
            if (isApproval) t.call(() => setApproved(true), [], '+=0.9');
          });
          tl = t;
        }).catch(() => {
          nodes.forEach((n) => n.classList.add('is-lit'));
          setApproved(true);
        });
      },
      {threshold: 0.5},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tl?.kill();
    };
  }, [full]);

  // The short card (home) folds the agent's steps into one line.
  const nodes = [
    {kind: 'trigger', text: agent.trigger},
    ...(full ? agent.steps.map((s) => ({kind: 'step', text: s})) : [{kind: 'step', text: agent.steps.map((s, i) => (i ? s[0].toLowerCase() + s.slice(1) : s)).join(', ')}]),
    {kind: 'approval', text: agent.approval},
    {kind: 'result', text: agent.result},
  ];

  return (
    <article ref={root} className={`agent${full ? ' agent--full' : ''}`} id={agent.id} data-reveal>
      <header className="agent__head">
        <span className="agent__n mono">{String(index + 1).padStart(2, '0')}</span>
        <h3>{agent.name}</h3>
        <p>{agent.job}</p>
      </header>
      <ol className="flow">
        {nodes.map((n, i) => (
          <li key={i} className={`flow__node flow__node--${n.kind}`}>
            <span className="flow__kind mono">
              {n.kind === 'trigger' ? 'When' : n.kind === 'approval' ? (approved ? 'A person approves' : 'Waiting for a yes') : n.kind === 'result' ? 'Then' : 'Agent'}
            </span>
            <span className="flow__text">
              {n.kind === 'approval' && <Person width={15} height={15} />}
              {n.kind === 'result' && <Check width={15} height={15} />}
              {n.text}
            </span>
          </li>
        ))}
      </ol>
      {full && (
        <dl className="agent__rules">
          <div>
            <dt className="mono">Does on its own</dt>
            <dd>{agent.alone}</dd>
          </div>
          <div>
            <dt className="mono">Needs a yes</dt>
            <dd>{agent.needsYes}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}
