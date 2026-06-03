import { ArrowDownRight } from 'lucide-react';
import { processSteps } from '../data/siteData.js';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Process() {
  return (
    <section id="process" className="relative py-20 md:py-28">
      <div className="section-shell">
        <SectionHeader
          kicker="How It Works"
          title="No mystery. Just four steps."
        />

        <div className="relative">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-white/10 md:block" />
          <div className="grid gap-4">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-gold/40 hover:bg-white/[0.055] md:grid-cols-[120px_1fr_40px] md:items-center md:p-6 md:pl-12">
                  <div>
                    <span className="text-sm font-semibold text-gold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">{step.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-smoke">{step.description}</p>
                  </div>
                  <ArrowDownRight className="hidden text-white/34 md:block" aria-hidden="true" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
