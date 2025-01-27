/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          light: "#F5F7FA", // Background
          DEFAULT: "#124E66", // Main color
          dark: "#0D3B4D", // Darker shade
          hover: "#1A6B8C", // Hover state
          border: "#2E3944", // Borders
        },
        secondary: {
          light: "#E8EDF2", // Secondary background
          DEFAULT: "#748D92", // Secondary text
          dark: "#5A6F73", // Darker secondary
          hover: "#8AA1A6", // Hover state
        },
        accent: {
          blue: "#3B82F6", // Accent blue
          green: "#10B981", // Success
          yellow: "#F59E0B", // Warning
          purple: "#8B5CF6", // Special actions
        },
        danger: {
          light: "#FEE2E2", // Light red background
          DEFAULT: "#EF4444", // Main red
          dark: "#DC2626", // Dark red
          hover: "#B91C1C", // Hover state
          border: "#FCA5A5", // Red borders
        },
        text: {
          primary: "#1F2937", // Main text
          secondary: "#4B5563", // Secondary text
          light: "#9CA3AF", // Light text
          white: "#FFFFFF", // White text
        },
      },
    },
  },
  plugins: [],
};
