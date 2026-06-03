import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { agency, contact } from '../data/siteData.js';
import Button from './Button.jsx';
import Reveal from './Reveal.jsx';

export default function CTA() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form));

    const subject = encodeURIComponent(`Frame by Frame project inquiry - ${formData.projectType || 'General'}`);
    const body = encodeURIComponent(
      `Hi Frame by Frame,\n\n` +
        `Name: ${formData.name || ''}\n` +
        `Email: ${formData.email || ''}\n` +
        `Project Type: ${formData.projectType || ''}\n\n` +
        `Project Details:\n${formData.message || ''}\n`
    );

    setStatus(contact.loadingMessage);
    window.location.href = `mailto:${agency.email}?subject=${subject}&body=${body}`;
    setStatus(contact.successMessage);
    form.reset();
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-carbon py-20 md:py-28">
      <div className="studio-grid absolute inset-0 opacity-[0.08]" aria-hidden="true" />
      <div className="noise-layer absolute inset-0 opacity-[0.08]" aria-hidden="true" />

      <div className="section-shell relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase text-gold">{contact.kicker}</p>
          <h2 className="font-display text-5xl font-bold leading-[0.98] text-white md:text-7xl">
            {contact.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-smoke">{contact.body}</p>

          <div className="mt-8 grid gap-3 text-sm text-white/62">
            <a href={`mailto:${agency.email}`} className="inline-flex items-center gap-2 text-white transition hover:text-gold">
              <Mail size={16} aria-hidden="true" />
              {agency.email}
            </a>
            <p>{agency.location}</p>
          </div>

          <Button href={agency.upworkUrl} variant="secondary" icon={Send} target="_blank" rel="noreferrer" className="mt-8">
            Hire on Upwork
          </Button>
        </Reveal>

        <Reveal>
          <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-black/28 p-5 md:p-6">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Name</span>
              <input
                name="name"
                required
                autoComplete="name"
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-gold"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-gold"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Project Type</span>
              <select
                name="projectType"
                required
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-gold"
                defaultValue=""
              >
                <option value="" disabled>
                  Select one
                </option>
                {contact.projectOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Tell us about the project</span>
              <textarea
                name="message"
                required
                rows="6"
                placeholder="What are you working on? Tell us about the footage, the platform, and when you need it done."
                className="resize-none rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-gold"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/70 bg-gold px-5 py-3 text-sm font-bold text-black shadow-glow transition hover:border-white hover:bg-white"
            >
              <span>{contact.submitLabel}</span>
              <Send size={17} aria-hidden="true" />
            </button>

            <p className="min-h-6 text-sm font-semibold text-gold" aria-live="polite">
              {status}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
