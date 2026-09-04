/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pewter, Steel Blue & Taupe Executive Palette (#909EAE, #5C8DC5, #AD9E90, #736F60)
        pewter: {
          light: '#909EAE',   // Slate Blue-Gray
          blue: '#5C8DC5',    // Primary Cobalt Steel Blue
          darkBlue: '#3B72AF', // Deep Steel Blue for high-contrast text/buttons
          taupe: '#AD9E90',   // Warm Taupe
          darkTaupe: '#8C7A6B',// Rich Warm Taupe for text
          stone: '#736F60',   // Deep Stone
        },
        // Semantic Mapping for Clean Light Theme
        odyssey: {
          darkest: '#F8FAFC',
          primary: '#5C8DC5',
          vibrant: '#3B72AF',
          mint: '#5C8DC5',
          taupe: '#AD9E90',
        },
        command: {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B',
          950: '#0F172A',
          border: '#E2E8F0',
          'border-active': 'rgba(92, 141, 197, 0.5)',
          'border-taupe': 'rgba(173, 158, 144, 0.4)',
        },
        cyber: {
          cyan: '#5C8DC5',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#8B5CF6',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'clean-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'clean': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'clean-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'clean-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'clean-card': '0 0 0 1px rgba(226, 232, 240, 0.8), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'clean-card-hover': '0 0 0 1px rgba(92, 141, 197, 0.35), 0 8px 20px -4px rgba(92, 141, 197, 0.12)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [],
}
