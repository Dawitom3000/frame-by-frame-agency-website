'use strict';

const EASINGS = {
  cinematic: 'cubic-bezier(0.76, 0, 0.24, 1)',
  reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
  natural: 'cubic-bezier(0.22, 1, 0.36, 1)',
  micro: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};

const PARTICLE_CONFIG = {
  count: 24,
  radius: 1.5,
  opacityRange: [0.05, 0.22],
  riseDuration: [6000, 9000],
  driftAmplitude: 12,
  driftPeriod: [4000, 7000]
};

const START_DELAY = 160;

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function splitCharacters(element) {
  const text = element.textContent.trim();
  element.textContent = '';
  const textWrap = document.createElement('span');
  textWrap.className = 'hero-eyebrow-text';

  Array.from(text).forEach((char, index) => {
    const wrap = document.createElement('span');
    wrap.className = 'hero-eyebrow-char-mask';

    const inner = document.createElement('span');
    inner.className = 'hero-eyebrow-char';
    inner.textContent = char === ' ' ? '\u00A0' : char;
    inner.style.setProperty('--char-index', index);

    wrap.appendChild(inner);
    textWrap.appendChild(wrap);
  });

  element.appendChild(textWrap);
  return [...element.querySelectorAll('.hero-eyebrow-char')];
}

function collectTextParts(node, accent = false) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
      .split(/(\s+)/)
      .filter(Boolean)
      .map((value) => ({ value, accent, space: /^\s+$/.test(value) }));
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const isAccent = accent || node.classList.contains('accent') || node.classList.contains('text-accent');
  return [...node.childNodes].flatMap((child) => collectTextParts(child, isAccent));
}

function splitHeadline(headline) {
  const lines = [...headline.querySelectorAll('.headline-line')];
  const words = [];

  lines.forEach((line) => {
    const parts = [...line.childNodes].flatMap((node) => collectTextParts(node));
    line.textContent = '';
    line.classList.add('hero-headline-line');

    parts.forEach((part) => {
      if (part.space) {
        line.appendChild(document.createTextNode(part.value));
        return;
      }

      const word = document.createElement('span');
      word.className = part.accent ? 'hero-title-word accent' : 'hero-title-word';
      word.textContent = part.value;
      line.appendChild(word);
      words.push(word);
    });
  });

  return words;
}

function splitSubheading(element) {
  const text = element.textContent.trim();
  element.textContent = '';

  const midpoint = Math.max(1, Math.ceil(text.length / 2));
  const splitAt = text.indexOf(' ', midpoint) > -1 ? text.indexOf(' ', midpoint) : midpoint;
  const lines = [text.slice(0, splitAt).trim(), text.slice(splitAt).trim()].filter(Boolean);

  lines.forEach((line) => {
    const span = document.createElement('span');
    span.className = 'hero-hook-line';
    span.textContent = line;
    element.appendChild(span);
  });

  return [...element.querySelectorAll('.hero-hook-line')];
}

function createParticles(width, height) {
  const random = seededRandom(20250613);
  const particles = [];

  for (let i = 0; i < PARTICLE_CONFIG.count; i += 1) {
    let particle;
    let attempts = 0;

    do {
      particle = {
        x: random() * width,
        y: random() * height,
        phase: random() * Math.PI * 2,
        rise: PARTICLE_CONFIG.riseDuration[0] + random() * (PARTICLE_CONFIG.riseDuration[1] - PARTICLE_CONFIG.riseDuration[0]),
        drift: PARTICLE_CONFIG.driftPeriod[0] + random() * (PARTICLE_CONFIG.driftPeriod[1] - PARTICLE_CONFIG.driftPeriod[0]),
        pulse: 3000 + random() * 2000
      };
      attempts += 1;
    } while (
      attempts < 24 &&
      particles.some((item) => Math.hypot(item.x - particle.x, item.y - particle.y) < 20)
    );

    particles.push(particle);
  }

  return particles;
}

