import {pricing} from '../content';
import {PackagePicker} from '../components/PackagePicker';
import {PageHead} from '../components/Common';
import {Closing, Faq} from '../components/Sections';

export function Pricing() {
  return (
    <>
      <PageHead label={pricing.label} lines={pricing.title} intro={pricing.intro} />
      <section className="section section--tight" aria-label="Package picker">
        <div className="wrap">
          <PackagePicker />
        </div>
      </section>
      <Faq />
      <Closing />
    </>
  );
}
