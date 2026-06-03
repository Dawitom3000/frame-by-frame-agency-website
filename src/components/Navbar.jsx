import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { agency, navLinks } from '../data/siteData.js';
import Button from './Button.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-3 transition duration-300 ${
          scrolled
            ? 'border-white/12 bg-black/72 shadow-panel backdrop-blur-2xl'
            : 'border-white/10 bg-black/30 backdrop-blur-xl'
        }`}
        aria-label="Primary navigation"
      >
        <a href="#home" className="flex items-center gap-3 rounded-full pr-3" aria-label={`${agency.name} home`}>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white text-sm font-black text-black">
            {agency.shortName}
          </span>
          <span className="hidden font-display text-base font-bold text-white sm:inline">{agency.name}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/68 transition hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button href="#contact" variant="secondary" className="py-2.5">
            Start a Project
          </Button>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-3 max-w-6xl rounded-lg border border-white/10 bg-black/92 p-3 shadow-panel backdrop-blur-2xl md:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-3 text-base font-semibold text-white/80 transition hover:bg-white/[0.06] hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button href="#contact" className="mt-2 w-full" onClick={() => setOpen(false)}>
              Start a Project
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
