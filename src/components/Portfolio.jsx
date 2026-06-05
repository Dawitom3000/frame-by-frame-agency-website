import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import { selectedWork } from '../data/siteData.js';
import Button from './Button.jsx';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Portfolio() {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <section id="work" className="relative py-20 md:py-28">
      <div className="section-shell">
        <SectionHeader
          kicker="Selected Work"
          title="Some of what we've made."
        />

        <LayoutGroup>
          <motion.div layout className="mt-2 grid auto-rows-[18rem] gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {selectedWork.map((item, index) => (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.38, delay: index * 0.03 }}
                  className={`portfolio-card group relative overflow-hidden rounded-lg border border-white/10 bg-graphite ${
                    index === 0 ? 'md:row-span-2' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className="block h-full w-full text-left"
                    aria-label={`Open ${item.title}`}
                  >
                    <WorkVisual item={item} index={index} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full border border-white/14 bg-black/48 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {item.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="mb-2 text-sm font-semibold text-gold">{item.client}</p>
                      <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">{item.body}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white">
                        <Maximize2 size={16} aria-hidden="true" />
                        Preview
                      </span>
                    </div>
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <AnimatePresence>
        {activeItem ? <PortfolioModal item={activeItem} onClose={() => setActiveItem(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}

function PortfolioModal({ item, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/86 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-white/12 bg-carbon shadow-panel"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-white hover:text-black"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={19} />
        </button>

        <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative min-h-[280px] bg-black md:min-h-[560px]">
            <WorkVisual item={item} large />
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase text-gold">{item.tag}</p>
            <h3 className="mt-4 font-display text-4xl font-bold leading-tight text-white">{item.title}</h3>
            <p className="mt-3 text-sm font-semibold text-white/58">{item.client}</p>
            <p className="mt-5 text-base leading-8 text-smoke">{item.body}</p>
            <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-sm text-white/64">
              <p>
                <span className="font-semibold text-white">Case type:</span> {item.tag}
              </p>
              <p>
                <span className="font-semibold text-white">Status:</span> Ready for real metrics and final project media
              </p>
            </div>
            <Button href="#contact" className="mt-8" onClick={onClose}>
              Start Similar Project
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WorkVisual({ item, index = 0, large = false }) {
  const stripes = ['from-gold/24', 'from-electric/22', 'from-teal/18', 'from-ember/22'];

  if (item.image) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.imageAlt || item.client}
          className="h-full w-full object-cover brightness-[0.72] contrast-110 saturate-[0.86] transition duration-700 group-hover:scale-105 group-hover:brightness-[0.84]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/16 to-transparent" />
        {item.imageCaption ? (
          <p className="absolute bottom-4 left-4 right-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">
            {item.imageCaption}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] ${
        large ? 'p-8 md:p-10' : 'p-5'
      }`}
    >
      <div className="studio-grid absolute inset-0 opacity-[0.18]" aria-hidden="true" />
      <div
        className={`absolute -right-16 top-0 h-full w-1/2 bg-gradient-to-b ${stripes[index % stripes.length]} to-transparent blur-2xl`}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold uppercase text-white/36">
          <span>{item.client}</span>
          <span>{item.tag}</span>
        </div>
        <div className={large ? 'max-w-xl' : ''}>
          <p className="text-sm font-semibold uppercase text-gold">{item.tag}</p>
          <p className={`${large ? 'mt-4 text-5xl md:text-7xl' : 'mt-3 text-4xl'} font-display font-bold leading-none text-white/12`}>
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
}
