module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito_400Regular'],
        'nunito-bold': ['Nunito_700Bold'],
      },
    },
  },
  plugins: [],
}
