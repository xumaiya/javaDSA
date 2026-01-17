/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New color palette
        olive: {
          dark: '#3D4127',      // Very dark olive green
          DEFAULT: '#636B2F',    // Medium-dark olive green (primary)
          light: '#BAC095',      // Light sage green
          pale: '#D4DE95',       // Very light yellow-green (accent)
        },
        // Semantic color mappings
        primary: {
          DEFAULT: '#636B2F',
          dark: '#3D4127',
          light: '#BAC095',
          pale: '#D4DE95',
        },
        background: {
          DEFAULT: '#F5F7F0',   // Very light background
          dark: '#3D4127',
          light: '#FAFBF8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#636B2F',
          light: '#F9FAF6',
        },
        text: {
          DEFAULT: '#3D4127',
          light: '#636B2F',
          muted: '#8A9070',
          inverse: '#F5F7F0',
        },
        border: {
          DEFAULT: '#BAC095',
          dark: '#636B2F',
          light: '#D4DE95',
        },
        accent: {
          DEFAULT: '#D4DE95',
          dark: '#BAC095',
          light: '#E8F0C0',
        },
        // Dark mode specific colors (black/white theme)
        dark: {
          bg: '#0a0a0a',           // Near-black background
          surface: '#141414',      // Slightly lighter surface
          'surface-hover': '#1f1f1f', // Surface hover state
          text: '#ffffff',         // White text
          'text-muted': '#a0a0a0', // Muted gray text
          border: '#2a2a2a',       // Dark border
          accent: '#4ade80',       // Green accent for dark mode
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(61, 65, 39, 0.08)',
        'medium': '0 4px 12px rgba(61, 65, 39, 0.12)',
        'strong': '0 8px 24px rgba(61, 65, 39, 0.16)',
      },
    },
  },
  plugins: [],
};
