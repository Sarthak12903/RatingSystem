/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#000000",
          dark: "#0a0a0a",
        },
        card: "#1a1a2e",
        input: "#252538",
        accent: {
          cyan: "#00d4ff",
          blue: "#0066ff",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a0a0a0",
          muted: "#666666",
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)",
        "gradient-danger": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      },
      boxShadow: {
        "glow-cyan": "0 4px 20px rgba(0, 212, 255, 0.3)",
        "glow-blue": "0 4px 20px rgba(0, 102, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
