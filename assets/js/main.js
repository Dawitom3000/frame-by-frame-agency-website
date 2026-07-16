'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Bidirectional Scroll Reveal IntersectionObserver
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => {
        el.classList.add('visible');
        el.classList.remove('hidden');
      });
      return;
    }

    const prevRatios = new WeakMap();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const prevRatio = prevRatios.get(el) || 0;
        const currRatio = entry.intersectionRatio;

        if (entry.isIntersecting) {
          el.classList.add('visible');
          el.classList.remove('hidden');
        } else {
          // Not intersecting
          if (prevRatio > currRatio && entry.boundingClientRect.top < 0) {
            // Exited the top of the viewport (scrolling down past it)
            el.classList.remove('visible');
            el.classList.add('hidden');
          } else {
            // Below the viewport (scrolling up past it, or default state)
            el.classList.remove('visible');
            el.classList.remove('hidden');
          }
        }

        prevRatios.set(el, currRatio);
      });
    }, {
      threshold: [0, 0.1, 0.2],
      rootMargin: '-3% 0px -6% 0px'
    });

    elements.forEach((el) => {
      observer.observe(el);
    });
  }

  // 3. Counter animations
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const setCounterValue = (counter, value) => {
      const target = Number(counter.dataset.target || 0);
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const siblingSuffix = counter.nextElementSibling && counter.nextElementSibling.classList.contains('stat-suffix') 
        ? counter.nextElementSibling 
        : null;

      if (siblingSuffix) {
        counter.textContent = `${prefix}${value}`;
        siblingSuffix.textContent = suffix;
      } else {
        counter.textContent = `${prefix}${value}${suffix}`;
      }
    };

    const animateCounter = (counter) => {
      const target = Number(counter.dataset.target || 0);
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutExpo(progress);
        const value = Math.floor(target * eased);

        setCounterValue(counter, progress === 1 ? target : value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    if (prefersReducedMotion) {
      counters.forEach((counter) => {
        counter.dataset.counted = '1';
        const target = Number(counter.dataset.target || 0);
        setCounterValue(counter, target);
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting && !el.dataset.counted) {
          el.dataset.counted = '1';
          animateCounter(el);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  // 4. GSAP ScrollTrigger pinned text scrub
  function initTextScrub() {
    const section = document.querySelector('.text-scrub');
    const spans = document.querySelectorAll('.text-scrub-headline span');
    if (!section || !spans.length) return;

    if (prefersReducedMotion) {
      spans.forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'none';
      });
      return;
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.timeline({
        scrollTrigger: {
          trigger: '.text-scrub',
          scrub: 0.3,
          start: 'top 80%',
          end: 'top 20%',
          invalidateOnRefresh: true
        }
      })
      .fromTo(spans,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none'
        }
      );
    } else {
      // Fallback: all spans set to opacity 1 via a setTimeout(0)
      setTimeout(() => {
        spans.forEach(span => {
          span.style.opacity = '1';
        });
      }, 0);
    }
  }

  // 5. Mobile Navigation Toggle
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle') || document.querySelector('.dock-toggle');
    if (!toggle) return;

    const targetId = toggle.getAttribute('aria-controls');
    const target = document.getElementById(targetId) || document.querySelector('.nav-links') || document.querySelector('.dock-links');

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      if (target) {
        target.classList.toggle('open');
      }
    });

    // Close menu when a navigation link is clicked
    if (target) {
      target.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          target.classList.remove('open');
        });
      });
    }
  }

  // 6. Contact Form Submission Handler
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const note = document.getElementById('form-note');
    if (!form || !note) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        note.className = 'form-note error';
        note.textContent = "Fill this in and we'll get moving.";
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : '';
      const formData = new FormData(form);
      const accessKey = String(formData.get('access_key') || '').trim();

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        note.className = 'form-note error';
        note.textContent = 'Add your Web3Forms access key before this form can send.';
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      note.className = 'form-note';
      note.textContent = 'Sending your project details...';

      if (typeof fetch !== 'function') {
        note.className = 'form-note';
        note.textContent = 'Opening the secure contact form...';
        HTMLFormElement.prototype.submit.call(form);
        return;
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: formData
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Message could not be sent.');
        }

        note.className = 'form-note success';
        note.textContent = "Got it. You'll hear from us within 24 hours.";
        form.reset();
      } catch (error) {
        if (error instanceof TypeError) {
          note.className = 'form-note';
          note.textContent = 'Opening the secure contact form...';
          HTMLFormElement.prototype.submit.call(form);
          return;
        }

        note.className = 'form-note error';
        note.textContent = 'Something went wrong. Email us directly at felekedawit11@gmail.com.';
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  function initEmailActions() {
    const copyButton = document.querySelector('[data-copy-email]');
    const copyNote = document.querySelector('.copy-email-note');
    if (!copyButton || !copyNote) return;

    const fallbackCopy = (email) => {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      return copied;
    };

    copyButton.addEventListener('click', async () => {
      const email = copyButton.getAttribute('data-copy-email') || '';

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
        } else if (!fallbackCopy(email)) {
          throw new Error('Copy failed');
        }
        copyNote.textContent = 'Email copied.';
      } catch (error) {
        copyNote.textContent = fallbackCopy(email) ? 'Email copied.' : email;
      }

      setTimeout(() => {
        copyNote.textContent = '';
      }, 3500);
    });
  }

  // 7. Hero elements reveal trigger on load
  function initHeroReveal() {
    const heroElements = document.querySelectorAll('.hero .reveal');
    setTimeout(() => {
      heroElements.forEach(el => {
        el.classList.add('visible');
        el.classList.remove('hidden');
      });
    }, 800);
  }

  function initHeroVideo() {
    const video = document.querySelector('.hero-video-el');
    if (!video) return;

    if (prefersReducedMotion) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }

    video.muted = true;
    video.playsInline = true;
    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          video.setAttribute('data-playback-blocked', 'true');
        });
      }
    };

    playVideo();

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          playVideo();
        } else {
          video.pause();
        }
      }, { threshold: 0.08 });
      observer.observe(video);
    } else {
      video.addEventListener('error', () => {
        video.setAttribute('data-playback-blocked', 'true');
      });
    }
  }

  // 9. Site-wide cursor-reactive gradient canvas
  function initVisualSystems() {
    const bgCanvas = document.getElementById("bg-canvas");
    if (!bgCanvas) return;

    const bgCtx = bgCanvas.getContext("2d", { alpha: false });
    if (!bgCtx) return;

    const hasCursor = window.matchMedia("(pointer: fine)").matches;
    const LERP = 0.055;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let targetX = W / 2;
    let targetY = H / 2;
    let smoothX = W / 2;
    let smoothY = H / 2;
    let frameCount = 0;
    let frameId = 0;
    let resizeTimer;
    let isRendering = false;
    let pageVisible = !document.hidden;

    const grainCanvas = document.createElement("canvas");
    const grainCtx = grainCanvas.getContext("2d");

    function resizeBackgroundCanvas() {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      bgCanvas.width = Math.max(1, Math.floor(W * dpr));
      bgCanvas.height = Math.max(1, Math.floor(H * dpr));
      bgCanvas.style.width = W + "px";
      bgCanvas.style.height = H + "px";
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      grainCanvas.width = Math.max(1, Math.floor(W * dpr));
      grainCanvas.height = Math.max(1, Math.floor(H * dpr));
      if (grainCtx) grainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function redrawGrain() {
      if (!grainCtx) return;
      grainCtx.clearRect(0, 0, W, H);
      grainCtx.fillStyle = "rgba(255, 75, 51,0.012)";
      for (let i = 0; i < 1200; i += 1) {
        grainCtx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
      }
    }

    function fillRadial(stops) {
      const gradient = bgCtx.createRadialGradient(stops.x0, stops.y0, 0, stops.x0, stops.y0, stops.radius);
      stops.colors.forEach(([stop, color]) => gradient.addColorStop(stop, color));
      bgCtx.fillStyle = gradient;
      bgCtx.fillRect(0, 0, W, H);
    }

    function drawBackground(px, py, shouldRedrawGrain = true) {
      bgCtx.clearRect(0, 0, W, H);
      bgCtx.fillStyle = "#0B0F2B";
      bgCtx.fillRect(0, 0, W, H);

      fillRadial({
        x0: px,
        y0: py,
        radius: W * 0.40,
        colors: [
          [0, "rgba(255, 75, 51, 0.055)"],
          [0.48, "rgba(255, 75, 51, 0.018)"],
          [1, "rgba(255, 75, 51, 0)"],
        ],
      });

      fillRadial({
        x0: W * 0.84,
        y0: H * 0.07,
        radius: W * 0.44,
        colors: [
          [0, "rgba(180, 120, 30, 0.07)"],
          [1, "rgba(180, 120, 30, 0)"],
        ],
      });

      fillRadial({
        x0: W * 0.06,
        y0: H * 0.92,
        radius: W * 0.32,
        colors: [
          [0, "rgba(40, 30, 10, 0.12)"],
          [1, "rgba(40, 30, 10, 0)"],
        ],
      });

      const vignette = bgCtx.createLinearGradient(0, 0, 0, H);
      vignette.addColorStop(0, "rgba(0,0,0,0.38)");
      vignette.addColorStop(0.40, "rgba(0,0,0,0)");
      vignette.addColorStop(0.65, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.6)");
      bgCtx.fillStyle = vignette;
      bgCtx.fillRect(0, 0, W, H);

      if (shouldRedrawGrain) redrawGrain();
      bgCtx.drawImage(grainCanvas, 0, 0, W, H);
    }

    function masterLoop() {
      if (!isRendering || !pageVisible) return;
      frameCount += 1;

      if (!hasCursor) {
        targetX = W * 0.5;
        targetY = H * 0.3;
      }

      smoothX += (targetX - smoothX) * LERP;
      smoothY += (targetY - smoothY) * LERP;
      drawBackground(smoothX, smoothY, frameCount % 8 === 0);

      const stillMoving = Math.abs(targetX - smoothX) > 0.35 || Math.abs(targetY - smoothY) > 0.35;
      if (stillMoving) {
        frameId = requestAnimationFrame(masterLoop);
      } else {
        isRendering = false;
        frameId = 0;
      }
    }

    function requestBackgroundRender() {
      if (prefersReducedMotion || isRendering || !pageVisible) return;
      isRendering = true;
      frameId = requestAnimationFrame(masterLoop);
    }

    resizeBackgroundCanvas();

    if (hasCursor) {
      window.addEventListener("mousemove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        requestBackgroundRender();
      }, { passive: true });
    } else {
      targetX = W * 0.5;
      targetY = H * 0.3;
      smoothX = targetX;
      smoothY = targetY;
    }

    if (prefersReducedMotion) {
      drawBackground(W * 0.5, H * 0.3, true);
    } else {
      drawBackground(smoothX, smoothY, true);
    }

    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeBackgroundCanvas();
        drawBackground(hasCursor ? smoothX : W * 0.5, hasCursor ? smoothY : H * 0.3, true);
        if (hasCursor) requestBackgroundRender();
      }, 200);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      pageVisible = !document.hidden;
      if (!pageVisible) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        isRendering = false;
      } else {
        drawBackground(hasCursor ? smoothX : W * 0.5, hasCursor ? smoothY : H * 0.3, true);
      }
    });
  }

  // 10. Ground-up 3D camera model built from Three.js primitives
  async function initGroundUpCamera() {
    const canvas = document.getElementById("hero-camera-canvas");
    if (!canvas) return;

    const stage = canvas.closest(".camera-stage");
    let THREE_NS;
    let renderer;
    let scene;
    let camera;
    let cameraGroup;
    let lensGlow;
    let rimLight;
    let flashLight;
    let zoomRing;
    let focusRing;
    let frameId = 0;
    let t = 0;
    let visible = true;
    let flash = 0;   // shutter flash intensity, decays each frame
    let recoil = 0;  // shutter kick-back, springs back each frame
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const hasPointer = window.matchMedia("(pointer: fine)").matches;

    function setLoaded() {
      canvas.classList.add("loaded");
      stage?.classList.add("loaded");
    }

    function resizeRenderer() {
      if (!renderer || !camera) return;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.3 : 1.6);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function addBox(group, size, material, position, rotation = [0, 0, 0]) {
      const mesh = new THREE_NS.Mesh(new THREE_NS.BoxGeometry(size[0], size[1], size[2]), material);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    function addCylinder(group, radiusTop, radiusBottom, height, material, position, rotation = [Math.PI / 2, 0, 0], segments = 40) {
      const mesh = new THREE_NS.Mesh(new THREE_NS.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    function addTorus(group, radius, tube, material, position) {
      const mesh = new THREE_NS.Mesh(new THREE_NS.TorusGeometry(radius, tube, 18, 72), material);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    function buildCameraModel() {
      const MAT = {
        body: new THREE_NS.MeshStandardMaterial({ color: 0x111111, roughness: 0.42, metalness: 0.62 }),
        bodySoft: new THREE_NS.MeshStandardMaterial({ color: 0x181818, roughness: 0.58, metalness: 0.35 }),
        grip: new THREE_NS.MeshStandardMaterial({ color: 0x090909, roughness: 0.92, metalness: 0.06 }),
        lens: new THREE_NS.MeshStandardMaterial({ color: 0x151515, roughness: 0.24, metalness: 0.84 }),
        ring: new THREE_NS.MeshStandardMaterial({ color: 0x202020, roughness: 0.18, metalness: 0.9 }),
        rubber: new THREE_NS.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.96, metalness: 0.03 }),
        glass: new THREE_NS.MeshPhysicalMaterial({ color: 0x0b1024, roughness: 0.02, metalness: 0.5, transmission: 0.28, transparent: true, opacity: 0.58, emissive: 0x061024, emissiveIntensity: 0.4 }),
        gold: new THREE_NS.MeshStandardMaterial({ color: 0xff4b33, roughness: 0.18, metalness: 0.92 }),
        screen: new THREE_NS.MeshStandardMaterial({ color: 0x07111e, roughness: 0.08, metalness: 0.28, emissive: 0x07111e, emissiveIntensity: 0.45 }),
        red: new THREE_NS.MeshStandardMaterial({ color: 0xc5321f, roughness: 0.25, metalness: 0.3, emissive: 0x661106, emissiveIntensity: 0.65 }),
      };

      cameraGroup = new THREE_NS.Group();
      cameraGroup.name = "FrameByFramePrimitiveCamera";
      cameraGroup.position.set(0.18, -0.08, 0);
      cameraGroup.rotation.set(-0.02, -0.18, 0.02);
      cameraGroup.scale.setScalar(0.9);
      scene.add(cameraGroup);

      addBox(cameraGroup, [2.55, 1.45, 0.96], MAT.body, [0, 0, 0]);
      addBox(cameraGroup, [2.34, 0.18, 1.02], MAT.bodySoft, [0, -0.86, 0.02]);
      addBox(cameraGroup, [0.92, 0.52, 0.84], MAT.body, [0, 1.03, 0.03]);
      addBox(cameraGroup, [0.92, 0.3, 0.54], MAT.body, [0, 1.22, 0.22], [-0.45, 0, 0]);
      addBox(cameraGroup, [0.92, 0.3, 0.54], MAT.body, [0, 1.18, -0.2], [0.5, 0, 0]);

      addBox(cameraGroup, [0.56, 1.52, 1.05], MAT.grip, [1.34, -0.08, 0.04]);
      addCylinder(cameraGroup, 0.33, 0.33, 0.94, MAT.grip, [1.56, -0.1, 0.18], [0, 0, 0], 28);
      addBox(cameraGroup, [0.24, 1.18, 1.08], MAT.grip, [1.67, -0.2, 0.08]);

      addBox(cameraGroup, [1.35, 0.88, 0.04], MAT.screen, [-0.18, -0.06, -0.51]);
      addBox(cameraGroup, [0.34, 0.24, 0.12], MAT.grip, [0.02, 0.78, -0.54]);
      addCylinder(cameraGroup, 0.15, 0.15, 0.04, MAT.gold, [-0.92, 0.18, -0.55], [Math.PI / 2, 0, 0], 24);
      addCylinder(cameraGroup, 0.2, 0.2, 0.04, MAT.bodySoft, [0.95, -0.28, -0.55], [Math.PI / 2, 0, 0], 28);

      addCylinder(cameraGroup, 0.22, 0.22, 0.12, MAT.gold, [-0.78, 0.86, 0.1], [0, 0, 0], 32);
      addCylinder(cameraGroup, 0.16, 0.16, 0.1, MAT.bodySoft, [0.76, 0.88, 0.08], [0, 0, 0], 28);
      addCylinder(cameraGroup, 0.12, 0.12, 0.08, MAT.gold, [1.12, 0.94, 0.36], [0, 0, 0], 24);
      addBox(cameraGroup, [0.48, 0.06, 0.28], MAT.gold, [0, 1.36, 0.02]);
      addCylinder(cameraGroup, 0.04, 0.04, 0.05, MAT.red, [-0.58, 0.42, 0.52], [Math.PI / 2, 0, 0], 12);

      const lens = new THREE_NS.Group();
      lens.position.set(0, -0.03, 0.58);
      cameraGroup.add(lens);

      addCylinder(lens, 0.76, 0.76, 0.12, MAT.gold, [0, 0, -0.1]);
      addCylinder(lens, 0.72, 0.76, 0.42, MAT.lens, [0, 0, 0.1]);
      zoomRing = addCylinder(lens, 0.78, 0.78, 0.36, MAT.rubber, [0, 0, 0.38]);
      addTorus(lens, 0.78, 0.018, MAT.gold, [0, 0, 0.6]);
      addCylinder(lens, 0.68, 0.72, 0.5, MAT.ring, [0, 0, 0.78]);
      focusRing = addCylinder(lens, 0.7, 0.7, 0.24, MAT.rubber, [0, 0, 1.1]);
      addCylinder(lens, 0.62, 0.68, 0.34, MAT.lens, [0, 0, 1.34]);
      addTorus(lens, 0.63, 0.035, MAT.gold, [0, 0, 1.52]);

      const glass = new THREE_NS.Mesh(new THREE_NS.SphereGeometry(0.54, 48, 20), MAT.glass);
      glass.scale.set(1, 1, 0.28);
      glass.position.set(0, 0, 1.58);
      glass.castShadow = true;
      lens.add(glass);

      lensGlow = new THREE_NS.Mesh(new THREE_NS.CircleGeometry(0.27, 48), MAT.gold);
      lensGlow.position.set(0, 0, 1.61);
      lensGlow.material.transparent = true;
      lensGlow.material.opacity = 0.22;
      lens.add(lensGlow);

      const frontHighlight = new THREE_NS.Mesh(new THREE_NS.TorusGeometry(0.41, 0.012, 12, 64), MAT.gold);
      frontHighlight.position.set(-0.1, 0.1, 1.63);
      frontHighlight.rotation.z = -0.35;
      lens.add(frontHighlight);
    }

    function renderFrame() {
      if (!renderer || !scene || !camera || !cameraGroup) return;

      if (!prefersReducedMotion) {
        t += 0.008;
        pointer.x += (pointer.tx - pointer.x) * 0.055;
        pointer.y += (pointer.ty - pointer.y) * 0.055;
        cameraGroup.rotation.y = -0.18 + Math.sin(t * 0.65) * 0.12 + pointer.x * 0.22;
        cameraGroup.rotation.x = -0.02 + Math.sin(t * 0.42) * 0.045 - pointer.y * 0.12;
        cameraGroup.rotation.z = 0.02 + Math.sin(t * 0.36) * 0.035;
        cameraGroup.position.y = -0.08 + Math.sin(t * 0.72) * 0.08;

        if (zoomRing) zoomRing.rotation.y = t * 0.16 + pointer.x * 0.2;
        if (focusRing) focusRing.rotation.y = -t * 0.2 - pointer.x * 0.16;
        if (lensGlow) lensGlow.material.opacity = Math.min(1, 0.16 + Math.sin(t * 1.6) * 0.05 + flash * 0.85);
        if (rimLight) {
          rimLight.position.x = -3.2 + pointer.x * 1.2;
          rimLight.position.y = 2.5 - pointer.y * 0.9;
        }

        // Shutter: flash burst + recoil kick, both easing back to rest
        flash *= 0.80;
        recoil *= 0.78;
        if (flashLight) flashLight.intensity = flash * 16;
        cameraGroup.position.z = recoil * -0.6;
        cameraGroup.rotation.x += recoil * 0.06;
      }

      renderer.render(scene, camera);
    }

    function loop() {
      renderFrame();
      if (visible && !prefersReducedMotion) {
        frameId = requestAnimationFrame(loop);
      }
    }

    try {
      THREE_NS = await import("../vendor/three.module.r128.js");
      scene = new THREE_NS.Scene();
      camera = new THREE_NS.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.08, 6.4);

      renderer = new THREE_NS.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE_NS.PCFSoftShadowMap;
      renderer.toneMapping = THREE_NS.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // Reflection environment — a soft navy gradient so the metal and glass
      // catch real, on-brand reflections instead of reading flat.
      try {
        const envC = document.createElement("canvas");
        envC.width = 16; envC.height = 256;
        const eg = envC.getContext("2d");
        const grad = eg.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, "#3a4170");   // sky — lighter navy
        grad.addColorStop(0.45, "#141a3c");
        grad.addColorStop(0.7, "#0b0f2b");
        grad.addColorStop(1, "#05060f");    // floor — near black
        eg.fillStyle = grad;
        eg.fillRect(0, 0, 16, 256);
        const envTex = new THREE_NS.CanvasTexture(envC);
        envTex.mapping = THREE_NS.EquirectangularReflectionMapping;
        const pmrem = new THREE_NS.PMREMGenerator(renderer);
        scene.environment = pmrem.fromEquirectangular(envTex).texture;
        envTex.dispose();
        pmrem.dispose();
      } catch (e) { /* env map is an enhancement; ignore if unsupported */ }

      scene.add(new THREE_NS.AmbientLight(0xffecd0, 0.45));

      const key = new THREE_NS.DirectionalLight(0xfff4df, 2.8);
      key.position.set(3.5, 4.8, 5.4);
      key.castShadow = true;
      scene.add(key);

      rimLight = new THREE_NS.PointLight(0xff4b33, 3.2, 12);
      rimLight.position.set(-3.2, 2.5, 1.8);
      scene.add(rimLight);

      const coolFill = new THREE_NS.DirectionalLight(0xc7d7ff, 0.55);
      coolFill.position.set(-4.5, -1.2, 3.2);
      scene.add(coolFill);

      const bounce = new THREE_NS.PointLight(0xffb45c, 0.7, 10);
      bounce.position.set(0.4, -3.8, 2.5);
      scene.add(bounce);

      // Shutter flash — off until a click fires it
      flashLight = new THREE_NS.PointLight(0xffffff, 0, 10, 2);
      flashLight.position.set(0, 0.3, 3.4);
      scene.add(flashLight);

      buildCameraModel();
      resizeRenderer();
      setLoaded();
      renderFrame();

      if (hasPointer) {
        window.addEventListener("mousemove", (event) => {
          pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
          pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
      }

      // Shutter capture — click / tap / keyboard fires the flash + recoil
      const flashEl = stage?.querySelector(".camera-flash");
      function fireShutter() {
        flash = 1;
        recoil = 1;
        stage?.classList.add("captured");
        if (flashEl) {
          flashEl.classList.remove("flash-active");
          void flashEl.offsetWidth; // force reflow to restart the keyframe
          flashEl.classList.add("flash-active");
        }
      }
      if (stage) {
        stage.addEventListener("click", fireShutter);
        stage.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fireShutter();
          }
        });
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          cancelAnimationFrame(frameId);
          if (visible) loop();
        });
      }, { threshold: 0.08 });
      observer.observe(canvas);

      window.addEventListener("resize", resizeRenderer, { passive: true });
    } catch (error) {
      stage?.classList.add("camera-error");
    }
  }

  function initDeferredGroundUpCamera() {
    const canvas = document.getElementById("hero-camera-canvas");
    if (!canvas) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      initGroundUpCamera();
    };

    if (prefersReducedMotion) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            start();
          }
        });
      }, { rootMargin: "420px 0px", threshold: 0.05 });
      observer.observe(canvas);
    } else {
      window.setTimeout(start, 1200);
    }
  }

  // Services grid — the standalone "card shuffle" was removed because it
  // fought the .reveal system and could leave cards stuck invisible.
  // Service cards now animate in via the shared .reveal system only.
  function initServiceCardShuffle() {
    const grid = document.querySelector('.services .services-grid');
    grid?.classList.remove('service-shuffle-ready');
    document.querySelectorAll('.services .service-card').forEach((card) => {
      card.classList.remove('service-pre', 'service-dealt', 'service-receding');
    });
  }

  // 11. Full-bleed sections (formerly a scroll-driven card deck).
  // The stacked-card treatment was removed in favour of full-screen
  // sections; per-element entrance animation is handled by the
  // .reveal system (initScrollReveal). Clear any legacy state classes.
  function initCardDecks() {
    document.querySelectorAll('.deck-card').forEach((card) => {
      card.classList.remove('pre-deal', 'dealt', 'receding');
    });
  }

  // Execution pipeline
  initVisualSystems();
  initHeroVideo();
  initDeferredGroundUpCamera();
  initScrollReveal();
  initCounters();
  initTextScrub();
  initMobileNav();
  initContactForm();
  initEmailActions();
  initHeroReveal();
  initServiceCardShuffle();
  initCardDecks();
});

