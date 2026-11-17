import {useCallback, useEffect, useRef, useState} from 'react';
import {brainStory} from '../content';
import {loadGsap, prefersReduced} from '../motion';
import {Label, Title} from './Common';
import {HaloField} from './HaloField';

/**
 * Home, chapter 3: the scattered systems connect into the brain as you scroll.
 * The section is tall and its stage is sticky (CSS); the scroll position drives the drawing (GSAP ScrollTrigger).
 * Without JS or with reduced motion the section is normal height and shows the connected brain.
 */
export function BrainStory() {
  const section = useRef<HTMLElement>(null);
  const setter = useRef<((p: number) => void) | null>(null);
  const [step, setStep] = useState(2);
  const [scrub, setScrub] = useState(false);
  const onReady = useCallback((set: (p: number) => void) => {
    setter.current = set;
  }, []);

  useEffect(() => {
    if (prefersReduced()) return;
    setScrub(true);
    setStep(0);
    setter.current?.(0);
    let kill = () => {};
    loadGsap().then(({ScrollTrigger}) => {
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = Math.min(1, self.progress * 1.18);
          setter.current?.(p);
          setStep(p < 0.3 ? 0 : p < 0.72 ? 1 : 2);
        },
      });
      kill = () => st.kill();
    });
    return () => kill();
  }, []);

  return (
    <section ref={section} className={`story${scrub ? ' is-scrub' : ''}`} id="brain" aria-labelledby="story-title">
      <div className="story__stage">
        <div className="wrap story__grid">
          <div className="story__text">
            <Label n="02">{brainStory.label}</Label>
            <Title lines={brainStory.title} id="story-title" />
            <ol className="story__steps">
              {brainStory.steps.map((s, i) => (
                <li key={s.k} className={i === step ? 'is-on' : i < step ? 'is-past' : ''}>
                  <span className="story__k mono">{s.k}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="story__field">
            <HaloField mode="scroll" onReady={onReady} />
          </div>
        </div>
      </div>
    </section>
  );
}
