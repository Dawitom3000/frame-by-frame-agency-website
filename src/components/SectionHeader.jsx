import Reveal from './Reveal.jsx';

export default function SectionHeader({ kicker, title, copy, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <Reveal className={`mb-10 max-w-3xl md:mb-16 ${alignment}`}>
      <p className="mb-4 text-sm font-semibold uppercase text-gold">{kicker}</p>
      <h2 className="font-display text-4xl font-bold leading-[1.02] text-white md:text-6xl">
        {title}
      </h2>
      {copy ? <p className="mt-5 max-w-2xl text-base leading-8 text-smoke md:text-lg">{copy}</p> : null}
    </Reveal>
  );
}
