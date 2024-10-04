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
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

