/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Earthy dark-mode palette carried over from the current app.
        // Contrast-checked against charcoal background (see FRONTEND_REBUILD_SPEC.md #2.2.13):
        // sage ~7.9:1, olive ~6.9:1, gold ~11.8:1 for text — all pass WCAG AA.
        // White text on any of these three as a fill FAILS contrast (~2.1:1) —
        // always pair sage/olive/gold fills with charcoal text, not white.
        sage: '#A8B5A4',
        olive: '#9CA89B',
        gold: '#E8D973',
        charcoal: '#1A1D1A',
      },
      fontFamily: {
        // Deliberate pairing, not the Inter default (see FRONTEND_REBUILD_SPEC.md #2.1.4).
        heading: ['"Unica One"', 'sans-serif'],
        body: ['"Crimson Text"', 'serif'],
      },
    },
  },
  plugins: [],
}
