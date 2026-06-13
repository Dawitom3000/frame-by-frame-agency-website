# Frame by Frame Agency Website

Premium static landing page for Frame by Frame, a creative production agency focused on video editing, photography, reels, documentary edits, graphics, branding visuals, and content delivery.

## Tech

- Vite
- Static HTML/CSS/JavaScript
- Three.js module for the final camera CTA
- Web3Forms for contact submissions

## Local Development

```bash
npm install
npm run dev
```

The local preview usually opens at:

```text
http://127.0.0.1:5173/
```

If that port is busy, Vite will choose the next available port.

## Production Build

```bash
npm run build
```

The production output is generated in `dist/`.

For Netlify:

- Build command: `npm run build`
- Publish folder: `dist`

For Vercel:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Launch Notes

- Contact email: `felekedawit11@gmail.com`
- Replace the sitemap URL if the site is deployed somewhere other than GitHub Pages.
- Replace `assets/media/hero-mashup.mp4` with a smaller optimized video when final launch media is ready.
- Replace or add social and Upwork profile links only when the real URLs are available.
