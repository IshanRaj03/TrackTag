module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        color1: "#04364A",
        color2: "#176B87",
        color3: "#64CCC5",
        color4: "#DAFFFB",
        offwhite: "#fffbfc",

        // green: "#3E9242",
        // mintgreen: "#E3F2E1",
        // darkgreen: "#1D4D4F",
        // midnightblue: "#2C3E50",
        // primary: {
        //   DEFAULT: "#E43030",
        //   orange: "#D48D3B",
        //   green: "#3E9242",
        // },
        // secondary: "#282828",
        // "gray-200": "#EAECF0",
        // "gray-300": "D0D5DD",
        // "gray-500": "#667085",
        // "gray-600": "#475467",
        // "gray-700": "#344054",
        // "gray-900": "#101828",
        // "white-100": "#F4F4F4",
        // "white-200": "#EDF0F8",
        // "black-100": "#3D4258",
        // "neutral-black": "#23263B",
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
      maxWidth: {
        "10xl": "1440px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        spaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        10: "10px",
      },
    },
  },
  plugins: [],
};
