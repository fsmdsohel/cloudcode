import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: {
            50: "rgba(168, 85, 247, 0.05)",
            100: "rgba(168, 85, 247, 0.1)",
            200: "rgba(168, 85, 247, 0.2)",
            300: "rgba(168, 85, 247, 0.3)",
            400: "#A855F7",
            500: "#9333EA",
            600: "#7E22CE",
          },
          blue: {
            50: "rgba(59, 130, 246, 0.05)",
            100: "rgba(59, 130, 246, 0.1)",
            200: "rgba(59, 130, 246, 0.2)",
            300: "#4D7DFF",
            400: "#3B82F6",
            500: "#2563EB",
          },
        },
        surface: {
          DEFAULT: "#0F1117",
          secondary: "rgba(17, 24, 39, 0.5)",
          card: "rgba(255, 255, 255, 0.02)",
          hover: "rgba(255, 255, 255, 0.03)",
        },
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.2)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        blob: "blob 7s infinite",
        ping: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
