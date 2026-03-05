export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: '#B6FF2E',
        black: '#0B0B0F',
        graphite: '#12131A',
        text: '#F2F4F7',
        muted: '#A0A6B0',
        'card-border': 'rgba(182, 255, 46, 0.08)',
        'card-border-hover': 'rgba(182, 255, 46, 0.18)',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}