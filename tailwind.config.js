module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
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
        'gray-background': '#ededf2',
        'not-connected-red': '#CC0202',
        'is-connected-green': '#26BF0E',
        'is-loading-grey': '#ededf2',
      },
    },
    boxShadow: {
      nav: '0px 1px 4px 0px rgb(50 50 50 / 75%)',
      row: 'rgb(156 163 175 / 45%) 0px 0px 5px 1px',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      inherit: 'inherit',
      none: 'none',
      2: '2 2 0%',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: true,
};
