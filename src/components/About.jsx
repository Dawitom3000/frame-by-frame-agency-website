import { CheckCircle2 } from 'lucide-react';
import { proof } from '../data/siteData.js';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="section-shell">
        <SectionHeader
          kicker={proof.kicker}
          title={proof.title}
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Reveal className="relative min-h-[460px] overflow-hidden rounded-lg border border-white/10 bg-graphite p-6 md:p-8">
            <div className="studio-grid absolute inset-0 opacity-[0.10]" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-gold">Production philosophy</p>
                <h3 className="mt-5 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
                  We get footage across the finish line.
                </h3>
              </div>
              <div className="mt-10 grid gap-5 text-base leading-8 text-white/72">
                {proof.body.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid content-between gap-8">
            <Reveal className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
              {proof.pillars.map((pillar) => (
                <div key={pillar.label} className="bg-carbon p-6 md:p-8">
                  <p className="font-display text-3xl font-bold text-white md:text-4xl">{pillar.label}</p>
                  <p className="mt-3 text-sm leading-6 text-smoke">{pillar.description}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="rounded-lg border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                Small enough to care. Experienced enough to handle the full pipeline.
              </h3>
              <div className="mt-6 grid gap-4">
                {['Editing', 'Retouching', 'Color', 'Story', 'Delivery'].map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
                    <p className="text-base leading-7 text-smoke">{point}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
