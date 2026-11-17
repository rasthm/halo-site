import {useState} from 'react';
import {demo, type RoleId, type SourceId} from '../content';
import {Check, Lock} from './Icons';

type LogLine = {t: string; text: string};
const label = (id: SourceId) => demo.sources.find((s) => s.id === id)!.label;

/**
 * The "brain settings" panel, made clickable. It is an illustration of how the controls work,
 * not a live system: the answers are written examples.
 */
export function BrainDemo() {
  const [on, setOn] = useState<Record<SourceId, boolean>>(() => Object.fromEntries(demo.sources.map((s) => [s.id, s.on])) as Record<SourceId, boolean>);
  const [role, setRole] = useState<RoleId>('sales');
  const [log, setLog] = useState<LogLine[]>([]);
  const r = demo.roles.find((x) => x.id === role)!;

  const stamp = () => new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  const toggle = (id: SourceId) => {
    const next = !on[id];
    setOn((o) => ({...o, [id]: next}));
    setLog((l) => [{t: stamp(), text: `${next ? 'Connected' : 'Disconnected'} ${label(id)}. ${next ? 'The brain starts learning from it.' : 'The brain stops learning from it.'}`}, ...l].slice(0, 3));
  };
  const pickRole = (id: RoleId) => {
    setRole(id);
    setLog((l) => [{t: stamp(), text: `Viewing the brain as ${demo.roles.find((x) => x.id === id)!.label}.`}, ...l].slice(0, 3));
  };

  const roleSources = new Set(r.sees.map((s) => s.source));
  const hidden = demo.sources.filter((s) => !roleSources.has(s.id));
  const missing = r.ask.uses.filter((u) => !on[u]);

  return (
    <div className="demo" role="group" aria-label="Brain settings, an illustration">
      <div className="demo__bar">
        <span className="demo__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mono">{demo.title}</span>
        <span className="demo__tag mono">{demo.label}</span>
      </div>

      <div className="demo__body">
        <fieldset className="demo__col">
          <legend className="demo__h mono">The brain learns from</legend>
          <ul className="demo__sources">
            {demo.sources.map((s) => (
              <li key={s.id}>
                <label className={`switch${on[s.id] ? ' is-on' : ''}${s.id === 'hr' ? ' is-sensitive' : ''}`}>
                  <input type="checkbox" role="switch" checked={on[s.id]} onChange={() => toggle(s.id)} />
                  <span className="switch__track" aria-hidden="true">
                    <span className="switch__thumb" />
                  </span>
                  <span className="switch__text">
                    <span className="switch__name">{s.label}</span>
                    <span className="switch__note">{s.note}</span>
                  </span>
                  <span className="switch__state mono">{on[s.id] ? 'On' : 'Off'}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className="demo__col">
          <p className="demo__h mono" id="demo-role">
            Viewing as
          </p>
          <div className="segmented" role="radiogroup" aria-labelledby="demo-role">
            {demo.roles.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={role === x.id} className={role === x.id ? 'is-on' : ''} onClick={() => pickRole(x.id)}>
                {x.label}
              </button>
            ))}
          </div>

          <p className="demo__h mono">Can see</p>
          <ul className="demo__sees" aria-live="polite">
            {r.sees.map((s) => {
              const learned = on[s.source];
              return (
                <li key={s.text} className={learned ? '' : 'is-off'}>
                  {learned ? <Check width={15} height={15} /> : <span className="demo__dash" aria-hidden="true" />}
                  <span>{s.text}</span>
                  <span className="demo__src mono">{learned ? label(s.source) : `${label(s.source)} is off`}</span>
                </li>
              );
            })}
          </ul>

          <p className="demo__h mono">Hidden from {r.label}</p>
          <ul className="demo__hidden">
            {hidden.map((s) => (
              <li key={s.id}>
                <Lock width={13} height={13} /> {s.label}
              </li>
            ))}
          </ul>

          <div className="demo__ask">
            <p className="demo__q">
              <span className="mono">{r.label} asks</span> {r.ask.q}
            </p>
            <p className="demo__a" aria-live="polite">
              {missing.length ? (
                <>I can’t answer that yet: {missing.map(label).join(' and ')} {missing.length > 1 ? 'are' : 'is'} switched off.</>
              ) : (
                r.ask.a
              )}
            </p>
            <p className="demo__cite mono">Sources: {r.ask.uses.map(label).join(' · ')}</p>
          </div>
        </div>
      </div>

      <div className="demo__log mono" aria-live="polite">
        <span className="demo__logh">Audit log</span>
        {log.length === 0 ? (
          <span className="demo__logline is-empty">Every change you make here is logged.</span>
        ) : (
          log.map((l, i) => (
            <span key={`${l.t}-${l.text}-${i}`} className="demo__logline">
              <b>{l.t}</b> {l.text}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
