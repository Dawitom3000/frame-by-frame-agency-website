# Landing Page Media

The landing page hero uses these web-ready files:

- `hero-mashup.mp4`
- `hero-mashup-poster.jpg`

Raw source videos are not referenced by the website. They are only used to create the optimized mash-up.

Current source folder:

```text
/Users/Apple/Desktop/landing page videos.
```

To regenerate the hero mash-up after replacing or adding source clips, run:

```bash
swift scripts/create_hero_mashup.swift "/Users/Apple/Desktop/landing page videos." assets/media/hero-mashup.mp4 assets/media/hero-mashup-poster.jpg
```

The website references:

```html
assets/media/hero-mashup.mp4
assets/media/hero-mashup-poster.jpg
```

Do not hardcode the Desktop source folder into the site.
