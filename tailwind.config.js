/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chassis: '#EAEAE8',
        carbon: '#181A1B',
        signal: '#F15A24',
        ochre: '#D19433',
        anodized: '#7A8285',
      },
      fontFamily: {
        din: ['"LL DIN"', 'Arial', 'sans-serif'],
        akkurat: ['"Akkurat"', 'Arial', 'sans-serif'],
        mono: ['"Favorit Mono"', '"SF Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
