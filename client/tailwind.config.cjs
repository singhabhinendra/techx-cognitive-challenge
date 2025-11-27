module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neonBlue: "#57f0ff",
        neonPurple: "#9b7bff"
      },
      boxShadow: {
        neon: "0 4px 30px rgba(99,102,241,0.2)"
      }
    }
  },
  plugins: []
};
