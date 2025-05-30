/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        soft: {
          background: '#E8F9EF',    
          backgroundTo: '#DFF5E3',  
          card: '#FDFDFD',          
          border: '#E2E8F0',        
        },
        accent: {
          primary: '#C89F83',       
          hover: '#b5876d',        
        },
        text: {
          main: '#333333',
        }
      },
    },
  },
  plugins: [],
}
