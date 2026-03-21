import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        raccoon_retreat: {
          primary: "#63c7b2",
          "primary-content": "#0f2c29",

          secondary: "#9ecf7a",
          "secondary-content": "#1f3116",

          accent: "#ffd36e",
          "accent-content": "#3a2a0d",

          neutral: "#7ca18f",
          "neutral-content": "#f4fbf8",

          "base-100": "#f9f7ef",
          "base-200": "#eef6ea",
          "base-300": "#dff0e8",
          "base-content": "#42534b",

          info: "#8ed4ec",
          "info-content": "#123746",

          success: "#78c98f",
          "success-content": "#163121",

          warning: "#f6b86c",
          "warning-content": "#4d2e0b",

          error: "#e97d6a",
          "error-content": "#fff5f2",
        },
      },
      {
        raccoon_retreat_night: {
          primary: "#58b9a6",
          "primary-content": "#081d1a",

          secondary: "#7fb06b",
          "secondary-content": "#10200e",

          accent: "#f4c963",
          "accent-content": "#2f2208",

          neutral: "#2f5a4a",
          "neutral-content": "#e9f6ef",

          "base-100": "#172621",
          "base-200": "#1e312b",
          "base-300": "#26403a",
          "base-content": "#e7efe9",

          info: "#7abfd8",
          "info-content": "#0b2630",

          success: "#6fbe86",
          "success-content": "#0b2015",

          warning: "#e8aa57",
          "warning-content": "#2f1d08",

          error: "#e27866",
          "error-content": "#2a0f0a",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
} satisfies Config;
