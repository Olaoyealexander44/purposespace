// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: { roboto: ['Roboto', 'sans-serif'] },
      keyframes: {
        glow: {
          '0%': { filter: 'brightness(1.2) contrast(1.2) drop-shadow(0 0 5px #00bf63)' },
          '50%': { filter: 'brightness(1.5) contrast(1.3) drop-shadow(0 0 15px #00bf63)' },
          '100%': { filter: 'brightness(1.2) contrast(1.2) drop-shadow(0 0 5px #00bf63)' },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        glow: 'glow 2.5s ease-in-out infinite alternate',
        fadeInUp: "fadeInUp 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
