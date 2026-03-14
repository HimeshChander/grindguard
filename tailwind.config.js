/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F1115',
        surface: '#171A21',
        card: '#1D212A',
        accent: '#6B84F8',
        accent2: '#8AA0FF',
        success: '#8EB89A',
        warning: '#D8B36A',
        textPrimary: '#ECEFF4',
        textSecondary: '#9AA3B2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
