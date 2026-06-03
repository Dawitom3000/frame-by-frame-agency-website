import { ArrowRight } from 'lucide-react';

const styles = {
  primary:
    'border border-gold/70 bg-gold px-5 py-3 text-sm font-bold text-black shadow-glow hover:bg-white hover:border-white',
  secondary:
    'border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white hover:border-white/35 hover:bg-white/[0.08]',
  ghost:
    'border border-transparent bg-transparent px-3 py-2 text-sm font-semibold text-white/70 hover:text-white',
};

export default function Button({
  href,
  children,
  variant = 'primary',
  icon: Icon = ArrowRight,
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full transition duration-300 ${styles[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {Icon ? <Icon aria-hidden="true" size={17} strokeWidth={2.2} /> : null}
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {content}
    </button>
  );
}
