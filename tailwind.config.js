/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2d5a87',
          dark: '#152a45',
        },
        accent: {
          DEFAULT: '#f5a623',
          light: '#ffc857',
          dark: '#d4891a',
        },
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'Source Han Serif CN', 'Georgia', 'serif'],
        sans: ['Noto Sans SC', 'Source Han Sans CN', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
