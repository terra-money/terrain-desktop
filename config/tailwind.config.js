module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    minHeight: {
      '1/2': '50%',
    },
    extend: {
      colors: {
        'terra-main-bg': '#0D1822',
        'terra-darknavy': '#001555',
        'terra-text': '#FFFFFFF',
        'terra-text-muted': '#BDBFC1',
        'terra-text-dark': '#0D1822',
        'terra-menu-text': '#E9E9E9',
        'terra-background-gray': '#F3F5FD',
        'terra-background-secondary': '#F9FAFF',
        'terra-button-secondary': '#000000',
        'terra-button-primary': '#FFEACE',
        'terra-link': '#459CF4',
        'is-connected-green': '#1DAA8E',
        'not-connected-red': '#FF5561',
        'is-loading-yellow': '#FEF08A',
        'is-loading-grey': '#ededf2',
      },
      boxShadow: {
        'light-bottom': '0px 0.65px 1px 0px #cfd8ea',
        'very-light-border': '0px 0.25px 0.5px 0px #cfd8ea',
        row: 'rgb(156 163 175 / 45%) 0px 0px 5px 1px',
      },
      fontFamily: {
        gotham: [
          'Gotham',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
        ],
      },
    },
  },
  plugins: [],
  important: true,
};
