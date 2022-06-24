module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  mode: 'jit',
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      '1/2': '50%',
    },
    extend: {
      colors: {
        'terra-dark-blue': '#072365',
        'terra-mid-blue': '#5497E8',
        'light-white': '#63749D',
        'green-on': '#26bf0d',
        'gray-background': '#ededf2',
        'not-connected-red': '#CC0202',
        'is-connected-green': '#26BF0E',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
