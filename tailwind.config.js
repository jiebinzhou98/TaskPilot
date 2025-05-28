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
          background: '#E8F9EF',    // 浅绿
          backgroundTo: '#DFF5E3',  // 渐变尾色
          card: '#FDFDFD',          // 灰白容器
          border: '#E2E8F0',        // 淡灰边框
        },
        accent: {
          primary: '#C89F83',       // 奶茶棕
          hover: '#b5876d',         // hover 色
        },
        text: {
          main: '#333333',
        }
      },
    },
  },
  plugins: [],
}
