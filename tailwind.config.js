/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgba(var(${variableName}))`;
  };
}

module.exports = {
  darkMode: "class",
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          primary: withOpacity("--color-primary"),
          secondary: withOpacity("--color-secondary"),
        },
        brand: {
          DEFAULT: "rgb(131, 69, 6)",
          ink: "rgb(100, 54, 12)",
          soft: "rgb(244, 238, 233)",
          line: "rgb(220, 203, 185)",
        },
      },
      textColor: {
        palette: {
          base: withOpacity("--color-text-base"),
          mute: withOpacity("--color-text-muted"),
          side: withOpacity("--color-text-side"),
        },
      },
      backgroundColor: {
        palette: {
          fill: withOpacity("--color-bg"),
          card: withOpacity("--color-bg-side"),
          dark: withOpacity("--color-bg-dark"),
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Iowan Old Style"', "Georgia", "serif"],
        body: [
          '"Be Vietnam Pro"',
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        english: "'Poppins', 'Roboto', 'sans-serif'",
      },
    },
  },
  plugins: [],
};
