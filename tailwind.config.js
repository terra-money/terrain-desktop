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
        'terra-navy': '#0E2363',
        'terra-darknavy': '#001555',
        'terra-text': '#2043B5',
        'terra-text-muted': '#627BCB',
        'terra-text-grey': '#E9E9E9',
        'terra-background-gray': '#F3F5FD',
        'terra-background-secondary': '#F9FAFF',
        'terra-button-primary': '#0759E7',
        'terra-button-secondary': '#E8EEFC',
        'terra-link': '#459CF4',
        'is-connected-green': '#1DAA8E',
        'not-connected-red': '#FF5561',
        'is-loading-yellow': '#FEF08A',
        'is-loading-grey': '#ededf2',
      },
      boxShadow: {
        'extra-light-bottom': '0px 0.65px 1px 0px #cfd8ea',
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
