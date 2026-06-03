import { Check, Cpu, Layers3 } from 'lucide-react';
import { skills, skillsIntro, tools } from '../data/siteData.js';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function SkillsTools() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeader
            kicker={skillsIntro.kicker}
            title={skillsIntro.title}
            copy={skillsIntro.body}
          />

          <Reveal className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-black/35 text-gold">
                  <Layers3 size={20} aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl font-bold text-white">Core skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-sm font-semibold text-white/72"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-carbon p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-black/35 text-teal">
                  <Cpu size={20} aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl font-bold text-white">Production stack</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                    <Check className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span className="text-sm font-semibold text-white/76">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
