import {useEffect, useRef, useState, type FormEvent} from 'react';
import {addons, contact, founder, NEEDS, packages, type AddonId, type BaseId} from '../content';
import type {Selection} from './PackagePicker';
import {ArrowRight, Check, Close, WhatsApp} from './Icons';

type Status = {kind: 'idle' | 'sending'} | {kind: 'sent'} | {kind: 'error'; message: string};
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reads ?package=mvp&addons=logins,mcp&care=1 (sent by the pricing page). Unknown ids are ignored. */
function readSelection(search: string): Selection | null {
  const q = new URLSearchParams(search);
  const base = q.get('package') as BaseId | null;
  if (!base || !packages.some((p) => p.id === base)) return null;
  const ids = (q.get('addons') || '').split(',').filter((a): a is AddonId => addons.some((x) => x.id === a));
  return {base, addons: [...new Set(ids)], care: q.get('care') === '1'};
}

const describe = (s: Selection) =>
  [packages.find((p) => p.id === s.base)!.name, ...s.addons.map((a) => addons.find((x) => x.id === a)!.name)].join(' + ') + (s.care ? ' · with care plan' : '');

function check(f: FormData): Errors {
  const e: Errors = {};
  if (String(f.get('name') || '').trim().length < 2) e.name = 'Please add your name.';
  if (!EMAIL.test(String(f.get('email') || '').trim())) e.email = 'Please add a valid email, like you@company.com, so we can reply.';
  if (String(f.get('message') || '').trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).';
  return e;
}

/** The enquiry form: posts to /api/enquiry, which hands it to the desk as a [Halo] enquiry. */
export function EnquiryForm() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [pkg, setPkg] = useState<Selection | null>(null);
  const [status, setStatus] = useState<Status>({kind: 'idle'});
  const [errors, setErrors] = useState<Errors>({});
  const startedAt = useRef(0);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const s = readSelection(window.location.search);
    if (!s) return;
    setPkg(s);
    setNeeds((n) => {
      const need = s.base === 'launch' ? 'Website or launch page' : s.base === 'mvp' ? 'Web app or MVP' : 'AI agents & automations';
      return n.includes(need) ? n : [...n, need];
    });
  }, []);

  const touch = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };
  const toggle = (n: string) => setNeeds((xs) => (xs.includes(n) ? xs.filter((x) => x !== n) : [...xs, n]));
  const blur = (field: keyof Errors) => {
    if (!form.current) return;
    const e = check(new FormData(form.current));
    setErrors((old) => ({...old, [field]: e[field]}));
  };

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const e = check(f);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      ev.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({kind: 'sending'});
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          company: f.get('company'),
          message: f.get('message'),
          website: f.get('website'),
          needs,
          package: pkg,
          startedAt: startedAt.current || Date.now(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {ok?: boolean; error?: string};
      if (!res.ok || !data.ok) throw new Error(data.error || 'Sending failed. Please try again, or message us on WhatsApp.');
      setStatus({kind: 'sent'});
    } catch (err) {
      setStatus({kind: 'error', message: err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'We couldn’t reach the server. Please check your connection and try again.'});
    }
  }

  if (status.kind === 'sent')
    return (
      <div className="enquiry enquiry--sent" role="status">
        <span className="enquiry__done" aria-hidden="true">
          <Check width={24} height={24} />
        </span>
        <h2 className="enquiry__title">Thank you. It’s with us.</h2>
        <p>Your enquiry reached our desk. We’ll reply to the email you gave, usually within a day.</p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus({kind: 'idle'})}>
          Send another
        </button>
      </div>
    );

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className="field__error" id={`${k}-error`}>
        {errors[k]}
      </span>
    ) : null;

  return (
    <form ref={form} className="enquiry" onSubmit={submit} onFocus={touch} noValidate>
      <h2 className="enquiry__title">Send us an enquiry</h2>

      {pkg && (
        <div className="enquiry__pkg">
          <span className="mono">Chosen package</span>
          <p>{describe(pkg)}</p>
          <button type="button" className="enquiry__pkgx" onClick={() => setPkg(null)} aria-label="Remove the chosen package">
            <Close width={16} height={16} />
          </button>
        </div>
      )}

      <div className="enquiry__row">
        <label className={`field${errors.name ? ' has-error' : ''}`}>
          <span className="field__label">Your name</span>
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" onBlur={() => blur('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
          {err('name')}
        </label>
        <label className={`field${errors.email ? ' has-error' : ''}`}>
          <span className="field__label">Work email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" onBlur={() => blur('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          {err('email')}
        </label>
      </div>

      <label className="field">
        <span className="field__label">
          Company <span className="field__opt">optional</span>
        </span>
        <input name="company" maxLength={120} autoComplete="organization" />
      </label>

      <fieldset className="field">
        <legend className="field__label">What do you need?</legend>
        <div className="needs">
          {NEEDS.map((n) => {
            const on = needs.includes(n);
            return (
              <label key={n} className={`need${on ? ' is-on' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(n)} />
                <span className="need__box" aria-hidden="true">
                  {on && <Check width={13} height={13} />}
                </span>
                {n}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className={`field${errors.message ? ' has-error' : ''}`}>
        <span className="field__label">Tell us about it</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={6} placeholder={contact.placeholder} onBlur={() => blur('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
        {err('message')}
      </label>

      {/* Hidden from people; bots tend to fill it in. */}
      <label className="enquiry__trap" aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="enquiry__foot">
        <button type="submit" className="btn btn--red btn--lg" disabled={status.kind === 'sending'}>
          <span>{status.kind === 'sending' ? 'Sending…' : 'Send enquiry'}</span> <ArrowRight width={16} height={16} />
        </button>
        <a className="link-quiet" href={founder.whatsapp.url} target="_blank" rel="noopener">
          <WhatsApp width={16} height={16} /> <span>or message us on WhatsApp</span>
        </a>
      </div>
      {status.kind === 'error' && (
        <p className="enquiry__error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}
