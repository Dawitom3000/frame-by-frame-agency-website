import { ArrowUpRight } from 'lucide-react';
import { agency, navLinks, socialLinks } from '../data/siteData.js';

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-10 text-white md:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div>
          <a href="#home" className="font-display text-2xl font-bold">
            {agency.name}
          </a>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/54">
            Your footage. Finished.
          </p>
          <p className="mt-5 text-sm text-white/42">
            Copyright 2025 {agency.name}. Addis Ababa &amp; worldwide.
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-white/58 transition hover:text-white">
              {link.label}
            </a>
          ))}
          <a href={`mailto:${agency.email}`} className="text-white/58 transition hover:text-white">
            {agency.email}
          </a>
          <a
            href={agency.founderPortfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white/58 transition hover:text-white"
          >
            <span>Founder Portfolio</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-3 text-sm">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('#') ? undefined : '_blank'}
              rel={link.href.startsWith('#') ? undefined : 'noreferrer'}
              className="inline-flex items-center gap-2 text-white/58 transition hover:text-white"
            >
              <span>{link.label}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
          <span className="text-white/42">{agency.location}</span>
        </div>
      </div>
    </footer>
  );
}
