import {pages, type PageId} from './content';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {useReveal} from './motion';
import {About} from './pages/About';
import {Agents} from './pages/Agents';
import {Brain} from './pages/Brain';
import {Home} from './pages/Home';
import {HowWeWork} from './pages/HowWeWork';
import {Pricing} from './pages/Pricing';
import {Contact, NotFound, Privacy} from './pages/Simple';
import {Work} from './pages/Work';

const VIEWS: Record<PageId, () => React.JSX.Element> = {
  home: Home,
  brain: Brain,
  agents: Agents,
  how: HowWeWork,
  work: Work,
  pricing: Pricing,
  about: About,
  contact: Contact,
  privacy: Privacy,
  notfound: NotFound,
};

/** Maps an address to a page. Anything unknown is the 404 page (the server sends 404.html for it, and this keeps hydration in step). */
export function pageFor(pathname: string) {
  const path = pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  return pages.find((p) => p.path === path) ?? {id: 'notfound' as const, path};
}

export default function App({pathname = '/'}: {pathname?: string}) {
  const page = pageFor(pathname);
  const View = VIEWS[page.id];
  useReveal(page.id);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header path={page.path} />
      <main id="main" className={`page page--${page.id}`}>
        <View />
      </main>
      <Footer />
    </>
  );
}
