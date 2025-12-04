const { tailwindColors } = require("@ursine-arcana/shared/dist/theme/colors");
const {
  tailwindTypography,
} = require("@ursine-arcana/shared/dist/theme/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
      fontFamily: tailwindTypography.fontFamily,
      fontSize: tailwindTypography.fontSize,
    },
  },
  plugins: [],
};
