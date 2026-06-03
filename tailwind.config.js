/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        carbon: '#0c0d0f',
        graphite: '#15171b',
        line: 'rgba(255,255,255,0.10)',
        smoke: 'rgba(255,255,255,0.68)',
        mute: 'rgba(255,255,255,0.48)',
        gold: '#d8a853',
        ember: '#f0713d',
        electric: '#61b8ff',
        teal: '#76d1c5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 90px rgba(216, 168, 83, 0.14)',
        panel: '0 32px 120px rgba(0, 0, 0, 0.52)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -16px, 0)' },
        },
      },
      animation: {
        scan: 'scan 7s linear infinite',
        drift: 'drift 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