export function initHeroAnimation(heroElement) {
  if (!heroElement) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  const eyebrow = heroElement.querySelector('.hero-eyebrow');
  const headline = heroElement.querySelector('[data-obsidian-headline]');
  const hook = heroElement.querySelector('.hero-hook');
  const animations = [];
  const timers = [];
  let frameId = 0;
  let ambientStarted = false;
  let ambientVisible = true;
  let isCleaned = false;

  if (!eyebrow || !headline || !hook) return () => {};

  const heroRect = heroElement.getBoundingClientRect();
  const eyebrowRect = eyebrow.getBoundingClientRect();
  const headlineRect = headline.getBoundingClientRect();
  const hookRect = hook.getBoundingClientRect();
  void heroRect;
  void eyebrowRect;
  void headlineRect;
  void hookRect;

  const line = document.createElement('span');
  line.className = 'hero-init-hairline';
  heroElement.appendChild(line);

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-motion-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  heroElement.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const charNodes = splitCharacters(eyebrow);
  const wordNodes = splitHeadline(headline);
  const subLines = splitSubheading(hook);

  heroElement.classList.add('hero-motion-mounted');

  const finishInstantly = () => {
    heroElement.classList.add('hero-motion-complete');
    heroElement.style.opacity = '1';
    [...charNodes, ...wordNodes, ...subLines].forEach((node) => {
      node.style.opacity = '1';
      node.style.transform = 'none';
      node.style.clipPath = 'none';
      node.style.filter = 'none';
    });
  };

  if (reducedMotion) {
    heroElement.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      easing: EASINGS.micro,
      fill: 'forwards'
    });
    finishInstantly();
    return () => {};
  }

  const animate = (target, keyframes, options) => {
    const animation = target.animate(keyframes, options);
    animations.push(animation);
    return animation;
  };

  const setTimer = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  };

  animate(heroElement, [{ opacity: 0 }, { opacity: 1 }], {
    delay: START_DELAY,
    duration: 400,
    easing: EASINGS.micro,
    fill: 'both'
  });

  animate(line, [
    { transform: 'scaleX(0)', opacity: 0 },
    { transform: 'scaleX(1)', opacity: 1 },
    { transform: 'scaleX(1)', opacity: 0 }
  ], {
    delay: START_DELAY,
    duration: 380,
    easing: EASINGS.cinematic,
    fill: 'forwards'
  });

  setTimer(() => {
    if (!isCleaned) line.remove();
  }, START_DELAY + 430);

  animate(eyebrow, [
    { '--eyebrow-line-scale': 0 },
    { '--eyebrow-line-scale': 1 }
  ], {
    delay: START_DELAY + 400,
    duration: 280,
    easing: EASINGS.natural,
    fill: 'forwards'
  });

  charNodes.forEach((char, index) => {
    char.style.willChange = 'transform, opacity';
    animate(char, [
      { opacity: 0, transform: 'translateY(100%)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      delay: START_DELAY + 400 + index * 12,
      duration: 280,
      easing: EASINGS.natural,
      fill: 'forwards'
    });
  });

  wordNodes.forEach((word, index) => {
    const accentDelay = word.classList.contains('accent') ? 120 : 0;
    const delay = START_DELAY + 680 + index * 80 + accentDelay;
    word.style.willChange = 'clip-path, filter, transform, opacity';

    if (mobile) {
      animate(word, [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        delay,
        duration: 500,
        easing: EASINGS.reveal,
        fill: 'forwards'
      });
      return;
    }

    animate(word, [
      { opacity: 0, transform: 'translateY(18px)', clipPath: 'inset(0 0 100% 0)', filter: 'blur(8px)' },
      { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0% 0)', filter: 'blur(0)' }
    ], {
      delay,
      duration: 500,
      easing: EASINGS.reveal,
      fill: 'forwards'
    });
  });

  subLines.forEach((lineNode, index) => {
    lineNode.style.willChange = 'transform, opacity';
    animate(lineNode, [
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      delay: START_DELAY + 1200 + index * 100,
      duration: 600,
      easing: 'ease-out',
      fill: 'forwards'
    });
  });

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = heroElement.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return rect;
  };

  let canvasRect = resizeCanvas();
  let particles = mobile || !ctx ? [] : createParticles(canvasRect.width, canvasRect.height);

  const stopAmbient = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  const startAmbientLoop = () => {
    if (isCleaned || mobile || !ctx || frameId || !ambientVisible) return;
    frameId = requestAnimationFrame(renderAmbient);
  };

  const renderAmbient = (now) => {
    if (isCleaned || !ctx || mobile || !ambientVisible) {
      frameId = 0;
      return;
    }

    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);

    particles.forEach((particle) => {
      const riseProgress = ((now + particle.phase * 1000) % particle.rise) / particle.rise;
      const drift = Math.sin((now / particle.drift) * Math.PI * 2 + particle.phase) * PARTICLE_CONFIG.driftAmplitude;
      const opacityPulse = (Math.sin((now / particle.pulse) * Math.PI * 2 + particle.phase) + 1) / 2;
      const opacity = PARTICLE_CONFIG.opacityRange[0] + opacityPulse * (PARTICLE_CONFIG.opacityRange[1] - PARTICLE_CONFIG.opacityRange[0]);
      const y = particle.y - riseProgress * 80;
      const wrappedY = y < -8 ? canvasRect.height + (y % canvasRect.height) : y;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 75, 51, ${opacity})`;
      ctx.arc(particle.x + drift, wrappedY, PARTICLE_CONFIG.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    if (canvasRect.width >= 768) {
      const scanProgress = (now % 8000) / 8000;
      const scanY = scanProgress * canvasRect.height;
      ctx.fillStyle = 'rgba(255, 75, 51, 0.06)';
      ctx.fillRect(0, scanY, canvasRect.width, 1);
    }

    frameId = requestAnimationFrame(renderAmbient);
  };

  const startAmbient = setTimer(() => {
    ambientStarted = true;
    startAmbientLoop();
  }, START_DELAY + 800);
  void startAmbient;

  let ambientObserver;
  if (!mobile && 'IntersectionObserver' in window) {
    ambientObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      ambientVisible = Boolean(entry?.isIntersecting);
      if (ambientVisible && ambientStarted) {
        startAmbientLoop();
      } else {
        stopAmbient();
      }
    }, { rootMargin: '120px 0px', threshold: 0 });
    ambientObserver.observe(heroElement);
  }

  const onResize = () => {
    canvasRect = resizeCanvas();
    particles = mobile || !ctx ? [] : createParticles(canvasRect.width, canvasRect.height);
  };

  window.addEventListener('resize', onResize, { passive: true });

  setTimer(() => {
    heroElement.classList.add('hero-motion-complete');
    [...charNodes, ...wordNodes, ...subLines].forEach((node) => {
      node.style.willChange = '';
    });
    wordNodes.forEach((word) => {
      word.style.clipPath = '';
      word.style.filter = '';
    });
    animations.forEach((animation) => animation.cancel());
  }, START_DELAY + 2000);

  return function cleanup() {
    isCleaned = true;
    timers.forEach((timer) => window.clearTimeout(timer));
    window.removeEventListener('resize', onResize);
    stopAmbient();
    ambientObserver?.disconnect();
    animations.forEach((animation) => animation.cancel());
    canvas.remove();
    line.remove();
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('[data-obsidian-hero]');
  globalThis.initHeroAnimation = initHeroAnimation;
  globalThis.__frameHeroCleanup = initHeroAnimation(hero);
});
