import { intro } from '../data/siteData.js';
import Reveal from './Reveal.jsx';

export default function Intro() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase text-gold">{intro.kicker}</p>
          <h2 className="font-display text-4xl font-bold leading-[1.02] text-white md:text-6xl">
            {intro.title}
          </h2>
        </Reveal>

        <Reveal className="grid gap-6">
          {intro.points.map((point) => (
            <p key={point} className="border-l-2 border-gold/45 pl-5 text-base leading-8 text-smoke md:text-lg">
              {point}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
