/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        manarila: {
          teal: '#319795',
          navy: '#1a365d',
          gold: '#d69e2e',
          softBg: '#f7fafc',
          border: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
