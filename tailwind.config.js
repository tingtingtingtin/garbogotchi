// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Make sure it targets the correct files
  ],
  theme: {
    extend: {
      colors: {
        tg: {
          brown: '#000000'
        }
      }
    }
  },
  plugins: []
}
