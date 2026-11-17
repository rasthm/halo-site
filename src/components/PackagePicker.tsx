import {useState} from 'react';
import {addons, packages, pricing, type AddonId, type BaseId} from '../content';
import {money, usePublicInfo} from '../live';
import {BookCall} from './Common';
import {ArrowRight, Check, Plus} from './Icons';

export type Selection = {base: BaseId; addons: AddonId[]; care: boolean};

/** The query string the contact page reads to pre-fill the chosen package. */
export const selectionQuery = (s: Selection) => {
  const q = new URLSearchParams({package: s.base});
  if (s.addons.length) q.set('addons', s.addons.join(','));
  if (s.care) q.set('care', '1');
  return `?${q.toString()}`;
};

export function PackagePicker() {
  const {prices} = usePublicInfo();
  const [sel, setSel] = useState<Selection>({base: 'mvp', addons: [], care: false});
  const basePrice = (id: BaseId) => prices[id];
  const toggle = (id: AddonId) => setSel((s) => ({...s, addons: s.addons.includes(id) ? s.addons.filter((a) => a !== id) : [...s.addons, id]}));

  const subtotal = basePrice(sel.base) + sel.addons.reduce((sum, a) => sum + prices.addons[a], 0);
  const pct = prices.foundingDiscountPct;
  const discounted = subtotal * (1 - pct / 100);
  const base = packages.find((p) => p.id === sel.base)!;

  return (
    <div className="picker">
      <div className="picker__choose">
        <fieldset className="picker__group">
          <legend className="picker__h">
            <span className="mono">Step 1</span> Pick one package
          </legend>
          <div className="picker__bases">
            {packages.map((p) => {
              const on = sel.base === p.id;
              return (
                <label key={p.id} className={`base${on ? ' is-on' : ''}`}>
                  <input type="radio" name="base" value={p.id} checked={on} onChange={() => setSel((s) => ({...s, base: p.id}))} />
                  <span className="base__top">
                    <span className="base__name">{p.name}</span>
                    <span className="base__time mono">{p.time}</span>
                  </span>
                  <span className="base__price">{money(basePrice(p.id))}</span>
                  <span className="base__text">{p.text}</span>
                  <span className="base__inc">
                    {p.includes.map((x) => (
                      <span key={x}>
                        <Check width={14} height={14} /> {x}
                      </span>
                    ))}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="picker__group">
          <legend className="picker__h">
            <span className="mono">Step 2</span> Add what you need
          </legend>
          <div className="picker__addons">
            {addons.map((a) => {
              const on = sel.addons.includes(a.id);
              return (
                <label key={a.id} className={`addon${on ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggle(a.id)} />
                  <span className="addon__box" aria-hidden="true">
                    {on ? <Check width={14} height={14} /> : <Plus width={14} height={14} />}
                  </span>
                  <span className="addon__text">
                    <span className="addon__name">{a.name}</span>
                    <span className="addon__note">{a.text}</span>
                  </span>
                  <span className="addon__price mono">+{money(prices.addons[a.id])}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="picker__group">
          <legend className="picker__h">
            <span className="mono">Step 3</span> Keep it running (optional)
          </legend>
          <label className={`addon addon--care${sel.care ? ' is-on' : ''}`}>
            <input type="checkbox" checked={sel.care} onChange={() => setSel((s) => ({...s, care: !s.care}))} />
            <span className="addon__box" aria-hidden="true">
              {sel.care ? <Check width={14} height={14} /> : <Plus width={14} height={14} />}
            </span>
            <span className="addon__text">
              <span className="addon__name">{pricing.care.name}</span>
              <span className="addon__note">{pricing.care.text}</span>
            </span>
            <span className="addon__price mono">{money(prices.carePlan)}/mo</span>
          </label>
        </fieldset>

        {/* Phones and tablets: the total stays in reach while choosing. */}
        <div className="picker__bar" aria-hidden="true">
          <span>
            <span className="mono">Estimate</span> <b>{money(discounted)}</b>
          </span>
          <a className="btn btn--red btn--sm" href={`/contact/${selectionQuery(sel)}`} tabIndex={-1}>
            Send this to us
          </a>
        </div>
      </div>

      <aside className="picker__total" aria-label="Your estimate">
        <div className="total" aria-live="polite">
          <p className="total__h mono">Your estimate</p>
          <ul className="total__lines">
            <li>
              <span>{base.name}</span>
              <span>{money(basePrice(sel.base))}</span>
            </li>
            {sel.addons.map((a) => (
              <li key={a}>
                <span>{addons.find((x) => x.id === a)!.name}</span>
                <span>{money(prices.addons[a])}</span>
              </li>
            ))}
            {pct > 0 && (
              <li className="total__discount">
                <span>
                  {pricing.founding} (−{pct}%)
                </span>
                <span>−{money(subtotal - discounted)}</span>
              </li>
            )}
          </ul>
          <p className="total__sum">
            {pct > 0 && <s className="total__was">{money(subtotal)}</s>}
            <span className="total__big">{money(discounted)}</span>
            <span className="total__unit mono">one-off</span>
          </p>
          {sel.care && (
            <p className="total__care mono">
              + {money(prices.carePlan)} a month for the care plan
            </p>
          )}
          <a className="btn btn--red btn--lg btn--block" href={`/contact/${selectionQuery(sel)}`}>
            <span>Send this to us</span> <ArrowRight width={16} height={16} />
          </a>
          <p className="total__note small">{pricing.note}</p>
        </div>

        <div className="brainprice">
          <p className="brainprice__price">{pricing.brain.price}</p>
          <h3>{pricing.brain.name}</h3>
          <p>{pricing.brain.text}</p>
          <BookCall className="btn btn--ghost btn--block" />
        </div>
      </aside>
    </div>
  );
}
