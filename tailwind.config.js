import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#FAF7F1',
        cream: '#F3ECDF',
        ink: '#2E2A25',
        inksoft: '#6F675E',
        wood: '#A97C50',
        wooddeep: '#7C5732',
        leaf: '#4E7A51',
        leafsoft: '#8FB996',
        skysoft: '#8FB4D4',
        skydeep: '#4E7FA6',
        tang: '#E8823F',
        tangdeep: '#C96A2E',
        line: '#E7DFD2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-system', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 12px 32px rgba(46, 42, 37, 0.10)',
        float: '0 6px 20px rgba(46, 42, 37, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
