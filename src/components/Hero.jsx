import { Play, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { hero, heroHighlights } from '../data/siteData.js';
import Button from './Button.jsx';

export default function Hero() {
  return (
    <section id="home" className="relative isolate min-h-[92svh] overflow-hidden pt-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_16%,rgba(216,168,83,0.18),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(97,184,255,0.12),transparent_32%),linear-gradient(135deg,#050505_0%,#0c0d0f_42%,#050505_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.90),rgba(5,5,5,0.58)_48%,rgba(5,5,5,0.88)),linear-gradient(180deg,rgba(5,5,5,0.16),rgba(5,5,5,0.94)_90%)]" />
      <div className="noise-layer pointer-events-none absolute inset-0 -z-10 opacity-[0.13]" />
      <div className="studio-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3 opacity-[0.10]" />

      <motion.div
        aria-hidden="true"
        className="absolute right-[8%] top-28 hidden h-[62vh] w-[24vw] min-w-[280px] overflow-hidden border border-white/10 bg-black/18 backdrop-blur-[1px] lg:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-4 border border-white/10" />
        <div className="absolute left-8 right-8 top-10 grid gap-3">
          {['Brief', 'Footage', 'Story', 'Edit', 'Delivery'].map((item, index) => (
            <div key={item} className="flex items-center justify-between border-b border-white/10 py-3">
              <span className="text-xs font-semibold uppercase text-white/42">{item}</span>
              <span className="text-xs text-gold">{String(index + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 h-full w-px bg-gold/80" />
        <div className="absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
      </motion.div>

      <div className="section-shell flex min-h-[calc(92svh-7rem)] flex-col justify-end pb-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <p className="mb-5 text-sm font-semibold uppercase text-gold md:text-base">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-[0.9] text-white sm:text-7xl md:text-8xl lg:text-9xl">
            {hero.h1Lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-2xl font-display text-2xl font-bold leading-tight text-white md:text-3xl">
            {hero.line}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 md:text-xl">
            {hero.copy}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#contact" icon={Send}>
              {hero.primaryCta}
            </Button>
            <Button href="#work" variant="secondary" icon={Play}>
              {hero.secondaryCta}
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {heroHighlights.map((item) => (
            <div key={item.label} className="bg-black/56 px-4 py-4 backdrop-blur-xl">
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-white/58">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
