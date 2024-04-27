/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./node_modules/flowbite-react/lib/**/*.js",
  ],
  plugins: [
    require("flowbite/plugin")
  ],
  theme: {
    extend: {
      fontFamily: {
        Kanit: [ 'Kanit']
      },
    },
  },
};
