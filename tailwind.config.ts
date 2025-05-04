import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "furia-red": "#FF0000",
        "furia-red-dark": "#CC0000",
        "furia-black": "#000000",
        "furia-gray": "#1A1A1A",
        "furia-green": "#00FF00",
        "furia-green-dark": "#00CC00",
      },
    },
  },
  plugins: [],
};

export default config;
