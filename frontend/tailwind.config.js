/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kenya-inspired primary palette
        primary: {
          50: '#fef3f2',
          100: '#fde8e7',
          200: '#fbd5d3',
          300: '#f7aeaa',
          400: '#f17f79',
          500: '#e8504a',   // Kenya red
          600: '#d43c36',
          700: '#b12e28',
          800: '#932925',
          900: '#7a2723',
        },
        // Kenyan savanna green accent
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Dark dashboard surfaces
        surface: {
          950: '#0a0e1a',
          900: '#0f1629',
          800: '#151e36',
          700: '#1c2a4a',
          600: '#243358',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0f1629 0%, #1c2a4a 50%, #243358 100%)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card': '0 2px 16px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
