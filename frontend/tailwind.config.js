/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      height: {
        'custom-lg': '32rem'
      },
      width: {
        'custom-lg': '28rem'
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        'primary': '#04aaa2',
        'secondary': '#e6fafb',
        'white': '#FFFFFF',
        'strong_cyan': '#04bdb4',
        'light_gray': '#fbfafb',
        'dark_gray': '#2d3137',
        'soft_cyan': '#b4f2ef',
        'bright_blue': '#382fed'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

