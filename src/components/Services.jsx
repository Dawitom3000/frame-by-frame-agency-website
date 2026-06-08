import {
  Aperture,
  Camera,
  Clapperboard,
  Compass,
  Palette,
  Sparkles,
  Waves,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { services } from '../data/siteData.js';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

const icons = {
  aperture: Aperture,
  camera: Camera,
  clapperboard: Clapperboard,
  compass: Compass,
  palette: Palette,
  sparkles: Sparkles,
  waves: Waves,
};

export default function Services() {
  return (
    <section id="services" className="relative border-y border-white/10 bg-carbon/70 py-20 md:py-28">
      <div className="section-shell">
        <SectionHeader
          kicker="Services"
          title="Pick a format. We'll finish the piece."
        />

        <div className="grid gap-3 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = icons[service.icon] || Sparkles;
            return (
              <Reveal key={service.title} delay={index * 0.04}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="group h-full rounded-lg border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:border-gold/45 hover:bg-white/[0.06]"
                >
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 bg-black/35 text-gold transition group-hover:border-gold/45">
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <span className="text-sm font-semibold text-white/34">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-smoke">{service.description}</p>
                  <ul className="mt-6 grid gap-3 border-t border-white/10 pt-6">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-white/64">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
