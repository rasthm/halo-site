import {contact, founder, privacy} from '../content';
import {BookCall, InstagramLink, PageHead} from '../components/Common';
import {EnquiryForm} from '../components/EnquiryForm';
import {ArrowRight, WhatsApp} from '../components/Icons';
import {Logo} from '../components/Logo';

export function Contact() {
  return (
    <section className="contact" aria-label="Contact">
      <div className="wrap contact__grid">
        <div className="contact__side">
          <PageHead label={contact.label} lines={contact.title} intro={contact.text} />
          <ul className="channels">
            <li>
              <span className="channels__k mono">Call</span>
              <BookCall className="channels__link">Book a 20-minute call</BookCall>
            </li>
            <li>
              <span className="channels__k mono">WhatsApp</span>
              <a className="channels__link" href={founder.whatsapp.url} target="_blank" rel="noopener">
                <WhatsApp width={16} height={16} /> <span>{founder.whatsapp.handle}</span>
              </a>
            </li>
            <li>
              <span className="channels__k mono">Instagram</span>
              <InstagramLink className="channels__link" />
            </li>
          </ul>
          <p className="small muted">
            Enquiries go to our private desk and nowhere else. See the <a className="inline" href="/privacy/">privacy page</a>.
          </p>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <>
      <PageHead label="Privacy" lines={['Plain privacy.', 'No cookies, no trackers.']} intro={`Last updated ${privacy.updated}. This is how the Halo Automations website handles what you send us.`} />
      <section className="section section--tight">
        <div className="wrap prose">
          {privacy.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.text.map((t) => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
            </section>
          ))}
          <p>
            <a className="inline" href={founder.whatsapp.url} target="_blank" rel="noopener">
              Message us on WhatsApp
            </a>{' '}
            with any question about your data.
          </p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="notfound" aria-labelledby="nf-title">
      <div className="wrap notfound__inner">
        <Logo className="logo--big" title="" />
        <p className="label">Error 404</p>
        <h1 className="title title--xl" id="nf-title">
          <span className="title__a">This page isn’t here.</span> <span className="title__b">The rest of the site is.</span>
        </h1>
        <div className="actions">
          <a className="btn btn--red btn--lg" href="/">
            <span>Go to the home page</span> <ArrowRight width={16} height={16} />
          </a>
          <a className="btn btn--ghost btn--lg" href="/work/">
            See the work
          </a>
        </div>
      </div>
    </section>
  );
}
